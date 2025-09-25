import express from "express";
import Stripe from "stripe";
import Payment from "../models/Payment.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, userId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Bites&Brief Payment" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:8080/success",
cancel_url: "http://localhost:8080/cancel",

    });

    // Save payment as pending
    const payment = new Payment({
      userId,
      sessionId: session.id,
      amount,
      status: "pending",
    });
    await payment.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/status/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
