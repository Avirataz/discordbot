const Discord = require("discord.js");
const fs = require("fs");
const botconfig = require("../botconfig.json");
const purple = botconfig.purple;
const green = botconfig.green;

module.exports.run = async (bot, message, args) => {



   if(args[0] === "prenom"){
    const firstname = require("../playerequipment/firstname.json");
    let prenom = args[1];
    firstname[message.author.id] = {
      firstname: prenom
    };
    fs.writeFile("./playerequipment/firstname.json", JSON.stringify(firstname), (err) => {
      if (err) console.log(err)
    });
    message.reply(`Votre prénom est désormais ${prenom}`)
  }

    if(args[0] === "nom"){
    const lastname = require("../playerequipment/lastname.json");
    let nom = args[1];
    lastname[message.author.id] = {
      lastname: nom
    };
    fs.writeFile("./playerequipment/lastname.json", JSON.stringify(lastname), (err) => {
      if (err) console.log(err)
    });
    message.reply(`Votre nom est désormais ${nom}`)
  }
  
    if(args[0] === "avatar"){
    const avatarurl = require("../playerequipment/avatar.json");
    let nom = args[1];
    avatarurl[message.author.id] = {
      avatarurl: nom
    };
    fs.writeFile("./playerequipment/avatar.json", JSON.stringify(avatarurl), (err) => {
      if (err) console.log(err)
    });
    message.reply(`Votre avatar a bien été modifié !`)
  }

    if(args[0] === "fruit"){
    const fruit = require("../playerequipment/fruit.json");
    let patpat = args[1];
    fruit[message.author.id] = {
      fruit: patpat
    };
    fs.writeFile("./playerequipment/fruit.json", JSON.stringify(fruit), (err) => {
      if (err) console.log(err)
    });
    message.reply(`Votre fruit a bien était mis à jour ! Il est désormais ${patpat}`)
  }


}

module.exports.help = {
  name: "rp"
}
