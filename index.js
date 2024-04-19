const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

// Replace with your Telegram bot token
const token = '6515314653:AAGUczjypae2nZLdfwQOc0oTXjuG4oxtedI';

// Initialize bot with token
const bot = new TelegramBot(token, { polling: true });

// Initialize bot with token
function logActivity(msg) {
  const user = msg.from;
  const chat = msg.chat;
  const command = msg.text.toLowerCase();

  console.log(`Telegram Bot Usage Activities`);
  console.log(`• User ID: ${user.id}`);
  console.log(`• Username: ${user.username || 'Tidak ada'}`);
  console.log(`• Chat ID: ${chat.id}`);
  console.log(`• Order: ${command}`);
}

// Event listener for messages from users
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const command = msg.text.toLowerCase();

  // Record bot usage activity in the console log
  logActivity(msg);

  // Respond to commands /mix
  if (command.startsWith('/mix')) {
    // Extracts arguments from messages
    const args = command.split(' ');
    const url = args[1];
    const time = args[2];
    const thread = args[3];
    const rate = args[4];

    // Checks whether the message format is correct
    if (args.length === 5 && url && time && thread && rate) {
      // Runs the mix.js file with the given arguments
      exec(`node mix.js ${url} ${time} ${thread} ${rate}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          bot.sendMessage(chatId, 'Successful');
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          bot.sendMessage(chatId, 'Successful');
          return;
        }
        // Menampilkan output stdout jika berhasil
        console.log(`stdout: ${stdout}`);
        bot.sendMessage(chatId, 'The process has started.');
      });
    } else {
      // Memberi tahu pengguna bahwa format pesan tidak benar
      bot.sendMessage(chatId, 'The message format is incorrect. Use format: /mix [url] [time] [thread] [rate]');
    }
  }
});
