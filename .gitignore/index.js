const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const path = require('path');
const sqlite = require('sqlite');
const jimp = require('jimp');
bot.commands = new Discord.Collection();
client.commands = new Discord.Collection();
let cooldown = new Set();
let cdseconds = 5;
const chratis_cooldown_time = 5;
const money = require('discord-money');
const moment = require('moment');
const emoji = bot.emojis.get("559427989713190922");
var request = require("request");
let queue = {};
const berrys = require("../playerequipment/berrys.json");
let firstname = require("../playerequipment/firstname.json");
let lastname = require("../playerequipment/lastname.json");
let prime = require("../playerequipment/prime.json");
let avatarurl = require("../playerequipment/avatar.json");
let bateau = require("../playerequipment/bateau.json");
const purple = botconfig.purple;
const green = botconfig.green;
let fruit = require("../playerequipment/fruit.json");
let equipement = require("../playerequipment/equipement.json");
var prefix = (botconfig.prefix)
const m = require("moment-duration-format");
const {
    version
} = require("discord.js");

function randomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => {
  db.migrate().then(db => bot.database = db);
});

fs.readdir("./commands/", (err, files) =>  {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.lenght <= 0){
    console.log("Commande introuvable.")
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    if (props.help && props.help.name) {
      bot.commands.set(props.help.name, props);
    }
  });
});

bot.on("ready", () => {
  console.log(`Avi a démarré, avec ${bot.users.size} utilisateurs, dans ${bot.channels.size} channels de ${bot.guilds.size} serveurs.`);
  bot.user.setActivity("One Piece RP | .help", {type: "WATCHING"});
});

bot.on("message", require('./afkListener.js'));

bot.on("message", async message => {
  if (commands.hasOwnProperty(message.content.toLowerCase().slice(botconfig.prefix.length).split(' ')[0])) commands[message.content.toLowerCase().slice(botconfig.prefix.length).split(' ')[0]](message);
  var parts = message.content.split(" ");
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }
  let prefix = prefixes[message.guild.id].prefixes;
  if(!message.content.startsWith(prefix)) return;
  //if(cooldown.has(message.author.id)){
    //message.delete();
    //let cdembed = new Discord.RichEmbed()
    //.setAuthor(message.author.username)
    //.setColor(botconfig.red)
    //.addField("❌Error", "You need to wait 5 secs between commands.");
    //return message.channel.send(cdembed).then(message => {message.delete(3000)});1
  //}
  if(!message.member.hasPermission("ADMINISTRATOR")){
    cooldown.add(message.author.id);
  }
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);
})

// NonEgornomicInplementation
bot.on('message', msg => {
	
  if (msg.content === '.shop') {
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
  
});

bot.on('message', msg => {
  if (msg.content === '.info') {

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

  }
  
});

bot.on('message', msg => {
	
  if (msg.content === '.rp') {



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
  })


}
  };

bot.login(process.env.BOT_TOKEN);
