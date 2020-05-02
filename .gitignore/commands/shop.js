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
  .setFooter("Page 1/7 (Taper .shop2 pour accéder à la prochaine page.)", "https://i.imgur.com/sYyiDPr.png")
  .setColor(orange)
  .addField("Barque(max 1 pers.) (2💖 / 0 💣)", "Nom de l'item : barque, Prix : 5 milles 💰")
  .addField("Bateau de fortune(max 2 pers.) (3💖 / 0 💣)", "Nom de l'item : bateaudefortune, Prix :12.5 milles 💰")
  .addField("Bateau(max 3 pers.) (4💖 / 0 💣)", "Nom de l'item : bateausimple, Prix : 25 milles 💰")
  .addField("Voilier(max 4 pers.) (3💖 / 0 💣)", "Nom de l'item : voilier, Prix : 35 milles 💰")
  .addField("Grand Bateau(max 7 pers.) (10💖 / 0 💣)", "Nom de l'item : grandbateau, Prix : 75 milles 💰")
  .addField("Bateau de course(max 2 pers.) (5💖 / 0 💣)", "Nom de l'item : barque, Prix : 250 milles 💰")
  .addField("Navire (max 12 pers.) (20💖 / 1 💣)", "Nom de l'item : navire, Prix : 150 milles 💰")
  message.delete();
  message.channel.send(shopEmbed).then(msg => {msg.delete(30000)});

}

module.exports.help = {
  name: "shop"
}