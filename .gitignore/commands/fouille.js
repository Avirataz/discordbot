const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const playerclasses = require("../classhandler/playerclasses.json");
const fs = require("fs");
const purple = botconfig.purple;

module.exports.run = async (bot, message, args) => {

  var over = Math.floor(Math.random() * 100)
      if ( over === 1) {
        message.reply('Tu as trouvé un parchemin sur les ponéglyphes, utilisable seulement par un archéologue il sert à découvrir l éxistence et l emplacement du premier ponéglyphe vu dans one piece :  ' + over + ' !')
    }
        else if(over === 2){
        message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 3){
      message.reply("Tu as trouvé une carte au trésor, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 4){
        message.reply('Tu as trouvé des lunettes, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 5){
      message.reply('Tu as trouvé un coffre de 2.5K Berry, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 6){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 7){
     message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 8){
      message.reply('Tu as trouvé un coffre de 5K Berry, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 9){
      message.reply('Tu as trouvé un coffre déjà ouvert, il n y a rien dedans..., en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 10){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 11){
      message.reply('Tu as trouvé une épée/fusil modifié, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 12){
      message.reply('Tu as trouvé une épée/fusil ordinaire, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 13){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 14){
      message.reply("Tu as trouvé une carte au trésor, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 15){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 16){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 17){
      message.reply('Tu as trouvé un coffre scellé, trouve une clé et tente de l ouvrir, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 18){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 19){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 20){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 21){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 22){
      message.reply('Tu as trouvé des lunettes, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 23){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 24){
      message.reply('Tu as trouvé un parchemin pour le Hasshoken, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 25){
      message.reply('Tu as trouvé un parchemin sur les ponéglyphes, utilisable seulement par un archéologue il sert à découvrir l éxistence et l emplacement du premier ponéglyphe vu dans one piece :  ' + over + ' !')
    }
    else if(over === 26){
      message.reply('Tu as trouvé un parchemin pour la Boxe, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 27){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 28){
      message.reply('Tu as trouvé un parchemin sur le Jao Kun Do, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 29){
      message.reply('Tu nas rien trouvé, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 30){
      message.reply('Tu as trouvé un parchemin sur le Kung Fu, en gros tu as fais :  ' + over + ' !')
    }
    else if(over === 31){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 32){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 33){
      message.reply("Tu as trouvé un parchemin sur le Karaté des hommes poissons, utilisable seulement pour les hommes poissons, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 34){
      message.reply("Tu as trouvé un parchemin sur l'éxistence du Su long, utilisable seulement pour les Minks, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 35){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 36){
      message.reply("Tu as trouvé un parchemin sur l'électro pour les Su longs, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 37){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 38){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 39){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 40){
      message.reply("Tu as trouvé un coffre de 10K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 41){
      message.reply("Tu as trouvé un parchemin sur le combat Tontata, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 42){
      message.reply("Tu as trouvé un coffre de 25K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 43){
      message.reply("Tu as trouvé une épée modifié, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 44){
      message.reply("Tu as trouvé un fusil modifié, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 45){
      message.reply("Tu as trouvé une épée ordinaire, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 46){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 47){
      message.reply("Tu as trouvé une clé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 48){
      message.reply("Tu as trouvé un coffre scellé, trouve une clé et tente de l'ouvrir, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 49){
      message.reply("Tu as trouvé un coffre ouvert, vide... , en gros tu as fais :  " + over + ' !')
    }
    else if(over === 50){
      message.reply("Tu as trouvé une carte au trésor, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 51){
      message.reply("Tu as trouvé un coffre de 10K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 52){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 53){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 54){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 55){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 56){
      message.reply("Tu as trouvé un coffre de 10K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 57){
      message.reply("Tu as trouvé un coffre ouvert, vide, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 58){
      message.reply("Tu as trouvé un coffre de 10K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 59){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 60){
      message.reply("Tu as trouvé un parchemin sur le Haki de l'observation, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 61){
      message.reply("Tu as trouvé un coffre de 10K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 62){
      message.reply("Tu as trouvé un parchemin sur la technique à 1 sabre, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 63){
      message.reply("Tu as trouvé un coffre de 10K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 64){
      message.reply("Tu as trouvé un parchemin sur la technique à 2 sabres, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 65){
      message.reply("Tu as trouvé un parchemin sur la technique à 3 sabres, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 66){
      message.reply("Tu as trouvé un coffre de 10K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 67){
      message.reply("Tu as trouvé un parchemin sur la technique à 9 sabres, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 68){
      message.reply("Tu as trouvé un parchemin sur la Résurection, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 69){
      message.reply("Tu as trouvé un coffre de 10K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 70){
      message.reply("Tu as trouvé un parchemin sur les ponéglyphes, utilisable seulement par un archéologue il sert à découvrir l'éxistence et l'emplacement du premier ponéglyphe vu dans one piece, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 71){
      message.reply("Tu as trouvé un coffre de 20K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 72){
      message.reply("Tu as trouvé une carte au trésor, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 73){
      message.reply("Tu nas rien trouvé, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 74){
      message.reply("Tu as trouvé un coffre de 20K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 75){
      message.reply("Tu as trouvé un gros coffre de 50K Berry hohoho ! , en gros tu as fais :  " + over + ' !')
    }
    else if(over === 76){
      message.reply("Tu as trouvé un parchemin sur les ponéglyphes, utilisable seulement par un archéologue il sert à découvrir l éxistence et l emplacement du premier ponéglyphe vu dans one piece, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 77){
      message.reply("Tu as trouvé un parchemin sur le pas de velours, en gros tu as fais :  " + over + ' !') 
    }
    else if(over === 78){
      message.reply("Tu as trouvé un parchemin sur le Robo Kendo , en gros tu as fais :  " + over + ' !')
    }
    else if(over === 79){
      message.reply("Tu as trouvé un parchemin sur les ponéglyphes, utilisable seulement par un archéologue il sert à découvrir l'éxistence et l'emplacement du premier ponéglyphe vu dans one piece, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 80){
      message.reply("Tu as trouvé un coffre de 20K Berry, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 81){
      message.reply("Tu nas rien trouvé, en gros tu as fais : " + over + ' !')
    }
    else if(over === 82){
      message.reply("Tu as trouvé un parchemin sur le ryusoken, en gros tu as fais : " + over + ' !')
    }
    else if(over === 83){
      message.reply("Tu nas rien trouvé, en gros tu as fais : " + over + ' !')
    }
    else if(over === 84){
      message.reply("Tu nas rien trouvé, en gros tu as fais : " + over + ' !')
    }
    else if(over === 85){
      message.reply("Tu nas rien trouvé, en gros tu as fais : " + over + ' !')
    }
    else if(over === 86){
      message.reply("Tu as trouvé une clé à moitié détruite, inutilisable, en gros tu as fais : " + over + ' !')
    }
    else if(over === 87){
      message.reply("Tu nas rien trouvé, en gros tu as fais : " + over + ' !')
    }
    else if(over === 88){
      message.reply("Tu nas rien trouvé, en gros tu as fais : " + over + ' !')
    }
    else if(over === 89){
      message.reply("Tu as trouvé un balais, en gros tu as fais : " + over + ' !')
    }
    else if(over === 90){
      message.reply("Tu nas rien trouvé, en gros tu as fais : " + over + ' !')
    }
    else if(over === 91){
      message.reply("Tu as trouvé des claquettes, en gros tu as fais : " + over + ' !')
    }
    else if(over === 92){
      message.reply("Tu as trouvé des sandales, en gros tu as fais : " + over + ' !')
    }
    else if(over === 93){
      message.reply("Tu as trouvé un chapeau, en gros tu as fais : " + over + ' !')
    }
    else if(over === 94){
      message.reply('Tu nas rien trouvé, en gros tu as fais :' + over + ' !')
    }
    else if(over === 95){
      message.reply("Tu nas rien trouvé, en gros tu as fais : " + over + ' !')
    }
    else if(over === 96){
      message.reply("Tu as trouvé un coffre de 15K Berry, en gros tu as fais : " + over + ' !')
    }
    else if(over === 97){
      message.reply("Tu as trouvé un parchemin sur le Jio Ken, en gros tu as fais : " + over + ' !')
    }
    else if(over === 98){
      message.reply("Tu as trouvé une carte au trésor, en gros tu as fais :  " + over + ' !')
    }
    else if(over === 99){
      message.reply("Tu nas rien trouvé, en gros tu as fais : " + over + ' !')
    }
    else if(over === 100){
      message.reply("Tu as trouvé une clé, en gros tu as fais : " + over + ' !')
    } 
}
module.exports.help = {
  name: "fouille"
}
