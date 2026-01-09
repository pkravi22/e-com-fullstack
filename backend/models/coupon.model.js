import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  discount: {
    type: Number,
  },
});

const Coupon = new mongoose.model("Coupon", CouponSchema);

export default Coupon;
