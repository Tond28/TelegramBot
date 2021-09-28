var mysql = require('mysql');
const fs = require('fs');
var SHA3 = require('sha3');
var data = JSON.parse(fs.readFileSync('./data/db.json', { encoding: 'utf8' }))
var con = mysql.createConnection({
    host: "localhost",
    user: data.username,
    password: data.password
  });

  con.connect(function(err) {
    con.query("USE telegrambot_db")
    if (err) throw err;
    console.log("Connected!");
  });

  module.exports = {
    hash : function(data){
      var hash = SHA3.SHA3Hash();
      hash.update(data);
      return hash.digest("hex");
      
    },
    start : function(chatId, language){
      con.query("CALL start_bot(?, ?)", [chatId, language], function (err) {
        if (err) throw err;
        console.log("nuovo utente aggiunto");
      });
    },
    checkIfExist : function (chatId, callback){
      con.query("CALL check_exist(?)", [chatId], function(err, results){
          if (err) throw err;
          return callback(results[0][0].data_out);
      })
    },
    deleteChat : function (chatId){
      con.query("CALL delete_chat (?)", [chatId], function(err) {
        if (err) throw err
        console.log(chatId + "cancellata")
      })
    },
    get_language : function (chatId, callback){
      con.query("CALL get_language (?)", [chatId], function(err, results){
        if (err) throw err
        return callback(results[0][0].language)
      })
    },
    change_language : function (chatId, new_language, callback){
      con.query("CALL change_language (?, ?)", [chatId, new_language], function(err, results){
        if (err) throw err
        return callback(results[0][0].language)
      })
    },
    get_date : function _(chatId, callback){
      con.query("CALL get_date (?)", [chatId], function(err, results){
        if (err) throw err
        var out = results [0][0]
        var date = out.join_date.toString()
        date = date.split("00:00:00")[0]
        return callback(date)
      })
    },
    info : function(chatId, callback){
      con.query("CALL chat_info (?)", [chatId], function(err, results){
        if (err) throw err
        var out = results [0][0]
        var date = out.join_date.toString()
        date = date.split("00:00:00")[0]
        var out = [date, results[0][0].language]
        return callback(out)
      })
    }
  }

