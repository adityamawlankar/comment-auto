const fs = require("fs");

function generateReply(commentText) {
  const text = commentText.toLowerCase();

  if (text.includes("start") || text.includes("cost")) {
    return "Thanks for your interest! Please DM 'start' for more details.";
  } else if (text.includes("hello") || text.includes("hi")) {
    return "Hi there! 👋 Thanks for commenting! Check your dm";
  } else {
    return "Thanks for your comment!";
  }
}

function shouldSendDM(commentText) {
  const rules = JSON.parse(fs.readFileSync("rules.json", "utf-8"));
  return rules.dm_keywords.some(keyword => commentText.toLowerCase().includes(keyword));
}

function getDMMessage() {
  const rules = JSON.parse(fs.readFileSync("rules.json", "utf-8"));
  return rules.dm_message;
}

module.exports = { generateReply, shouldSendDM, getDMMessage };
