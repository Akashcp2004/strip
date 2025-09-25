import express from "express";
import Stripe from "stripe";
import Payment from "../models/Payment.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // Update payment status in DB
      await Payment.findOneAndUpdate(
        { sessionId: session.id },
        { status: "success" },
        { new: true }
      );
      break;

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      await Payment.findOneAndUpdate(
        { sessionId: failedIntent.id },
        { status: "failed" },
        { new: true }
      );
      break;

    case "payment_intent.canceled":
      const canceledIntent = event.data.object;
      await Payment.findOneAndUpdate(
        { sessionId: canceledIntent.id },
        { status: "canceled" },
        { new: true }
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

export default router;
