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
  .setFooter("Page 2/7 [Spéciale Guerre]", "https://i.imgur.com/sYyiDPr.png")
  .setColor(red)
  .addField("Navire de Guerre (♾ pers.) (20💖 / 5 💣)", "Nom de l'item : naviredeguerre, Prix : 125 millions 💰")
  .addField("Grand navire de Guerre (3 Pers.) (30💖 / 10 💣)", "Nom de l'item : grandnaviredeguerre, Prix : 750 millions 💰")
  .addField("Galion de Guerre (♾ Pers) (80💖 / 25 💣)", "Nom de l'item : galiondeguerre, Prix : 1.25 milliard 💰")
  .addField("Flotte de Guerre (♾ Pers) (350💖 / 100 💣)", "Nom de l'item : flottedeguerre, Prix : 2.5 milliard 💰")
  .addField("Enorme Flotte de Guerre (♾ Pers) (750💖 / 250 💣)", "Nom de l'item : enormeflottedeguerre, Prix : 3.5 milliard 💰")
  message.delete();
  message.channel.send(shopEmbed).then(msg => {msg.delete(30000)});

}

module.exports.help = {
  name: "shop2"
}