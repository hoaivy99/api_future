const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5594270482:AAE2a4ik3xG7VDh4vSX5OjY8mVQ1YuqLZfI';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });


const htmlSignal = `
🚀 <b>ENTRY SIGNAL - LONG/APEUSDT</b> 🚀
 <b></b> 
Time: 23:02:00 28/06/2022 
---------------------------------------
<b>Id:</b> 62addf5526029b592922a068 
<b>Rate:</b> 0.25117022491152574 
<b>priceOld:</b> 5.2554
<b>priceFuture:</b> 5.2686
<b>timeOld:</b> 06/29/2022 12:47:37
<b>timeFuture:</b> 06/29/2022 12:47:37
----------------------------------------`

const htmlSignalTP = `
✅ <b>RESULT - TP/APEUSDT</b> ✅ 
<b></b> 
Time: 23:02:00 28/06/2022 
-----------------------------------
<b>Id:</b> 62addf5526029b592922a068 
<b>Target:</b> TP1 / 20%
<b>Entry:</b> 5.2554
<b>PriceTarget:</b> 5.2554
-----------------------------------`

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    console.log(chatId);
  
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
  });



bot.sendMessage(986733667, htmlSignal, { parse_mode: "HTML" });


