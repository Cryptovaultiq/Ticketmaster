// /api/create-payment.js
// Vercel Serverless function — creates a NOWPayments BNB (BSC) payment

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).send("Method Not Allowed");

  try {
    const body = req.body || {};

    const price_amount = Number(body.price_amount ?? 0);
    const price_currency = body.price_currency || "usd";

    // ✅ Absolutely correct for BNBBSC
    const pay_currency = "bnb";
    const network = "bsc";

    // Use the same order_id from frontend
    const order_id =
      body.order_id || `tm_${Date.now()}_${Math.floor(Math.random() * 9000)}`;

    // Build base URL
    const siteUrl =
      process.env.SITE_URL ||
      `https://${process.env.VERCEL_URL || "yourproject.vercel.app"}`;

    const cleanUrl = siteUrl.replace(/\/$/, "");

    // FINAL NOWPAYMENTS PAYLOAD (Correct!)
    const payload = {
      order_id,
      price_amount,
      price_currency,
      pay_currency,
      network,
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

    // NOWPayments Invoice API
    const resp = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": NOW_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    // Handle API-level errors
    if (!resp.ok) {
      console.error("NOWPayments error:", data);
      return res.status(resp.status).json(data);
    }

    // Return invoice link
    return res.status(200).json({
      invoice_url: data.invoice_url || data.payment_url,
    });
  } catch (err) {
    console.error("create-payment error:", err);
    return res.status(500).json({ error: err.message });
  }
}