// /api/webhook.js
import crypto from "crypto";

export const config = {
  api: { bodyParser: false }, // Required: NOWPayments sends raw body
};

// Helper to get raw body
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  // === OPTIONAL (SAFE) CORS ===
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-nowpayments-signature"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // ============================

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const rawBody = await getRawBody(req);

    // Signature header
    const signature =
      req.headers["x-nowpayments-signature"] ||
      req.headers["x-nowpayments-sig"];

    if (!signature) {
      return res.status(400).send("Missing signature");
    }

    // Your NOWPayments webhook secret
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) {
      return res.status(500).send("IPN secret missing");
    }

    // Verify signature
    const computedHmac = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (computedHmac !== signature) {
      console.warn("❌ Invalid NOWPayments signature");
      return res.status(400).send("Invalid signature");
    }

    // Parse the valid payload
    const payload = JSON.parse(rawBody.toString());
    console.log("NOWPayments Webhook Received:", payload);

    // Payment success status
    if (["finished", "confirmed"].includes(payload.payment_status)) {
      console.log(
        `✅ PAYMENT SUCCESS — Order ${payload.order_id} | Amount: ${payload.pay_amount} ${payload.pay_currency}`
      );

      // 👉 Put your business logic here
      // - Save to DB
      // - Mark ticket sold
      // - Send email
      // - Generate QR ticket
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).send("Server Error");
  }
}