var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
var fs = require('fs');

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
  quotes : function(){
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState !== this.DONE) {
        return "ERRORE"
      }
    });

    xhr.open("GET", "https://quotes15.p.rapidapi.com/quotes/random/?language_code=it", false);
    xhr.setRequestHeader("x-rapidapi-host", "quotes15.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", fs.readFileSync('./data/QUOTES_KEY.token', { encoding: 'utf8' }));

    xhr.send();
    var out = JSON.parse(xhr.responseText).content + "\ndi " + JSON.parse(xhr.responseText).originator.name
    return out
  }
}
