import paymentModel from "../models/payment.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const payments = await paymentModel.find({
      user: userId,
      status: "PENDING",
    });

    const totalSales = payments.reduce((sum, payment) => {
      return sum + payment.amount;
    }, 0);
    res.status(200).json({
      success: true,
      count: payments.length,
      totalSales: totalSales,
      payments,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
