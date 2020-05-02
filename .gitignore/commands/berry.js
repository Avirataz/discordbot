const Discord = require("discord.js");
const fs = require("fs");
const berrys = require("../playerequipment/berrys.json");
const botconfig = require("../botconfig.json");
const purple = botconfig.purple;
const green = botconfig.green;

module.exports.run = async (bot, message, args) => {

  if(!berrys[message.author.id]) berrys[message.author.id] = {
    berrys: 0
  };

  let uBerrys = berrys[message.author.id].berrys;

  if(!args[1]){
    let BerryEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor(green)
    .setThumbnail(message.author.displayAvatarURL)
    .addField("Berrys", uBerrys);
    return message.channel.send(BerryEmbed);
  }

  // if(args[0] === "giveall"){
  //   if(!message.member.hasPermission("ADMINISTRATOR")) return;
  //
  //   return;
  // }

  if(args[0] === "set"){
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    let mentUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
    if(!mentUser) return message.reply("Utilisation : .berry set [@user] [montant]");
    let BerryAmt = parseInt(args[2]);

    berrys[mentUser.id] = {
      berrys: BerryAmt
    };
    fs.writeFile("./playerequipment/berrys.json", JSON.stringify(berrys), (err) => {
      if (err) console.log(err)
    });
    message.reply(`L'argent de ${mentUser} est maintenant de ${berrys[mentUser.id].berrys} 💰`);

    return
  }

}

module.exports.help = {
  name: "berry"
}
