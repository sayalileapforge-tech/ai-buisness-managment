const express = require("express");
const stripe = require("stripe");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

// Stripe initialization
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_DOMAIN || "http://localhost:3000",
  credentials: true,
}));

// Body parser middleware - important for webhook
app.use(express.json());

// Store raw body for webhook verification
app.use((req, res, next) => {
  if (req.path === "/webhook") {
    let rawBody = "";
    req.setEncoding("utf8");
    req.on("data", chunk => {
      rawBody += chunk;
    });
    req.on("end", () => {
      req.rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Create checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId, customerEmail, successUrl, cancelUrl } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: "Missing required fields: priceId, successUrl, cancelUrl",
      });
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({
      error: error.message || "Failed to create checkout session",
    });
  }
});

// Webhook handler
app.post("/webhook", async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const rawBody = req.rawBody;

    if (!sig || !rawBody) {
      return res.status(400).json({ error: "Missing signature or body" });
    }

    let event;

    try {
      event = stripeClient.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        console.log("✅ Checkout session completed:", {
          sessionId: event.data.object.id,
          customerId: event.data.object.customer,
          email: event.data.object.customer_email,
          amount: event.data.object.amount_total,
        });
        // TODO: Update user subscription status in database
        break;

      case "invoice.payment_succeeded":
        console.log("✅ Invoice payment succeeded:", {
          invoiceId: event.data.object.id,
          customerId: event.data.object.customer,
          amount: event.data.object.amount_paid,
        });
        // TODO: Log payment in database
        break;

      case "customer.subscription.created":
        console.log("✅ Subscription created:", {
          subscriptionId: event.data.object.id,
          customerId: event.data.object.customer,
          status: event.data.object.status,
          planId: event.data.object.items.data[0].price.id,
        });
        // TODO: Save subscription to database
        break;

      case "customer.subscription.updated":
        console.log("✅ Subscription updated:", {
          subscriptionId: event.data.object.id,
          customerId: event.data.object.customer,
          status: event.data.object.status,
        });
        // TODO: Update subscription in database
        break;

      case "customer.subscription.deleted":
        console.log("✅ Subscription deleted:", {
          subscriptionId: event.data.object.id,
          customerId: event.data.object.customer,
        });
        // TODO: Cancel subscription in database
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stripe server running on http://localhost:${PORT}`);
  console.log(`📝 Webhook endpoint: http://localhost:${PORT}/webhook`);
});
