const simple = require("./scripts/simple.js");
const HTTPreq = require("./scripts/httpRequest")
const db = require("./scripts/databaseReq.js")
//const test = require("./test")
const TelegramBot = require('node-telegram-bot-api')
var fs = require('fs');
const httpRequest = require("./scripts/httpRequest");

var token = fs.readFileSync('./data/TOKEN.token', { encoding: 'utf8' });

const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/start/, (match) =>{
  db.checkIfExist(db.hash(match.chat.id.toString()), function(result){
    if (result == 1) {
      HTTPreq.translate(match.chat.id.toString(), "Chat già registrata", function(result){
        bot.sendMessage(match.chat.id, result)
      })
      return "stop"
    } else {
      var hash = db.hash(match.chat.id.toString())
      db.start(hash, match.from.language_code)
      httpRequest.translate(match.chat.id.toString(), "Registrazione effettuata con successo\nLingua impostata su **.\nPer cambiare lingua fare ** e il language code della lingua scelta", function(result){
        var outTrsStart = result.split("**")
        bot.sendMessage(match.chat.id, outTrsStart[0] + match.from.language_code + outTrsStart[1] + " /c_language " + outTrsStart[2])
      })
    }
  })
})

bot.onText(/\/delete/, match =>{
  HTTPreq.translate(match.chat.id.toString(), "CON LA CANCELLAZIONE DELLA CHAT SI PERDERANNO TUTTI I DATI SALVATI, PER PROCEDERE DIGITARE ", function(result){
    bot.sendMessage(match.chat.id, result + " /c_delete.sure")
  })
})

bot.onText(/\/c_delete.sure/, match =>{
  HTTPreq.translate(match.chat.id.toString(), "DATI ELIMINATI, PER RIEFFETTUARE LA REGISTRAZIONE DIGITARE ", function(result){
    db.deleteChat(db.hash(match.chat.id.toString()))
    bot.sendMessage(match.chat.id, result + " /start")
  })
})

bot.onText(/\/language/, (match) =>{
  var hash = db.hash(match.chat.id.toString())
  db.get_language(hash, function(result){
    HTTPreq.translate(match.chat.id.toString(), "La lingua di questa chat è impostata su ** (questo è un language code)", function(translated){
      translated = translated.split("**")
      bot.sendMessage(match.chat.id, translated[0] + result + translated[1])
    })
  })
})

bot.onText(/\/c_language (.+)/, (match, msg) =>{
  var hash = db.hash(match.chat.id.toString())
  db.change_language(hash, msg[1].toString(), function(result){
    HTTPreq.translate(match.chat.id.toString(), "Lingua aggiornata su", function(translated){
      bot.sendMessage(match.chat.id, translated + " " + result)
    })
  })
})

bot.onText(/\/join_date/, (match) =>{
  var hash = db.hash(match.chat.id.toString())
  db.get_date(hash, function(result){
    HTTPreq.translate(match.chat.id.toString(), "La registrazione è stata effettuata", function(translated){
      bot.sendMessage(match.chat.id, translated + " " + result)
    })
  })
})

bot.onText(/\/info/, (match) =>{
  var hash = db.hash(match.chat.id.toString())
  db.info(hash, function(result){
    HTTPreq.translate(match.chat.id, "L'iscizione al bot è stata fatta **\nLa lingua impostata è su", function(translated){
      translated = translated.split("**")
      bot.sendMessage(match.chat.id, translated[0] + result[0] + translated[1] + " " + result[1])
    })
  })
})

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
  HTTPreq.translate(match.chat.id, "Il valore attuale del Bitcoin è di", function(translated){
    bot.sendMessage(match.chat.id, translated + " " + bitValue + "€")
  })
})

bot.onText(/\/cit/, (match) =>{
  var hash = db.hash(match.chat.id.toString())
  db.get_language(hash, function(result){
    var out = HTTPreq.quotes(result)
    if (out.content === undefined){
      out = "QUESTO COMANDO NON SUPPORTA LA LINGUA SELEZIONATA"
    } else {
      out = "✍️\"" + out.content + "\"" + "\n" + out.originator.name
    }
    bot.sendMessage(match.chat.id, out)
  })
})

bot.onText(/\/translate/, (match) =>{
  var firstStep = true
  HTTPreq.translate(match.chat.id, "Per tradurre scrivere per prima cosa il language code (attento alle maiuscole) verso il quale si vuole tradurre (per annullare scrivere _stop)", function(translated){
    bot.sendMessage(match.chat.id, translated)
    bot.on("text", (match2) =>{
      var langCode = match2.text.toString()
      if (langCode == "_stop"){
        HTTPreq.translate(match.chat.id, "Traduzione fermata", function(translated){
          bot.sendMessage(match.chat.id, translated)
          firstStep = false
        })
      } else if (firstStep == true) {
        var secondStep = true
        HTTPreq.translate(match.chat.id, "Scrivere ora il testo da tradurre (per annullare scrivere _stop)", function(result){
          if (firstStep == true){bot.sendMessage(match.chat.id, result)}
          firstStep = false
          bot.on("text", (match3) =>{
            if (match3.text.toString() == "_stop"){
              HTTPreq.translate(match.chat.id, "Traduzione fermata", function(translated){
                bot.sendMessage(match.chat.id, translated)
                firstStep = false
                secondStep = false
              })
            } else if (secondStep ==true){
              firstStep = false
              secondStep = false
              HTTPreq.translateUser(match3.text.toString(), langCode, function(result){
                bot.sendMessage(match.chat.id, match3.text.toString() + " => " + langCode + " = " + result)
              })
            }
          })
        })
      }
    })
  })
})

bot.onText(/\/today/, (match) =>{
  var hash = db.hash(match.chat.id.toString())
  HTTPreq.dateFact(function(result){
    var out = "Today, " + result
    db.get_language(hash, function(lang){
      HTTPreq.translateUser(out, lang, function(translated){
        bot.sendMessage(match.chat.id, translated)
      })
    })
  })
})

bot.on("polling_error", console.log);
