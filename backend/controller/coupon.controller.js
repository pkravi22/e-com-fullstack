import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching coupon",
    });
  }
};
export const validateCoupon = async (req, res) => {
  try {
    const userId = req.user._id;
    const { code, orderAmount } = req.body;

    const user = await User.findById(userId).populate("coupons.coupon");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userCoupon = user.coupons.find((c) => c.coupon.code === code);

    if (!userCoupon) {
      return res.status(403).json({
        success: false,
        message: "Coupon not assigned to user",
      });
    }

    if (userCoupon.isUsed) {
      return res.status(400).json({
        success: false,
        message: "Coupon already used",
      });
    }

    const coupon = userCoupon.coupon;

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "Coupon inactive",
      });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order ₹${coupon.minOrderAmount}`,
      });
    }

    const discountAmount = (orderAmount * coupon.discount) / 100;

    const finalAmount = orderAmount - discountAmount;

    res.status(200).json({
      success: true,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Coupon validation failed",
    });
  }
};
