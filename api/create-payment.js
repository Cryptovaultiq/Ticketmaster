// /api/create-payment.js
// Vercel Serverless function — creates a NOWPayments BNB (BSC) payment

export default async function handler(req, res) {
  // --- ✅ Enable CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Respond to preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const body = req.body || {};

    const price_amount = Number(body.price_amount ?? 0);
    const price_currency = body.price_currency || "usd";

    // Correct for BNB on Binance Smart Chain
    const pay_currency = "bnb";
    const network = "bsc";

    const order_id =
      body.order_id || `tm_${Date.now()}_${Math.floor(Math.random() * 9000)}`;

    // Build base URL
    const siteUrl =
      process.env.SITE_URL ||
      `https://${process.env.VERCEL_URL || "yourproject.vercel.app"}`;

    const cleanUrl = siteUrl.replace(/\/$/, "");

    // Payload for NOWPayments
    const payload = {
      order_id,
      price_amount,
      price_currency,
      order_description: "Ticket Purchase",
      ipn_callback_url: `${cleanUrl}/api/webhook`,
      success_url: `${cleanUrl}/success.html`,
      cancel_url: `${cleanUrl}/cancel.html`,
      metadata: body.metadata || {},
    };

    const NOW_KEY = process.env.NOWPAYMENTS_API_KEY;
    if (!NOW_KEY) {
      return res.status(500).json({ error: "API key missing" });
    }

    // Request invoice from NOWPayments
    const resp = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": NOW_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("NOWPayments error:", data);
      return res.status(resp.status).json(data);
    }

    return res.status(200).json({
      invoice_url: data.invoice_url || data.payment_url,
    });
  } catch (err) {
    console.error("create-payment error:", err);
    return res.status(500).json({ error: err.message });
  }
}