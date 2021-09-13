module.exports = {
  echo : function (message, match) {
    return [message.chat.id, match[1]]
  },
  hi : function (){
    const greetings = ["Ciao", "Salve", "Ma salve", "Ma ciao", "Hello", "👋", "Ciaooooo", "No"]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }
}