var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const db = require("./databaseReq.js")
var fs = require('fs');
var date = new Date() 
module.exports = {
  bitcoin : function(){
    var xhr = new XMLHttpRequest()
    var url = "https://api.coindesk.com/v1/bpi/currentprice/EUR.json";
    xhr.onreadystatechange = function () {

      if (xhr.readyState == 4 && xhr.status == 200) { 
      
        var jsonData = JSON.parse(xhr.responseText);
        data = jsonData.bpi.EUR.rate
      }
    
    };
    xhr.open("GET", url, false)
    xhr.send()
    return xhr
  },
  quotes : function(language){
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    url = "https://quotes15.p.rapidapi.com/quotes/random/?language_code=" + language.toString()

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState !== this.DONE) {
        return "ERRORE"
      }
    });

    xhr.open("GET", url, false);
    xhr.setRequestHeader("x-rapidapi-host", "quotes15.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", fs.readFileSync('./data/QUOTES_KEY.token', { encoding: 'utf8' }));

    xhr.send();
    return JSON.parse(xhr.responseText)
  },
  translate : function(chatId, data, callback){
    var hash = db.hash(chatId.toString())
    db.get_language(hash, function(result){
      if (result == "it"){
        return callback(data)
      } else {
        url = "https://translo.p.rapidapi.com/translate?text=" + data + "&to=" + result + "&from=it"
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
  
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            return callback(JSON.parse(this.responseText).translated_text)
          }
        });
  
        xhr.open("POST", url);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("x-rapidapi-host", "translo.p.rapidapi.com");
        xhr.setRequestHeader("x-rapidapi-key", fs.readFileSync('./data/TRANSLATE_KEY.token', { encoding: 'utf8' }));
  
        xhr.send()
      }
    })
  },
  translateUser : function(msg, lang, callback){
    
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    url = "https://translo.p.rapidapi.com/translate?text=" + msg + "&to=" + lang
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE && xhr.status == 200) {
        return callback(JSON.parse(this.responseText).translated_text)
      }
    });
    
    xhr.open("POST", url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-rapidapi-host", "translo.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", fs.readFileSync('./data/TRANSLATE_KEY.token', { encoding: 'utf8' }));
    
    xhr.send();

  },
  dateFact : function(){
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    url = "https://numbersapi.p.rapidapi.com/" + date.getMonth() +"/" + date.getDate() + "/date?fragment=true&json=true"
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      }
    });

    xhr.open("GET", url);
    xhr.setRequestHeader("x-rapidapi-host", "numbersapi.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "");

    xhr.send();
    return xhr.responseText
  }
}

