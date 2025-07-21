const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Your tokens
const VERIFY_TOKEN = 'investwithintent7287'; // <-- your verify token
const PAGE_ACCESS_TOKEN = 'EAAJpFvdBZAjwBPAMMZAipai9Q7Syj5a3XAetIWGRM4tTVx1kECcIy69beKZCy8MgB1qCQOCLhZCI5CHFTtikTKHe8IZCZAVQlvA6LIlZCycmsg0fvfvIhc9Lt4E4u3muKpI8QZCCKF0k5CnFqktAZCT7d2nFl9wgQ9ynrdY21r3aCG5DiqTcd6KEpFAQ2cSbwuKgzA86PGxAxh8I1Wwmal3fZAxHsB4SLMmf68kiB7vC0ip0iazPAyztDT';

// Load DM rules from rules.json
function shouldSendDM(commentText) {
  const rules = JSON.parse(fs.readFileSync('rules.json', 'utf-8'));
  return rules.dm_keywords.some(keyword => commentText.toLowerCase().includes(keyword));
}

function getDMMessage() {
  const rules = JSON.parse(fs.readFileSync('rules.json', 'utf-8'));
  return rules.dm_message;
}

// Verification endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook POST to receive comment events
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'instagram') {
    body.entry.forEach(async (entry) => {
      entry.changes.forEach(async (change) => {
        if (change.field === 'comments') {
          const commentId = change.value.id;
          const commentText = change.value.text || '';
          const userId = change.value.from?.id; // Needed to send DM

          // 1. Public reply (like before)
          const message = "Thanks for your comment!";
          try {
            const url = `https://graph.facebook.com/v19.0/${commentId}/replies`;
            await axios.post(url, null, {
              params: { message, access_token: PAGE_ACCESS_TOKEN },
            });
            console.log(`Replied to comment ${commentId}`);
          } catch (error) {
            console.error('Error replying to comment:', error.response?.data || error.message);
          }

          // 2. Send DM if keywords match
          if (shouldSendDM(commentText) && userId) {
            const dmMessage = getDMMessage();
            try {
              await axios.post(`https://graph.facebook.com/v19.0/${userId}/messages`, {
                recipient: { id: userId },
                message: { text: dmMessage }
              }, {
                params: { access_token: PAGE_ACCESS_TOKEN }
              });
              console.log(`Sent DM to ${userId}: "${dmMessage}"`);
            } catch (error) {
              console.error('Error sending DM:', error.response?.data || error.message);
            }
          }
        }
      });
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
