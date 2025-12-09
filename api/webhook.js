// /api/webhook.js
// NOWPayments IPN Webhook — supports BNB (BEP20) payments
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false, // raw body needed for signature validation
  },
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
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const raw = await getRawBody(req);

    // NOWPayments sends signature in one of these headers
    const headerSig =
      req.headers["x-nowpayments-sig"] ||
      req.headers["x-nowpayments-signature"] ||
      req.headers["x-nowpayments-sign"];

    if (!headerSig) {
      console.warn("Missing NOWPayments signature header");
      return res.status(400).send("Missing signature");
    }

    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) {
      console.error("NOWPAYMENTS_IPN_SECRET not configured");
      return res.status(500).send("IPN secret not configured");
    }

    // Compute HMAC SHA512 for verification
    const computed = crypto
      .createHmac("sha512", secret)
      .update(raw)
      .digest("hex");

    if (computed !== headerSig) {
      console.warn("Invalid NOWPayments signature", {
        computed,
        headerSig,
      });
      return res.status(400).send("Invalid signature");
    }

    // Signature OK → parse the payload
    const payload = JSON.parse(raw.toString("utf8"));
    console.log("NOWPayments IPN Received:", payload);

    const {
      payment_status,
      payment_id,
      order_id,
      pay_currency,
      pay_amount,
      price_amount,
      network,
    } = payload;

    // You are using BNB, so:
    // pay_currency = "bnb"
    // network = "bep20"

    if (payment_status === "finished" || payment_status === "paid" || payment_status === "confirmed") {
      console.log(
        `💰 Payment successful for order ${order_id} — received ${pay_amount} ${pay_currency} (BNB, BEP20)`
      );

      // TODO:
      // 🔥 mark your order as paid in DB
      // 🔥 generate ticket / send email
      // 🔥 unlock user content

    } else {
      console.log(
        `📩 Status update for order ${order_id}: ${payment_status}`
      );
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook processing error", err);
    return res.status(500).send("Server error");
  }
}