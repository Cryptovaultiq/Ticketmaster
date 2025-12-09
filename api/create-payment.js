// /api/create-payment.js
// Vercel Serverless function — creates a NOWPayments BNB (BEP20) payment

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const body = req.body || {};

    // For BNB, amount must be in USD (NOWPayments converts internally)
    const price_amount =
      body.price_amount === null || body.price_amount === undefined
        ? 0 // 0 means "buyer enters amount"
        : body.price_amount;

    const price_currency = body.price_currency || "usd";

    // *** FIXED FOR BNB (BEP20) ***
    const pay_currency = "bnb"; // NOWPayments uses "bnb" not "bnb_bep20"
    const network = "bep20";

    const order_id = body.order_id || `order_${Date.now()}`;

    const siteUrl =
      process.env.SITE_URL ||
      `https://${process.env.VERCEL_URL || "yourproject.vercel.app"}`;

    const payload = {
      price_amount: price_amount,
      price_currency: price_currency,
      pay_currency: pay_currency, // ← BNB ONLY
      network: network, // ← BEP20
      order_id: order_id,

      ipn_callback_url: `${siteUrl.replace(/\/$/, "")}/api/webhook`,
      success_url: `${siteUrl.replace(/\/$/, "")}/success.html`,
      cancel_url: `${siteUrl.replace(/\/$/, "")}/cancel.html`,

      metadata: body.metadata || {},
    };

    const NOW_KEY = process.env.NOWPAYMENTS_API_KEY;
    if (!NOW_KEY)
      return res
        .status(500)
        .json({ error: "NOWPAYMENTS_API_KEY not set in env" });

    // Create payment request
    const resp = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": NOW_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({ error: data });
    }

    // Return data (includes payment_url)
    return res.status(200).json(data);
  } catch (err) {
    console.error("create-payment error", err);
    return res.status(500).json({ error: err.message });
  }
}