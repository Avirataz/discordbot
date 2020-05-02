const Discord = require("discord.js");
const fs = require("fs");
const berrys = require("../playerequipment/berrys.json");
const botconfig = require("../botconfig.json");
const purple = botconfig.purple;
const green = botconfig.green;
const red = botconfig.red;
const orange = botconfig.orange;

module.exports.run = async (bot, message, args) => {

  let shopEmbed = new Discord.RichEmbed()
  .setTitle("Boutique")
  .setDescription("Taper .buy <nomitem> pour acheter")
  .setFooter("Page 4/7 [Spéciale Event]", "https://i.imgur.com/sYyiDPr.png")
  .setColor(red)
  .addField("Baratie (♾ pers.) (20💖 / 0 💣)", "Nom de l'item : baratie, Prix : 900 million 💰")
  .addField("Oro Jackson (♾ Pers) (♾💖 / ♾ 💣)", "Nom de l'item : orojackson, Prix : ♾ 💰")
  message.delete();
  message.channel.send(shopEmbed).then(msg => {msg.delete(30000)});



}

module.exports.help = {
  name: "shop4"
}