// /api/webhook.js
import crypto from "crypto";

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const raw = await getRawBody(req);
    const headerSig =
      req.headers["x-nowpayments-signature"] || req.headers["x-nowpayments-sig"];

    if (!headerSig) return res.status(400).send("Missing signature");

    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) return res.status(500).send("IPN secret missing");

    const computed = crypto.createHmac("sha512", secret).update(raw).digest("hex");

    if (computed !== headerSig) {
      console.warn("Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    const payload = JSON.parse(raw.toString());

    console.log("Payment webhook:", payload);

    if (["finished", "confirmed"].includes(payload.payment_status)) {
      console.log(
        `Payment SUCCESS – Order: ${payload.order_id} | ${payload.pay_amount} BNB`
      );
      // YOUR SUCCESS LOGIC HERE
      // Example: mark order as paid, send email, update database, etc.
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Error");
  }
}