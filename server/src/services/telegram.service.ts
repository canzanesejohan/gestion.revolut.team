import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

let bot: TelegramBot | null = null;

export function initTelegramBot(): TelegramBot | null {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn("⚠️  TELEGRAM_BOT_TOKEN no configurado. Notificaciones Telegram deshabilitadas.");
    return null;
  }

  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id.toString();
    bot?.sendMessage(
      chatId,
      `✅ ¡Bot conectado!\n\nTu Chat ID es: \`${chatId}\`\n\nCopia este ID y pégalo en tu perfil de la plataforma para recibir notificaciones.`,
      { parse_mode: "Markdown" }
    );
  });

  bot.onText(/\/id/, (msg) => {
    const chatId = msg.chat.id.toString();
    bot?.sendMessage(chatId, `Tu Chat ID es: \`${chatId}\``, {
      parse_mode: "Markdown",
    });
  });

  console.log("🤖 Telegram Bot iniciado correctamente");
  return bot;
}

export async function sendTelegramMessage(
  chatId: string,
  message: string
): Promise<void> {
  if (!bot) return;

  try {
    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  } catch (error) {
    console.error(`Error enviando mensaje Telegram a ${chatId}:`, error);
  }
}

export function getTelegramBot(): TelegramBot | null {
  return bot;
}
