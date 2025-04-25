console.log("1. Starting script...");

try {
  console.log("2. Loading dotenv...");
  require("dotenv").config();
  console.log("3. Dotenv loaded");

  console.log("4. Loading express...");
  const express = require("express");
  console.log("5. Express loaded");

  console.log("6. Loading telegraf...");
  const { Telegraf } = require("telegraf");
  console.log("7. Telegraf loaded");

  console.log("8. Initializing express app...");
  const app = express();
  app.use(express.json());
  console.log("9. Express app initialized");

  console.log("10. Reading TELEGRAM_TOKEN...");
  const botToken = process.env.TELEGRAM_TOKEN;
  console.log("11. TELEGRAM_TOKEN:", botToken ? "Set" : "Not set");
  if (!botToken) throw new Error("TELEGRAM_TOKEN is not set");

  console.log("12. Creating Telegraf bot...");
  const bot = new Telegraf(botToken, {
    telegram: { webhookReply: true },
  });
  console.log("13. Telegraf bot created");

  console.log("14. Setting up webhook route...");
  app.post("/webhook", async (req, res) => {
    console.log("Received Telegram webhook:", JSON.stringify(req.body, null, 2));
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error handling webhook:", error.message, error.stack);
      res.status(500).send("Error");
    }
  });
  console.log("15. Webhook route set");

  console.log("16. Registering bot commands...");
  bot.start((ctx) => ctx.reply(" 🔥 Welcome to Memes War : Robbie 🔥 Send /play to launch the game 🎮"));
  bot.command("play", (ctx) => ctx.reply("🎮 Ready to play? Click here : https://memes-war-robbie.vercel.app"));
  console.log("17. Bot commands registered");

  console.log("18. Starting express server...");
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`19. Server running on port ${port}`);
  });

  console.log("20. Testing Telegram connection...");
  bot.telegram.getMe()
    .then((botInfo) => {
      console.log(`21. Bot info: @${botInfo.username}`);
      console.log("22. Bot ready for webhooks (no polling)");
    })
    .catch((err) => console.error("Error connecting to Telegram:", err.message, err.stack));

} catch (error) {
  console.error("Script error:", error.message, error.stack);
}