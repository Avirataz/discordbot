const Discord = require("discord.js");
const fs = require("fs");
const berrys = require("../playerequipment/berrys.json");
const botconfig = require("../botconfig.json");
const purple = botconfig.purple;
const green = botconfig.green;

module.exports.run = async (bot, message, args) => {

if(!berrys[message.author.id]){
  berrys[message.author.id] = {
  berrys: 0
  };
  return message.reply(`Désolé, tu as ${berrys[message.author.id].berrys} berrys.`);
}

if(isNaN(args[1])) return message.reply("Tu te trompes quelques part....")
if(berrys[message.author.id].berrys < args[2]) return message.reply(`Désolé, tu n'as que ${berrys[message.author.id].berrys} berrys.`);


let mentUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!mentUser) return message.reply("Usage: !berrys pay [@user] [amount]");
if(message.author.id === mentUser.id) return message.reply("Can't pay yourself");
if(!berrys[mentUser.id]){
  berrys[mentUser.id] = {
    berrys: 0
  }
}
let uBerrys = berrys[message.author.id].berrys;
let mBerrys = berrys[mentUser.id].berrys;
if(uBerrys < args[1]) return message.reply("T'as pas assez de bogossitude.");
if(args[1] < 1) return message.reply("whoops");
if(!args[1]) return message.reply("Utilisation: .berrypay [@user] [montant]");

berrys[message.author.id] = {
berrys: uBerrys - parseInt(args[1])
};
berrys[mentUser.id] = {
berrys: mBerrys + parseInt(args[1])
};

fs.writeFile("./playerequipment/berrys.json", JSON.stringify(berrys), (err) => {
  if (err) console.log(err)
});
message.channel.send(`${mentUser} a reçu ${args[1]} berrys par ${message.author}`);

}

module.exports.help = {
  name: "berrypay"
}
