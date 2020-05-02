const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true},{ fetchAllMembers: true, sync: true });
const path = require('path');
const sqlite = require('sqlite');
const jimp = require('jimp');
bot.commands = new Discord.Collection();
let purple = botconfig.purple;


const moment = require('moment');


var prefix = (botconfig.prefix)

const {
    version
} = require("discord.js");


function randomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


bot.on("ready", () => {
  console.log(`SkrrrBot#5 a démarré, avec ${bot.users.size} utilisateurs, dans ${bot.channels.size} channels et ${bot.guilds.size} serveurs.`);
  bot.user.setActivity("One Piece RP | Tatsuka", {type: "PLAYING"});
});


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


client.login(process.env.BOT_TOKEN);
