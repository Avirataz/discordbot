const Discord = require("discord.js");
const moment = require("moment");
const fs = require("fs");
const berrys = require("../playerequipment/berrys.json");
let firstname = require("../playerequipment/firstname.json");
let lastname = require("../playerequipment/lastname.json");
let prime = require("../playerequipment/prime.json");
let avatarurl = require("../playerequipment/avatar.json");
let bateau = require("../playerequipment/bateau.json");
let fruit = require("../playerequipment/fruit.json");
let equipement = require("../playerequipment/equipement.json");

module.exports.run = async (bot, message, args) => {

  if(!firstname[message.author.id]){
    firstname[message.author.id] = {
      firstname: 0
    };
  }
  
  let prenom = firstname[message.author.id].firstname;

   if(!lastname[message.author.id]){
    lastname[message.author.id] = {
      lastname: 0
    };
  }
  
   let nom = lastname[message.author.id].lastname


   if(!avatarurl[message.author.id]){
    avatarurl[message.author.id] = {
      avatarurl: 0
    };
  }
  
   let avatar = avatarurl[message.author.id].avatarurl


      if(!bateau[message.author.id]){
    bateau[message.author.id] = {
      bateau: 0
    };
  }
 
   let bato = bateau[message.author.id].bateau


   if(!equipement[message.author.id]){
    equipement[message.author.id] = {
      equipement: 0
    };
  }
 
   let iteme = equipement[message.author.id].equipement

   if(!berrys[message.author.id]){
    berrys[message.author.id] = {
      berrys: 0
    };
  }

    if(!prime[message.author.id]){
    prime[message.author.id] = {
      prime: 0
    };
  }


  if(!fruit[message.author.id]){
    fruit[message.author.id] = {
      fruit: 0
    };
  }
  let mention = message.mentions.users.first();
  if (mention) console.log(mention.id);
  let user = message.mentions.users.first() || message.author;
  var userinfo = new Discord.RichEmbed()
  
 
  .setAuthor(user.username)
  .setThumbnail(`${avatar}`)
  .setDescription("***Fiche de Personnage*** **[WIP]**")
  .setColor("#f49e42")
  .addField("Nom & Prénom :", `${nom} ${prenom}`)
  .addField("Richesse :", `${berrys[user.id].berrys} 💰`, false)
  .addField("Prime :", `${prime[user.id].prime} 💰`, true)
  .addField("Bateau :", `${bateau[user.id].bateau}`, true)
  .addField("Fruit :", `${fruit[user.id].fruit}`, true)
  .addField("Equipements :", `${equipement[user.id].equipement}`, true)
   message.channel.send(userinfo);


};

module.exports.help = {
  name: "info"
}
