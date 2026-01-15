import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import paymentRoute from "./routes/payment.js";
import webhookRoute from "./routes/webhook.js";
import connectDB from "./configs/mongodb.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Connect DB
connectDB();

// CORS
app.use(cors());

// ❗❗ Stripe Webhook MUST be raw body
app.use("/api/webhook", express.raw({ type: "application/json" }));

// Normal JSON for all other routes
app.use(express.json());

app.use("/api/payment", paymentRoute);
app.use("/api/webhook", webhookRoute);

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "success.html"));
});

app.get("/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "cancel.html"));
});

// ❌ REMOVE app.listen()
// ✅ EXPORT app for Vercel
export default app;
