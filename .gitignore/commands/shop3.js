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
  .setFooter("Page 3/7 [Spéciale Sous-Marins]", "https://i.imgur.com/sYyiDPr.png")
  .setColor(purple)
  .addField("Sous-Marin (♾ pers.) (5💖 / 0 💣)", "Nom de l'item : sous-marin, Prix : 350 million 💰")
  .addField("Sous-marin de guerre (3 Pers.) (5💖 / 5 💣)", "Nom de l'item : sous-marindeguerre, Prix : 700 million 💰")
  .addField("Sous-marin d'exploration (1 Pers) (20💖 / 0 💣)", "Nom de l'item : sous-marindexplo, Prix : 700 million 💰")
  message.delete();
  message.channel.send(shopEmbed).then(msg => {msg.delete(30000)});

}

module.exports.help = {
  name: "shop3"
}