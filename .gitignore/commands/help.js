const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  let helpembed = new Discord.RichEmbed()
  .setDescription("À l'aide !")
  .addField("Il semble que tu sois perdu, contacte un membre du personnel pour + d'aide, les commandes basiques sont .fouille .say et .info, mais il existe d'innombrables commandes ;)");

  message.channel.send(helpembed);

  if(message.member.hasPermission("MANAGE_MESSAGES")){
  let modembed = new Discord.RichEmbed()
  .setDescription("M0D HAX0R Menu")
  .setColor("#8300ff")
  .addField("COMMANDES DES MODOS", "addrole, removerole, kick, warn, warnlevel, ban, doggo, answer, prefix");

  try{
    await message.author.send(modembed);
    message.react("💰")
  }catch(e){
    message.reply("T'es DM sont vérouillé, donc je ne peux pas t'envoyer le MOD HAX0R MENU.")
  }
}

}

module.exports.help = {
  name: "help"
}
