

// controllers/voucherSeriesController.js
import VoucherSeries from "../Model/VoucherSeriesSchema.js";

export const getSeriesByVoucher = async (req, res) => {
  try {
    const { voucherType } = req.query;
    const cmp_id = req.params.cmp_id;

    if (!voucherType || !cmp_id) {
      return res
        .status(400)
        .json({ message: "voucherType and cmp_id are required" });
    }

    const seriesDoc = await VoucherSeries.findOne({
      voucherType: voucherType === "sale" ? "sales" : voucherType,
      cmp_id,
    }).lean();

    if (!seriesDoc) {
      return res
        .status(404)
        .json({ message: "No series found for this voucher type" });
    }

    // seriesDoc._id is the VoucherSeries document id (e.g. 69b1055e2a47bb531f77a46d)
    // seriesDoc.series is your array of series
    return res.status(200).json({
      voucherSeriesId: seriesDoc._id,
      series: seriesDoc.series,
    });
  } catch (error) {
    console.error("Error fetching series:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
