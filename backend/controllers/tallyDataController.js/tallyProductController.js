import { getApiLogs } from "../../utils/logs.js";
import { buildBulkResponse } from "../../helpers/tallyDataHelpers.js";
import productModel from "../../Model/ProductSchema.js";
import { Brand, Category, Subcategory } from "../../Model/ProductSubDetails.js";
import { Godown } from "../../Model/ProductSubDetails.js";


// @desc Save products from Tally (base data only, with default godown)
// @route POST /api/tally/giveTransaction
export const addProducts= async (req, res) => {
  try {
    const productsToSave = req?.body?.data;

    if (!Array.isArray(productsToSave) || productsToSave.length === 0) {
      return res.status(400).json({ message: "No products to save" });
    }

    // basic result structure for buildBulkResponse
    const results = {
      success: [],
      failure: [],
      skipped: [],
    };

    const validProducts = [];

    // 1) Validate input & build validProducts
    for (const product of productsToSave) {
      if (
        !product.product_master_id ||
        !product.cmp_id ||
        !product.Primary_user_id ||
        !product.product_name
      ) {
        results.skipped.push({
          id: product.product_master_id || "unknown",
          name: product.product_name || "unnamed",
          reason: !product.cmp_id
            ? "Missing cmp_id"
            : !product.Primary_user_id
            ? "Missing Primary_user_id"
            : !product.product_master_id
            ? "Missing product_master_id"
            : "Missing product_name",
        });
        continue;
      }

      validProducts.push(product);
    }

    if (validProducts.length === 0) {
      const responsePayload = buildBulkResponse({
        message: "No valid products to process",
        success: results.success,
        failure: results.failure,
        skipped: results.skipped,
        total: productsToSave.length,
      });

      return res.status(200).json(responsePayload);
    }

    const cmp_id = validProducts[0].cmp_id;
    const Primary_user_id = validProducts[0].Primary_user_id;

    getApiLogs(cmp_id, "Product Data(base)");

    // 2) Ensure default godown exists (no auto-create)
    const defaultGodown = await Godown.findOne({
      cmp_id,
      defaultGodown: true,
    });

    if (!defaultGodown) {
      return res.status(400).json({
        message:
          "Default godown not found. Please set up a default godown before saving products.",
      });
    }

    // 3) Collect unique reference ids
    const brandIdMap = {};
    const categoryIdMap = {};
    const subcategoryIdMap = {};
    const existingProductIds = [];

    for (const product of validProducts) {
      if (product.brand_id) brandIdMap[product.brand_id] = true;
      if (product.category_id) categoryIdMap[product.category_id] = true;
      if (product.subcategory_id) subcategoryIdMap[product.subcategory_id] = true;
      existingProductIds.push(product.product_master_id);
    }

    const brandIds = Object.keys(brandIdMap);
    const categoryIds = Object.keys(categoryIdMap);
    const subcategoryIds = Object.keys(subcategoryIdMap);

    // 4) Fetch reference data and existing products in parallel
    const [brands, categories, subcategories, existingProducts] =
      await Promise.all([
        brandIds.length
          ? Brand.find({ brand_id: { $in: brandIds }, cmp_id })
          : [],
        categoryIds.length
          ? Category.find({ category_id: { $in: categoryIds }, cmp_id })
          : [],
        subcategoryIds.length
          ? Subcategory.find({
              subcategory_id: { $in: subcategoryIds },
              cmp_id,
            })
          : [],
        productModel.find({
          product_master_id: { $in: existingProductIds },
          cmp_id,
          Primary_user_id,
        }),
      ]);

    // 5) Build lookup maps
    const brandMap = {};
    const categoryMap = {};
    const subcategoryMap = {};
    const existingProductMap = {};

    brands.forEach((b) => {
      brandMap[b.brand_id] = b._id;
    });

    categories.forEach((c) => {
      categoryMap[c.category_id] = c._id;
    });

    subcategories.forEach((s) => {
      subcategoryMap[s.subcategory_id] = s._id;
    });

    existingProducts.forEach((p) => {
      existingProductMap[p.product_master_id] = p;
    });

    // 6) Prepare operations array for batch create/update
    const operations = [];
    const BATCH_SIZE = 200;

    for (const product of validProducts) {
      const enhancedProduct = { ...product };

      enhancedProduct.brand =
        product.brand_id && brandMap[product.brand_id]
          ? brandMap[product.brand_id]
          : null;

      enhancedProduct.category =
        product.category_id && categoryMap[product.category_id]
          ? categoryMap[product.category_id]
          : null;

      enhancedProduct.sub_category =
        product.subcategory_id && subcategoryMap[product.subcategory_id]
          ? subcategoryMap[product.subcategory_id]
          : null;

      // Attach default godown as initial GodownList
      enhancedProduct.GodownList = [
        {
          godown: defaultGodown._id,
          batch: "Primary Batch",
          balance_stock: 0,
        },
      ];

      const existingProduct = existingProductMap[product.product_master_id];

      if (existingProduct) {
        operations.push({
          type: "update",
          id: existingProduct._id,
          product: enhancedProduct,
        });
      } else {
        operations.push({
          type: "create",
          product: enhancedProduct,
        });
      }
    }

    // 7) Execute operations in batches
    for (let i = 0; i < operations.length; i += BATCH_SIZE) {
      const batchOps = operations.slice(i, i + BATCH_SIZE);

      const batchPromises = batchOps.map((op) => {
        if (op.type === "update") {
          return productModel
            .findByIdAndUpdate(op.id, op.product, { new: true })
            .then((result) => ({
              success: true,
              result,
              operation: "updated",
            }))
            .catch((error) => ({
              success: false,
              error: error.message,
              productId: op.product.product_master_id,
            }));
        }

        return new productModel(op.product)
          .save()
          .then((result) => ({
            success: true,
            result,
            operation: "created",
          }))
          .catch((error) => ({
            success: false,
            error: error.message,
            productId: op.product.product_master_id,
          }));
      });

      const batchResults = await Promise.all(batchPromises);

      for (const r of batchResults) {
        if (r.success) {
          results.success.push({
            id: r.result.product_master_id,
            operation: r.operation,
          });
        } else {
          results.failure.push({
            id: r.productId,
            error: r.error,
          });
        }
      }
    }

    const responsePayload = buildBulkResponse({
      message: "Products processing completed",
      success: results.success,
      failure: results.failure,
      skipped: results.skipped,
      total: productsToSave.length,
    });

    return res.status(201).json(responsePayload);
  } catch (error) {
    console.error("Error in saveProductsFromTally:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
