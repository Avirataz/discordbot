const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  let user = message.mentions.users.first() || message.author;

  let AvatarEmbed = new Discord.RichEmbed()
  .setAuthor(`${user.username}`)
  .setImage(user.displayAvatarURL)
  message.channel.send(AvatarEmbed)
};

module.exports.help = {
  name: "avatar"
}
