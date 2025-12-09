// /api/webhook.js
import crypto from "crypto";

export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const rawBody = await getRawBody(req);

    // Read signature from headers
    const signature =
      req.headers["x-nowpayments-signature"] ||
      req.headers["x-nowpayments-sig"];

    if (!signature) {
      return res.status(400).send("Missing signature");
    }

    // Get IPN secret from env
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) {
      return res.status(500).send("IPN secret missing");
    }

    // Compute HMAC for verification
    const computedHmac = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (computedHmac !== signature) {
      console.warn("❌ Invalid NOWPayments signature");
      return res.status(400).send("Invalid signature");
    }

    // Parse the validated payload
    const payload = JSON.parse(rawBody.toString());
    console.log("✅ NOWPayments Webhook Received:", payload);

    // SUCCESS CONDITIONS
    if (["finished", "confirmed"].includes(payload.payment_status)) {
      console.log(
        `💰 PAYMENT SUCCESS → Order: ${payload.order_id} | Amount: ${payload.pay_amount} ${payload.pay_currency}`
      );

      // TODO: your business logic here
      // update DB, send email, unlock product, etc.
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).send("Server Error");
  }
}