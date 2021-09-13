const simple = require("./scripts/simple.js");
const HTTPreq = require("./scripts/httpRequest")
//const test = require("./test")
const TelegramBot = require('node-telegram-bot-api')
var fs = require('fs');


var token = fs.readFileSync('./data/TOKEN.token', { encoding: 'utf8' });

const bot = new TelegramBot(token, { polling: true })

  
bot.onText(/\/echo (.+)/, (msg, match) => {
  var message = simple.echo(msg, match)
	bot.sendMessage(message[0], message[1])
})

bot.on("text", (match) => {
  if (["ciao", "Ciao", "hello", "Hello", "salve", "Salve"].includes(match.text.toString())){
    bot.sendMessage(match.chat.id, simple.hi())
  }
})

bot.onText(/\/bitcoin/, (match) =>{
  var out = HTTPreq.bitcoin()
  var bitValue = JSON.parse(out.responseText).bpi.EUR.rate_float
  var bitOut = "Il valore attuale del Bitcoin è di " + bitValue + "€"
  bot.sendMessage(match.chat.id, bitOut)
})


bot.on("polling_error", console.log);
