const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Use a secure token to verify requests from Meta
const VERIFY_TOKEN = "mySecretToken123";  // Change this to a strong secret

app.use(express.json());

// GET: Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified for @invest_with_intent");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Webhook verification failed");
    res.sendStatus(403);
  }
});

// POST: Receive Instagram events
app.post("/webhook", (req, res) => {
  console.log("📩 Event received for @invest_with_intent:");
  console.dir(req.body, { depth: null });

  // You can add logic here to filter events related to your account
  // For example: Check if the event is from your page ID or IG user ID

  res.sendStatus(200);
});

app.listen(PORT, () =>
