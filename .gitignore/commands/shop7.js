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
  .setFooter("Page 6/6 [Spéciale Tenues]", "https://i.imgur.com/sYyiDPr.png")
  .setColor(orange)
  .addField("Tenue en tissu simple", "Nom de l'item : tenuetissu, Prix : 25000  💰")
  .addField("Tenue de combat rapprochée", "Nom de l'item : tenueapproche, Prix : 200000 💰")
  .addField("Tenue de combat améliorée", "Nom de l'item : tenueameliore, Prix : 350000 💰")
  message.delete();
  message.channel.send(shopEmbed).then(msg => {msg.delete(30000)});

}

module.exports.help = {
  name: "shop6"
}