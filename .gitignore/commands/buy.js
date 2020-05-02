const Discord = require("discord.js");
const prices = require("../storedata/prices.json");
const names = require("../storedata/names.json");
const fs = require("fs");
const berrys = require("../playerequipment/berrys.json");
const botconfig = require("../botconfig.json");
const purple = botconfig.purple;
const orange = botconfig.orange;

module.exports.run = async (bot, message, args) => {

  let price = prices[args[0]];
  let item = names[args[0]];
  if(!price) return message.reply("Introuvable.");

  if(!berrys[message.author.id]){
    berrys[message.author.id] = {
      berrys: 0
    }
  }

  if(berrys[message.author.id].berrys < price) return message.reply("Tu n'as pas la somme requise, va faire la manche..");
  let uBerrys = berrys[message.author.id].berrys;
  berrys[message.author.id] = {
  berrys: uBerrys - price
  };

  fs.writeFile("./playerequipment/berrys.json", JSON.stringify(berrys), (err) => {
    if (err) console.log(err)
  });

  message.reply(`Tu as acheté ${item} pour ${price} berrys.`);

  //Bateau

    const bateau = require("../playerequipment/bateau.json");
    if(!bateau[message.author.id]) bateau[message.author.id] = {
      bateau: item
    };
    bateau[message.author.id] = {
      bateau: item
    };
    fs.writeFile("./playerequipment/bateau.json", JSON.stringify(bateau), (err) => {
      if (err) console.log(err)
    });

  //Armes/tenues

  const equipement = require("../playerequipment/equipement.json");
  if(!equipement[message.author.id]) equipement[message.author.id] = {
    equipement: iteme
  };
  equipement[message.author.id] = {
    equipement: iteme
  };
  fs.writeFile("./playerequipment/equipement.json", JSON.stringify(equipement), (err) => {
    if (err) console.log(err)
  });

}

module.exports.help = {
  name: "buy"
}
