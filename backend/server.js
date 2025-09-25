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
const PORT = process.env.PORT || 8080;
connectDB();

// Middleware
app.use(cors());

// JSON parser for all routes EXCEPT webhook
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/api/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use("/api/payment", paymentRoute);
app.use("/api/webhook", webhookRoute);


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


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
