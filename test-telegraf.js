console.log("1. Testing telegraf...");

try {
  console.log("2. Loading dotenv...");
  require("dotenv").config();
  console.log("3. Dotenv loaded");

  console.log("4. Loading telegraf...");
  const { Telegraf } = require("telegraf");
  console.log("5. Telegraf loaded");

  console.log("6. Reading TELEGRAM_TOKEN...");
  const botToken = process.env.TELEGRAM_TOKEN;
  console.log("7. TELEGRAM_TOKEN:", botToken ? "Set" : "Not set");
  if (!botToken) throw new Error("TELEGRAM_TOKEN is not set");

  console.log("8. Creating bot...");
  const bot = new Telegraf(botToken, {
    telegram: { webhookReply: true },
  });
  console.log("9. Bot created");

  console.log("10. Testing Telegram connection...");
  bot.telegram.getMe()
    .then((botInfo) => {
      console.log(`11. Bot info: @${botInfo.username}`);
      console.log("12. Launching bot...");
      bot.launch({ dropPendingUpdates: true })
        .then(() => console.log("13. Bot started"))
        .catch((err) => console.error("Error starting bot:", err.message, err.stack));
    })
    .catch((err) => console.error("Error connecting to Telegram:", err.message, err.stack));

} catch (error) {
  console.error("Script error:", error.message, error.stack);
}