const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true},{ fetchAllMembers: true, sync: true });
const path = require('path');
const sqlite = require('sqlite');
const jimp = require('jimp');
bot.commands = new Discord.Collection();
let purple = botconfig.purple;
const money = require('discord-money');
const moment = require('moment');
var request = require("request");
var prefix = (botconfig.prefix)
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

bot.on('message', msg => {
  if (msg.content === '.wiki Mera Mera no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces :**
    Le point fort de ce fruit comme pour tous les autres Logia, est qu'il permet à l'utilisateur de produire ainsi que de devenir l'élément auquel il est associé. Le possesseur est donc en mesure de créer, de contrôler et de devenir du feu. De cette façon, il peut lancer des attaques basées sur le feu et a une haute tolérance à la chaleur. Changé en feu, cela a pour effet supplémentaire de brûler un adversaire en fonction de la portée de l'attaque. L'utilisateur peut également utiliser le feu pour renforcer la puissance des attaques physiques. Ajoutons à cela le fait que le mangeur de ce fruit, de part sa nature (logia), est immunisé contre la plupart des attaques physiques qui n'utilisent pas le haki.
    Ce pouvoir permet également à l'utilisateur de se battre sur un pied d'égalité contre les utilisateurs de certains logia, comme celui de la fumée et de la glace.
    **Faiblesses :**
    Les pouvoirs de ce fruit semble s'annuler face aux pouvoirs de glace d'Aokiji ou bien face aux pouvoirs fumigènes de Smoker. De plus, il est faible contre le Magu Magu no Mi d'Akainu, son supérieur dans la hiérarchie des Fruits du Démon. En effet, le magma qu'il produit peut étouffer les flammes de l'utilisateur et peut ainsi le blesser grièvement en le brûlant malgré son intangibilité Logia, faisant de lui son ennemi naturel. En dehors de cela, l'utilisateur est également affecté par les faiblesses communes à tous les Fruits du Démon.      
    `);
  }
});

bot.on("ready", () => {
  console.log(`Avi a démarré, avec ${bot.users.size} utilisateurs, dans ${bot.channels.size} channels de ${bot.guilds.size} serveurs.`);
  bot.user.setActivity("One Piece RP | .help", {type: "WATCHING"});
});


bot.login(process.env.BOT_TOKEN);
