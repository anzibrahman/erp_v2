import mongoose from "mongoose";
import AccountGroup from "../../Model/AccountGroup.js";
import { buildBulkResponse } from "../../helpers/tallyDataHelpers.js";
import { getApiLogs } from "../../utils/logs.js";

/**
 * addAccountGroups - Import/Sync Account Groups from Tally
 *
 * Steps:
 * 1. Validate request body and required fields (Primary_user_id, cmp_id).
 * 2. Read Tally user name (tally_user_name) from the first item (same for all).
 * 3. Create a Map to detect duplicates inside the same request.
 * 4. For each valid item:
 *    - Validate required fields (Primary_user_id, cmp_id, accountGroup_id).
 *    - Convert IDs to ObjectId.
 *    - Build a bulkWrite upsert:
 *        filter: { accountGroup_id, cmp_id, Primary_user_id }
 *        update: $set (accountGroup, audit fields),
 *                $setOnInsert (identity fields).
 *    - Collect per-item errors into skippedItems.
 * 5. Execute AccountGroup.bulkWrite(ops, { ordered: false }).
 * 6. Use buildBulkResponse(...) to build API response.
 * 7. Decide HTTP status: 200 / 207 / 400 based on summary.
 */

export const addAccountGroups = async (req, res) => {
  try {
    const accountGroupsToSave = req?.body?.data;

    // 1. Basic validation for account groups array
    if (
      !Array.isArray(accountGroupsToSave) ||
      accountGroupsToSave.length === 0
    ) {
      return res.status(400).json({
        status: "failure",
        message: "No account groups data provided",
      });
    }

    // Extract required IDs and Tally user name from the first item
    const {
      Primary_user_id,
      cmp_id,
      tally_user_name, // expecting this from Tally (same for all docs)
    } = accountGroupsToSave[0] || {};

    if (!Primary_user_id || !cmp_id) {
      return res.status(400).json({
        status: "failure",
        message: "Primary_user_id and cmp_id are required in first item",
      });
    }

    // 2. Log this sync (optional)
    getApiLogs(cmp_id, "Account Groups Data");

    // 3. Tracking maps and counters
    const uniqueGroups = new Map(); // avoid duplicates within this request
    const skippedItems = [];
    let insertedCount = 0;
    let updatedCount = 0;

    const ops = [];

    // 4. Process each account group item
    for (let i = 0; i < accountGroupsToSave.length; i++) {
      const group = accountGroupsToSave[i];
      const itemIndex = i + 1;

      const rawPrimaryUserId = group?.Primary_user_id;
      const rawCmpId = group?.cmp_id;
      const rawAccountGroupId = group?.accountGroup_id;

      // Key to detect duplicates in the same request
      const key = `${rawCmpId}-${rawAccountGroupId}-${rawPrimaryUserId}`;

      // 4.a Skip exact duplicates in the same request
      if (uniqueGroups.has(key)) {
        skippedItems.push({
          item: itemIndex,
          reason: "Duplicate in request",
          data: { accountGroup_id: rawAccountGroupId },
        });
        continue;
      }
      uniqueGroups.set(key, true);

      // 4.b Validate required fields
      const missingFields = [];
      if (!rawPrimaryUserId) missingFields.push("Primary_user_id");
      if (!rawCmpId) missingFields.push("cmp_id");
      if (!rawAccountGroupId) missingFields.push("accountGroup_id");

      if (missingFields.length > 0) {
        skippedItems.push({
          item: itemIndex,
          reason: `Missing required fields: ${missingFields.join(", ")}`,
          data: { accountGroup_id: rawAccountGroupId },
        });
        continue;
      }

      try {
        // 4.c Convert IDs to ObjectId if needed
        let primaryUserObjectId = rawPrimaryUserId;
        if (typeof rawPrimaryUserId === "string") {
          primaryUserObjectId = new mongoose.Types.ObjectId(rawPrimaryUserId);
        }

        let cmpObjectId = rawCmpId;
        if (typeof rawCmpId === "string") {
          cmpObjectId = new mongoose.Types.ObjectId(rawCmpId);
        }

        // 4.d Define updatable fields (including audit info)
        const updatableFields = {
          accountGroup: group.accountGroup,
          source: "tally",
          lastUpdatedBySource: tally_user_name || "tally-sync",
          tallyUserName: tally_user_name || null,
        };

        // 4.e Push bulk upsert operation
        ops.push({
          updateOne: {
            filter: {
              accountGroup_id: rawAccountGroupId,
              cmp_id: cmpObjectId,
              Primary_user_id: primaryUserObjectId,
            },
            update: {
              $set: updatableFields,
              $setOnInsert: {
                accountGroup_id: rawAccountGroupId,
                cmp_id: cmpObjectId,
                Primary_user_id: primaryUserObjectId,
              },
            },
            upsert: true,
          },
        });
      } catch (itemError) {
        console.error(
          `Error preparing account group ${rawAccountGroupId}:`,
          itemError,
        );
        skippedItems.push({
          item: itemIndex,
          reason: `Processing error: ${itemError.message}`,
          data: { accountGroup_id: rawAccountGroupId },
        });
      }
    }

    // 5. Execute bulkWrite if we have valid operations
    if (ops.length > 0) {
      try {
        const bulkResult = await AccountGroup.bulkWrite(ops, {
          ordered: false,
        });

        insertedCount = bulkResult.upsertedCount || 0;
        // modifiedCount counts docs where something actually changed
        updatedCount = bulkResult.modifiedCount || 0;
      } catch (bulkError) {
        console.error("Error in AccountGroup.bulkWrite:", bulkError);

        if (bulkError.code === 11000) {
          return res.status(400).json({
            status: "failure",
            message: "Duplicate account groups data detected",
            error: bulkError.message,
          });
        }

        return res.status(500).json({
          status: "failure",
          message: "Bulk write error in account groups data",
          ...(process.env.NODE_ENV === "development" && {
            error: bulkError.message,
          }),
        });
      }
    }

    // 6. Build common response using helper
    const response = buildBulkResponse({
      entityName: "Account groups",
      totalReceived: accountGroupsToSave.length,
      insertedCount,
      updatedCount,
      skippedItems,
    });

    const { successCount, totalReceived } = response.summary;

    // 7. Decide HTTP status code: 200 / 207 / 400
    const statusCode =
      successCount > 0
        ? 200
        : skippedItems.length === totalReceived
          ? 400
          : 207;

    console.log("Account Groups Response:", response.summary);
    return res.status(statusCode).json(response);
  } catch (error) {
    console.error("Error in addAccountGroups:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "failure",
        message: "Validation error in account groups data",
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: "failure",
        message: "Duplicate account groups data detected",
        error: error.message,
      });
    }

    return res.status(500).json({
      status: "failure",
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};
