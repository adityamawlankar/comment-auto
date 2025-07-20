const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Your Meta verify token
const VERIFY_TOKEN = "mySecretToken123"; // Make sure this matches what you put on Meta

app.use(express.json());

// GET route for webhook verification
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

// POST route to receive Instagram events
app.post("/webhook", (req, res) => {
  console.log("📩 Event received for @invest_with_intent:");
  console.dir(req.body, { depth: null });
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Webhook server is running on port ${PORT}`);
});
