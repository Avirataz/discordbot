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
  .setFooter("Page 5/6 [Spéciale réservation]", "https://i.imgur.com/sYyiDPr.png")
  .setColor(orange)
  .addField("Navire de la Marine (7 Pers) (10💖 / 2 💣)", "Nom de l'item : naviremarine, Prix : 0 💰")
  message.delete();
  message.channel.send(shopEmbed).then(msg => {msg.delete(30000)});



}

module.exports.help = {
  name: "shop5"
}