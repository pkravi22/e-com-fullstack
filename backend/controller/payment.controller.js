import Cart from "../models/cart.model.js";
import paymentModel from "../models/payment.model.js";
import User from "../models/user.model.js";
import stripe from "../config/stripe.js";

export const createPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId, couponCode } = req.body;

    // 1️⃣ Fetch order
    const order = await Cart.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    let discountAmount = 0;
    let appliedCoupon = null;

    // 2️⃣ Apply coupon if exists
    if (couponCode) {
      const user = await User.findById(userId).populate("coupons.coupon");
      const userCoupon = user.coupons.find(
        (c) => c.coupon.code === couponCode && !c.isUsed
      );

      if (!userCoupon)
        return res.status(400).json({ message: "Invalid coupon" });

      appliedCoupon = userCoupon.coupon._id;
      discountAmount = (order.totalAmount * userCoupon.coupon.discount) / 100;
    }

    const finalAmount = order.totalAmount - discountAmount;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // you can add "upi", "netbanking", etc.
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Order #${orderId}`,
            },
            unit_amount: Math.round(finalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/payment-success`,
      cancel_url: `http://localhost:5173/payment-cancel`,
      metadata: {
        orderId: orderId.toString(),
        userId: userId.toString(),
      },
    });

    // 4️⃣ Save payment in DB
    const payment = await paymentModel.create({
      user: userId,
      order: orderId,
      amount: finalAmount,
      paymentMethod: "CARD",
      paymentGateway: "STRIPE",
      coupon: appliedCoupon,
      discountAmount,
      transactionId: session.id, // session id instead of paymentIntent
      status: "PENDING",
    });

    // 5️⃣ Send Stripe URL to frontend
    res.status(201).json({
      success: true,
      url: session.url, // user can redirect to this
      paymentId: payment._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Checkout session creation failed" });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const payment = await paymentModel.findOne({
      transactionId: paymentIntent.id,
    });

    if (!payment) return res.json({ received: true });

    // ✅ Update payment
    payment.status = "SUCCESS";
    payment.paidAt = new Date();
    await payment.save();

    // ✅ Mark order paid
    await Cart.findByIdAndUpdate(payment.order, {
      isPaid: true,
      paidAt: new Date(),
    });

    // ✅ Mark coupon used
    if (payment.coupon) {
      const user = await User.findById(payment.user);
      const userCoupon = user.coupons.find(
        (c) => c.coupon.toString() === payment.coupon.toString()
      );

      if (userCoupon) {
        userCoupon.isUsed = true;
        userCoupon.usedAt = new Date();
        await user.save();
      }
    }
  }

  res.json({ received: true });
};

export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, transactionId, status } = req.body;

    const payment = await Payment.findById(paymentId).populate("user coupon");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (status !== "SUCCESS") {
      payment.status = "FAILED";
      await payment.save();
      return res.status(400).json({ message: "Payment failed" });
    }

    payment.status = "SUCCESS";
    payment.transactionId = transactionId;
    payment.paidAt = new Date();
    await payment.save();

    // Mark order as paid
    await Order.findByIdAndUpdate(payment.order, {
      isPaid: true,
      paidAt: new Date(),
    });

    // Mark coupon as used
    if (payment.coupon) {
      const user = await User.findById(payment.user);
      const userCoupon = user.coupons.find(
        (c) => c.coupon.toString() === payment.coupon.toString()
      );
      if (userCoupon) {
        userCoupon.isUsed = true;
        userCoupon.usedAt = new Date();
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Payment verification failed" });
  }
};
