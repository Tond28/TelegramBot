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
  }
}
