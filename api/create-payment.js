// /api/create-payment.js
// Vercel Serverless function — creates a NOWPayments BNB (BSC) payment

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const body = req.body || {};

    const price_amount = body.price_amount ?? 0;
    const price_currency = body.price_currency || "usd";

    const pay_currency = "bnb"; // BNB
    const network = "bsc";      // Binance Smart Chain

    const order_id = body.order_id || `order_${Date.now()}`;

    const siteUrl =
      process.env.SITE_URL ||
      `https://${process.env.VERCEL_URL || "yourproject.vercel.app"}`;

    const payload = {
      price_amount,
      price_currency,
      pay_currency,
      network,
      order_id,
      order_description: "Ticketmaster Resell Ticket",
      ipn_callback_url: `${siteUrl.replace(/\/$/, "")}/api/webhook`,
      success_url: `${siteUrl.replace(/\/$/, "")}/success.html`,
      cancel_url: `${siteUrl.replace(/\/$/, "")}/cancel.html`,
      metadata: body.metadata || {},
    };

    const NOW_KEY = process.env.NOWPAYMENTS_API_KEY;
    if (!NOW_KEY) {
      return res.status(500).json({ error: "API key missing" });
    }

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