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

  // IDs autorisés
  const ALLOWED_USER_ID = 7970802345; // Remplace par ton user ID
  const ALLOWED_GROUP_ID = -1002589061657; // Remplace par le chat ID du groupe

  // Middleware pour vérifier les autorisations
  bot.use((ctx, next) => {
    const userId = ctx.from.id;
    const chatId = ctx.chat.id;
    const chatType = ctx.chat.type;

    console.log("Received update from:", ctx.from.username, "in chat:", chatType, "userId:", userId, "chatId:", chatId);

    if (chatType === "private" && userId !== ALLOWED_USER_ID) {
      ctx.reply("You are not allowed to talk in private with me. I'm faithful bruh ! Join @robbietherobotmeme");
      return;
    }
    if (chatType === "group" || chatType === "supergroup") {
      if (chatId !== ALLOWED_GROUP_ID) {
        ctx.reply("Trying to steal my work huh ?  Join @robbietherobotmeme.");
        return;
      }
    }

    return next(); // Passe à la commande si autorisé
  });

  console.log("14. Setting up webhook route...");
  app.post("/webhook", async (req, res) => {
    console.log("Webhook route hit, body:", JSON.stringify(req.body, null, 2));
    try {
      await bot.handleUpdate(req.body);
      console.log("Webhook processed successfully");
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error handling webhook:", error.message, error.stack);
      res.status(500).send("Error");
    }
  });
  console.log("15. Webhook route set");

  console.log("16. Setting up test route...");
  app.get("/test", (req, res) => {
    console.log("Test route hit");
    res.send("Server is running");
  });
  console.log("17. Test route set");

  console.log("18. Registering bot commands...");
  bot.start((ctx) => {
    console.log("Processing /start command from:", ctx.from.username, "in chat:", ctx.chat.type);
    ctx.reply("Welcome to Memes War: Robbie ! The first game involving the cute but not week meme on Supra !  Tap /play to launch the game 🤖");
  });

  bot.command(["play", "play@MemesWarRobbieBot"], async (ctx) => {
    console.log("Processing /play command from:", ctx.from.username, "in chat:", ctx.chat.type);
    try {
      await ctx.reply(" 🎮  Spartan, are you ready ?  🎮  https://t.me/MemesWarRobbieBot/MemesWarRobbieBot");
      console.log("Sent /play response successfully");
    } catch (error) {
      console.error("Error sending /play response:", error.message, error.stack);
    }
  });
  console.log("19. Bot commands registered");

  console.log("20. Starting express server...");
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`21. Server running on port ${port}`);
  });

  console.log("22. Testing Telegram connection...");
  bot.telegram.getMe()
    .then((botInfo) => {
      console.log(`23. Bot info: @${botInfo.username}`);
      console.log("24. Bot ready for webhooks");
    })
    .catch((err) => console.error("Error connecting to Telegram:", err.message, err.stack));

} catch (error) {
  console.error("Script error:", error.message, error.stack);
}