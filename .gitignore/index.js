const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
const path = require('path');
const sqlite = require('sqlite');
const jimp = require('jimp');
bot.commands = new Discord.Collection();
let purple = botconfig.purple;
let cooldown = new Set();
let cdseconds = 5;
const chratis_cooldown_time = 5;
const money = require('discord-money');
const moment = require('moment');
const emoji = bot.emojis.get("559427989713190922");
var spawning = "no";
var cheerio = require("cheerio");
var request = require("request");
const yt = require("ytdl-core");
const ffmpeg = require("ffmpeg");
let queue = {};
var prefix = (botconfig.prefix)
var skipping = 0;
var skips = 3;
const m = require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")
const ms = require("ms")
var opusscript = require("opusscript");
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

  setTimeout(() => {
    cooldown.delete(message.author.id);
}, chratis_cooldown_time * 1000);

if(message.author.bot) return;
if(message.channel.type === "dm") return;

let coinAmt = Math.floor(Math.random() * 15) + 1;
let baseAmt = Math.floor(Math.random() * 15) + 1;
console.log(`${coinAmt} ; ${baseAmt}`);





//let prefix = prefixes[message.guild.id].prefixes;

//let commandfile = bot.commands.get(cmd.slice(prefix.length));
//if(commandfile && cmd.startsWith(prefix)) commandfile.run(bot,message,args);

if(message.author.bot) return;

var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];

if (command === 'image'){
  image(message, parts);

 }

 function image(message, parts) {

  /* extract search query from message */

  var search = parts.slice(1).join(" ");

  var options = {
      url: "http://results.dogpile.com/serp?qc=images&q=" + search,
      method: "GET",
      headers: {
          "Accept": "text/html",
          "User-Agent": "Chrome"
      }
  };
  request(options, function(error, response, responseBody) {
      if (error) {
          // handle error
          return;
      }

      /* Extract image URLs from responseBody using cheerio */

      $ = cheerio.load(responseBody); // load responseBody into cheerio (jQuery)

      // In this search engine they use ".image a.link" as their css selector for image links
      var links = $(".image a.link");

      // We want to fetch the URLs not the DOM nodes, we do this with jQuery's .attr() function
      // this line might be hard to understand but it goes thru all the links (DOM) and stores each url in an array called urls
      var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
      if (!urls.length) {
          // Handle no results
          return;
      }
      const embed = {
        "title": "Recherche d'image",
        "description": "Here's your image!",
        "url": "https://discordapp.com",
        "color": 10730482,
        "timestamp": "2019-03-31T13:40:57.847Z",
        "footer": {
          "icon_url": message.author.displayAvatarURL,
          "text": "discord.js"
        },
        "thumbnail": {
          "url": "https://cdn.dscordapp.com/embed/avatars/0.png"
        },

        "image": {
          "url": (urls[(randomNumber(21))])
        },
        "author": {
          "name": message.author.tag,
          "url": "https://discordapp.com",
          "icon_url": message.author.displayAvatarURL
        },
        "fields": [
          {
            "name": "You searched for",
            "value": search
          }
        ]
      };
      message.channel.send({ embed }).then(async embedMessage => {
        await embedMessage.react("◀");
        await embedMessage.react("▶");
        await embedMessage.react("⏹");

        const filter = (reaction, user) => {
            return ['◀', '▶', '⏹'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        embedMessage.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '▶') {
                  const embed = {
                    "title": "Recherche d'image",
                    "description": "Là voici, là voila ton image est là!",
                    "url": "https://discordapp.com",
                    "color": 10730482,
                    "timestamp": "2019-03-31T13:40:57.847Z",
                    "footer": {
                      "icon_url": message.author.displayAvatarURL,
                      "text": "discord.js"
                    },
                    "thumbnail": {
                      "url": "https://cdn.dscordapp.com/embed/avatars/0.png"
                    },
                    "image": {
                      "url": (urls[(randomNumber(21+1))])
                    },
                    "author": {
                      "name": message.author.tag,
                      "url": "https://discordapp.com",
                      "icon_url": message.author.displayAvatarURL
                    }

                  };

                  embedMessage.edit(new Discord.RichEmbed(embed));
                  embedMessage.clearReactions().then(async embedMessage => {
                  await embedMessage.react("◀");
                  await embedMessage.react("▶");
                  await embedMessage.react("⏹");

                });


                }


                else if (reaction.emoji.name === '◀') {
                  const embed = {
                    "title": "Image Search",
                    "description": "Là voici, là voila ton image est là!",
                    "url": "https://discordapp.com",
                    "color": 10730482,
                    "timestamp": "2019-03-31T13:40:57.847Z",
                    "footer": {
                      "icon_url": message.author.displayAvatarURL,
                      "text": "discord.js"
                    },
                    "thumbnail": {
                      "url": "https://cdn.dscordapp.com/embed/avatars/0.png"
                    },
                    "image": {
                      "url": (urls[(randomNumber(21-1))])
                    },
                    "author": {
                      "name": message.author.tag,
                      "url": "https://discordapp.com",
                      "icon_url": message.author.displayAvatarURL
                    }

                  };
                  embedMessage.edit(new Discord.RichEmbed(embed));
                  embedMessage.clearReactions().then(async embedMessage => {
                  await embedMessage.react("◀");
                  await embedMessage.react("▶");
                  await embedMessage.react("⏹");


                  });


                }


                else if (reaction.emoji.name === '⏹'){
                  embedMessage.delete()

                }
                if (reaction.emoji.author === bot) return;
            })

    });
  })
 }
});


/// Mini Wiki Fdd
  
bot.on('message', msg => {
  if (msg.content === '.wiki Moku Moku no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: 
    **Forces et Faiblesses:**
    L'utilisateur de ce fruit a la capacité de générer, manipuler et devenir de la fumée. Comme la grande partie des utilisateurs de Logia, lorsque Smoker est touché, il peut tout simplement utiliser la capacité de son fruit pour se transformer en fumée, absorbant ainsi l'attaque et ne recevant alors aucun dégât. Comme certains Fruits du Démon de type Logia, il permet à Smoker de voler, en changeant la partie inférieure de son corps en fumée et en se propulsant, améliorant ainsi grandement sa mobilité et sa vitesse.
    Les principales qualités offensives du fruit proviennent de la capacité qu'il donne à son utilisateur de modifier la densité de la fumée qu'il produit à volonté. Ainsi, Smoker peut entourer sa cible de sa fumée intangible puis de la solidifier pour se saisir d'elle. Grâce à ce pouvoir, Smoker a reçu l'épithète: Le Chasseur Blanc.
    
    La fumée peut également être utilisée comme une arme pour frapper les ennemis avec puissance. Il est cependant possible d'échapper à l'emprise de la fumée avec un choc assez fort pour contrer cette force. (Monkey D. Luffy l'a fait avec son Chewing Balloon.)
    Il semblerait que lorsqu'il se retrouve confronté avec le feu (par exemple celui du pouvoir du Mera Mera no Mi), les deux pouvoirs s'annulent. A part cela, aucune faiblesse n'a encore été vue. Grâce à sa maîtrise instinctive de son pouvoir, le seul moyen sûr de le blesser est d'utiliser le Fluide, comme l'a fait Boa Hancock lors de leur courte altercation à Marineford ou d'utiliser les faiblesses habituelles des utilisateurs de Fruits du Démon, à savoir l'eau ou le Granit Marin.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Gomu Gomu no Mi') {
    msg.channel.sendMessage(`**Forces et Faiblesses:**
    **Forces:**
    L'atout principal de ce fruit, comme le démontre Luffy, est qu'il confère un corps élastique à son utilisateur, le rendant insensible aux attaques physiques pas assez puissantes, aux balles, aux armes contondantes et aux boulets de canon. Cette capacité à s'étirer peut également être utilisée en combat, afin par exemple, d'améliorer la portée d'une attaque. Du fait des propriétés isolantes du caoutchouc, l'utilisateur est également insensible aux attaques électriques. (Pour résumer, il est invincible grâce au fluide combiné à son fruit du démon).
    
    En exploitant au fur et à mesure les capacités de son fruit, Luffy a trouvé de nouveaux moyens d'améliorer ses techniques de combat :
        • Soit en étirant ses vaisseaux sanguins, en créant un effet de pompe avec ses jambes, ce qui permet d'augmenter le flux sanguin, rendant Luffy plus rapide donc plus puissant mais au détriment de ses réserves d'énergie qui s'épuisent plus rapidement : le Gear 2.
        • Soit en insufflant de l'air dans ses os ("Hone Fuusen") afin d'augmenter le volume de son corps et renforcer ses attaques : le Gear 3. Ce qui a pour effet secondaire de réduire sa taille pendant un délais proportionnel au temps d'utilisation de la technique, du moins avant l'ellipse.
        • Soit en modifiant sa structure musculaire et en la renforçant grâce au Haki, le Gear 4. Luffy, afin d'activer la technique, équipe ses bras du Busoshoku no Haki, puis mord son avant-bras gauche. Similaire au "Gear 3", il souffle une quantité incroyable d'air dans son corps, mais cette fois pour non pas gonfler ses bras seulement, mais toute sa structure musculaire. l'inconvénient de cette technique est le temps limité pendant lequel Luffy peut l'utiliser. Elle a été développé sur Rusukaina pendant l'ellipse.**
    `);
  }
});


bot.on('message', msg => {
  if (msg.content === '.wiki Gomu Gomu no Mi') {
    msg.channel.sendMessage(`Dans sa jeunesse, Luffy eu de gros problèmes à contrôler ses propres capacités. Bien qu'il avait des idée pour tirer parti de son pouvoir, Luffy eu des ennuis avec la visée et le timing de ses attaques, et il était continuellement affecter par le recul. Toutefois, il a réussi à contrer ces faiblesses en vivant dans la jungle avec Ace et Sabo.
    Dans l'anime, Luffy a utilisé son pouvoir pour inhaler de grandes quantités d'air puis expirer violemment pour se propulser en l'air. Cette technique a été utilisée pour souffler les vapeurs toxiques des crachats de Marigold et le souffle empoisonné de Magellan.
    Compte tenu des propriétés élastiques de Luffy, il est en mesure de résister à une forte pression. Cela a été démontré lors du combat contre Hody. Il n'était pas affecté par la pression sous-marine intense alors que seule sa tête disposait d'une bulle.
    **Faiblesses:**
    `);
  }
});


bot.on('message', msg => {
  if (msg.content === '.wiki Gomu Gomu no Mi') {
    msg.channel.sendMessage(`Malgré tous ces avantages, Luffy reste vulnérable aux attaques tranchantes (que ce soit des épées ou des lames d'air) et aux attaques non-physiques, basées sur le feu ou la glace. Il est également vulnérable quand ses membres sont étirés à leurs limites. En plus de cela, Luffy souffre des mêmes faiblesses quand il est en contact de l'eau ou de Granit Marin que les autres possesseurs de Fruit du Démon. Il a cependant l'habitude d'oublier cette faiblesse, puisqu'il a toujours envie de faire des sports aquatiques (le surf, par exemple), et il n'hésitera pas à plonger dans l'eau s'il voit quelqu'un en train de se noyer.
    Luffy, bien sûr, souffre également de faiblesses liées à l'eau comme le Karaté des hommes-poissons.
    Quand les coéquipiers de Luffy (généralement Nami) sont en colère contre lui, leurs coups de poing sont capables de faire mal à Luffy, bien que cela est purement pour l'effet comique.
    Une autre faiblesse qu'a noté Doflamingo est que lorsque le Haki de l'armement est appliquée à une partie du corps de Luffy, il ne possède plus ses propriétés liées au caoutchouc. Cette faiblesse est seulement liée au Gear 4.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Ushi Ushi no Mi modèle Bison') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    **Forces:**
    Ce Fruit permet à Dalton de se déplacer plus vite en se transformant en bison, et sous sa forme hybride il est suffisamment puissant pour arrêter Chopper qui charge sous sa forme humaine. De plus ce fruit lui octroie une grande endurance.
    **Faiblesses:**
    Ce Fruit n'a pas de faiblesses connues, à part les faiblesses communes aux Fruits du Démon. Lorsque Dalton a cependant combattu Wapol, ce dernier a facilement gagné.
    `);
  }
});

///===============================================================================================================================

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

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Bara Bara no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses**
    **Forces:**     
    La grande force de ce fruit est de permettre à son utilisateur de rester en vie s'il se fait découper ce qui le rend invulnérable aux objets tranchants. L'autre utilité est que les parties séparées peuvent voler et se propulser sur un champ d'action assez grand. Enfin la dernière utilité de ce fruit est qu'il permet de se déplacer plus rapidement en volant ou d'une autre manière (Bara Bara Car).
    **Faiblesses:**  
    Malheureusement, le champ d'action de séparation est limitée, du coup, si certaines parties sont trop éloignées de la tête qui contrôle l'ensemble, alors ces parties seront comme inertes, de même ces fragments peuvent être capturés facilement si le propriétaire ne fait pas attention. Un autre des défauts est que si les fragments reçoivent un coup alors qu'elles sont dans le champ d'action, alors l'utilisateur le sentira. Finalement, le dernier point faible de ce pouvoir est que les pieds de l'utilisateur ne peuvent flotter et donc sont cloués au sol. Hormis cela, ce fruit possède les faiblesses communes à tous les fruits du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Hito Hito no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    En consommant le fruit, Chopper a pu devenir aussi intelligent qu'un humain, et ce Fruit lui permet de comprendre et de communiquer dans le langage humain, ainsi que de se transformer en humain (ou en une créature censée ressembler à un humain, sa forme humaine ressemblant plus à un animal similaire à un gorille). Le fruit a également donné à Chopper la capacité de percevoir des concepts tels que la médecine qui ne serait normalement pas comprise d'un renne.
    Cela lui permet aussi de se transformer en une forme hybride humain/renne. Le fruit est encore renforcée par l'utilisation de la Rumble Ball, un médicament inventé par Chopper. Il s'agit du seul Fruit de type Zoan qui permet grâce à ce médicament de se transformer en plus de trois formes (excepté la technique "Résurrection" qui permet à Rob Lucci de prendre une quatrième forme mi-humaine mi-léopard). Ce médicament permet à Chopper d'accéder à d'autres formes de proportions variables homme/renne. La Rumble Ball n'est cependant pas une chose qui devrait être associée aux pouvoirs du Fruit et l'utilisateur lui-même peut être détruit par l'utilisation de la Rumble Ball.
    `);
  }
});



bot.on('message', msg => {
  if (msg.content === '.wiki Hito Hito no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: La principale faiblesse du fruit, dans le cas de Chopper, c'est que les formes qu'il lui donne ne sont pas purement et simplement des formes ressemblant à un homme et sont souvent prises pour autre chose. Par exemple sa forme humaine est souvent prise pour un gorille et sa forme humaine-hybride est souvent prise pour un Tanuki, une sorte de raton-laveur de la mythologie japonaise. Cependant, malgré cela, un avantage de ceci est que Chopper peut facilement se cacher des ennemis en se transformant en une forme qu'ils n'ont pas vu avant. Cependant, si l'utilisateur est bloqué par des liens très forts, il peut être incapable de changer de forme librement, comme cela a été vu avec Charlotte Perospero qui l'a immobilisé avec sa technique Candy Man. A part cela, ce Fruit possède les faiblesses standards de Fruits du Démon.
    Oda a déclaré que si c'était un être humain qui avait mangé ce fruit, il serait «éclairé», ce qui ne rendrait pas le fruit totalement inutile mais presque.      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Suna Suna no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses**

    **Forces**
    Ce Fruit est un Fruit de type Logia, qui confère à son utilisateur le pouvoir de contrôler, produire à volonté et devenir du sable : il peut créer et manipuler des sables mouvants, des tempêtes de sable, et peut aussi se transformer en son élément. De ce fait, il est immunisé contre les attaques physiques. Mais la capacité la plus effrayante de ce Fruit est le pouvoir de tout dessécher (comme le bois, les arbres, les humains...) en touchant la matière avec sa main droite ce qui lui est très utile dans les combats.
    **Faiblesses :**
    Sa principale faiblesse est toute matière liquide, qui tend à durcir le sable, ce qui l'empêche d'éviter un coup porté à cet endroit. Cette faiblesse a copieusement été exploitée par Luffy lors du deuxième et troisième round de son combat contre Crocodile.[8] À noter que la capacité de déshydratation de ce Fruit n'agit pas sur les substances métalliques.
    Hormis cette faiblesse, le Fruit possède également les faiblesses communes à tous les Fruits du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Sube Sube no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces :**
    La plupart des attaques physiques sont inefficaces contre l'utilisateur de ce fruit car elles glissent sur lui. Cependant, ce fruit ne semble pas avoir d'avantage offensif.
    **Faiblesses :**
    Les faiblesses sont les mêmes que celles de tout utilisateur de Fruit du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Tori Tori no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses**
    **Forces :**
    Le principal atout de ce fruit est qu'il permet à celui qui le mange de pouvoir voler. Cependant il permet aussi, sous la forme animale ou hybride, d'augmenter sa vitesse et d'avoir une grande force physique. Sous sa forme de faucon, l'utilisateur peut porter une ou deux personnes sur son dos. Sous cette forme, il peut également transporter de très lourdes charges.
    **Faiblesses**
    Il ne possède pas de faiblesses particulières connues à part celles communes aux utilisateurs de Fruits du Démon.      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Goro Goro no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces :**
    Le principal pouvoir du fruit est la transformation complète de son utilisateur en foudre: il peut créer et manipuler la foudre comme il le souhaite, et peut aussi, comme tous les Logia, se transformer en son élément. De ce fait, comme tout Logia il est immunisé aux attaques physiques sans Fluide de l'Armement. Puisqu'aucun habitant connu des Îles Célestes ne maîtrise le Haki de l'Armement, maîtrisant seulement le Fluide de l'Observation connu sous le nom de Mantra, Ener ne craint rien à priori. Il va même jusqu'à proposer à ses adversaires d'essayer de le tuer dans un délai de cinq minutes, délai où il ne bougera pas et n'esquivera aucune attaque. Ces attaques ne servant évidemment à rien contre lui, Ener en profite même pour rêvasser pendant que son adversaire le découpe et le transperce. Ener paraît alors invincible et renforce son image de "Dieu" de Skypiéa.
    Avec cela en tête, Ener utilise ce pouvoir notamment pour lancer des attaques très puissantes compte tenu de la puissance de l'éclair. Il s'en sert aussi pour se déplacer à la même vitesse que l'éclair (déplacement instantané, téléportation). Il peut aussi être utilisé pour fondre ou solidifier de l'or. Ener l'utilise pour faire voler son bateauprofitant de la conductibilité de l'or. À noter qu'il peut utiliser son pouvoir pour se ranimer comme un défibrillateur, ce qu'il montrera à la suite des attaques de Wiper et de son Reject Dial. Grâce à son fruit et l'arche il peut créer une gigantesque sphère capable de détruire une île.     
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Goro Goro no Mi') {
    msg.channel.sendMessage(`**Faiblesses :**
    Son pouvoir est cependant annulé par tout matériau "isolant", comme le caoutchouc, ce dont est constitué Luffy. Cette faiblesse lui a permis de vaincre Ener. Hormis cette faiblesse, le fruit est concerné par les faiblesses habituelles des Fruits du Démon. Ce fruit peut avoir un désavantage contre certains Fruits du Démon comme le Gomu Gomu no Mi ou le Pasa Pasa no Mi qui sont soit un "vulgaire Paramecia" (selon Ener) ou un Logia. Le caoutchouc ou le papier étant immunisés contre la foudre, Ener ne peut les vaincre directement grâce à son pouvoir. Étant un Logia, l'utilisateur de ce fruit est vulnérable face aux attaques imprégnées du Haki de l'Armement.       
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Kilo Kilo no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces :**
    La plus grande force de ce Fruit, c'est qu'il permet à Miss Valentined'écraser ses ennemis, en changeant son poids, de 1 à 10 000 kg. Elle peut aussi flotter dans l'air, évitant les attaques, en pesant seulement 1 kilos. Elle peut s'envoler dans les airs grâce aux pouvoirs de son partenaire, Mr. 5, en provoquant une explosion qui la fait voler.
    **Faiblesses :**
    A part celles des Fruits du Démon en général, ce Fruit possède plusieurs faiblesses. Lorsque l'utilisateur retombe au sol avec un grand poids, un ennemi peut esquiver simplement l'attaque en se décalant, car l'utilisateur ne peut dévier son attaque. De plus, retomber violemment au sol cause de minimes dommages à l'utilisateur, Miss Valentine ayant été sonnée après avoir raté Zoro et s'étant écrasée au sol. Il semble également que l'utilisateur ne peut pas changer sa masse d'un coup, seulement graduellement, car Miss Valentine fut battue par Nami et Vivi avant qu'elle ait pu augmenter suffisamment de masse pour écraser Usopp.
    Ce Fruit est aussi inférieur au Ton Ton no Mi de Machvise, ayant une variation de poids moins importante.[2]Hormis ceci, ce Fruit possède les faiblesses connues à tous les Fruits du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Mogu Mogu no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Miss Merry Christmas peut se transformer en taupe ou en forme hybride humaine-taupe. Elle peut aussi creuser des tunnels comme une taupe, voyageant ainsi dans les tunnels sans aucun problème et plongeant dedans comme dans une piscine. Elle peut aussi se servir de ses griffes aiguisées pour attaquer. Elle est suffisamment résistante pour pouvoir foncer dans un mur sans se blesser et détruire le mur à la place. De plus, les tunnels qu'elle crée sont suffisamment larges pour être utilisés par ses alliés.
    **Faiblesses:**
    Il est toutefois important de noter qu'un ennemi peut très bien emprunter les galeries creusées par Miss Merry Christmas. De plus, tous les tunnels sont connectés entre eux, ce qui fait que disposer une bombe comme les balles explosives de Lassou à l'intérieur des tunnels permet de tout détruire à l'intérieur.
    À part cela, ce fruit du démon ne possède aussi les faiblesses particulières à tous les fruits du démon.      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Hie Hie no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La force majeure de ce fruit est qu'il permet à son utilisateur de se transformer en glace et de contrôler cet élément. Il peut par exemple se déplacer directement sur l'eau, en la gelant. Ce fruit est l'un des rares à pouvoir utiliser de l'eau, et l'un des seuls à pouvoir empêcher son possesseur de se noyer ; ceci est vu lorsque Kuzan plonge dans la baie d'eau salée et la congèle. Grâce à ce pouvoir, Kuzan a pu changer la moitié d'une île en un désert glacé, modifiant même le climat, lors de son affrontement face à Sakazuki.
    Aokiji a aussi une résistance extrême contre la glace, en raison de l'élément de son Fruit du Démon. Il est capable de geler les parties de son corps et de retourner à l'état normal. Ce fruit est supérieur au Yuki Yuki no Mi de Mone, car la glace possède une température naturellement plus basse que celle de la neige.
    **Faiblesses:**
    La glace semble être neutralisée par le feu, comme on le voit face aux pouvoirs du Mera Mera no Mi de Ace. La glace est aussi inefficace face aux vibrations de Barbe Blanche, puisqu'il a pu se libérer grâce à son pouvoir après avoir été gelé par Kuzan. Il est intéressant de noter qu'il s'agit d'un des rares fruits de type Logia qui puisse être touché par des attaques physiques. Ceci est principalement dû au fait que la glace est un élément à l'état solide, à la différence de tous les Logia présentés. Cependant, la plupart des attaques sont inefficaces contre ce fruit. En outre, Sakazuki a pu faire fondre la glace produite par Aokiji en quelques secondes. Toutefois, il convient de noter que Kuzan a pu lutter face à Sakazuki pendant 10 jours à conditions égales. A part ça, ce fruit ne semble pas avoir de faiblesses particulières, hormis celles connues de tous les Fruit du Démon.     
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Bomu Bomu no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces :**
    La principale force de ce fruit est qu'il permet à l'utilisateur de faire exploser différentes parties de son corps telles des bombes quand il le souhaite et sans se blesser. Il peut même faire exploser des choses intangibles comme son souffle. Le fruit assure également à l'utilisateur une résistance sans failles à tout type d'explosion, et également la capacité d'évaluer leur qualité (Mr. 5 remarqua à Usopp que sa Kayaku Boshi ou (Bille Explosive en français) avait mauvais goût parce qu'il utilisait de la poudre de mauvaise qualité).
    **Faiblesses:**
    A part les faiblesses standards pour tous les utilisateurs des Fruits du Démon, l'utilisateur nécessite d'avoir un contact avec la victime pour la faire exploser (avec n'importe quelle partie de son corps), et il semble que la capacité d'explosion existe uniquement quand l'utilisateur est conscient ou qu'il le souhaite, comme lorsqu'on peut voir Zoro ou Luffy frapper Mr. 5 sans provoquer d'explosion.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Inu Inu no Mi modèle Chacal') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    Le principal atout de ce fruit est qu'il augmente l'endurance et la rapidité de l'utilisateur, ainsi que sa vision qui devient perçante. Il peut de plus survivre facilement au climat du désert. Le chacal étant une sous-espèce du loup, l'utilisateur obtient un net avantage pour les combats au corps à corps, encore plus que la plupart des Fruits de type Zoan, étant un Zoan Carnivore.
    Ce Fruit ne semble pas posséder de faiblesses particulières hormis les faiblesses standard de tous les Fruits du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Gasu Gasu no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces :**
    La principale force de ce fruit est qu'il permet à son possesseur de devenir, de produire et de contrôler une sorte de gaz qui semble avoir des propriétés curatives car il a purifié les poumons d'anciens prisonniers ayant absorbé une grande quantité de gaz toxique. Il semble de plus immunisé contre certains poisons. Le possesseur semble pouvoir modifier la densité de ce gaz, comme par exemple pour porter un verre et même le casser ou encore se cacher dans des espaces très réduits inaccessibles à des êtres humains normaux. A noter que le gaz de César peut être très explosif.
    En outre, César peut contrôler le gaz empoisonné mais aussi l'air ambiant et en enlever le dioxygène gazeux de l'air afin d'asphyxier ses ennemis. En se fondant dans un autre gaz, l'utilisateur semble pouvoir augmenter sa puissance, comme César le fait avec Shinokuni. Ce fruit profite également de tous les avantages relatifs aux logias.
    **Faiblesses :**
    Ce fruit semble faible face au feu, bien que la capacité de César à retirer le dioxygène présent dans l'air ambiant afin d'empêcher les flammes de se propager minimise cette faiblesse. De plus, si César est attaqué alors qu'il exécute une attaque, cette attaque est immédiatement stoppée. Il est à noter également que le poison produit par ce fruit est sans effets sur les personnes immunisés aux poisons, comme Luffy à cause de Magellan. Enfin, ce fruit possède les faiblesses communes à tous les Fruits du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Hana Hana no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces:**
    La quantité maximale de membres, généralement les bras, pouvant être créés semble être de 100 avant l'ellipse des 2 ans et 1000 après. Lors de son passage dans le Nouveau Monde, Robin a acquis la capacité de faire pousser jusqu'à mille membres en même temps. Bien que la force des membres dépende 
    de la force de l'utilisateur, la quantité de bras pouvant être invoqués semble rendre dérisoire tout besoin d'avoir une force physique importante. Chacun des bras peut être contrôlé indépendamment ou ensemble en plus de pouvoir pousser sur un membre ayant déjà poussé.
    **Faiblesses:**
    Mises à part les faiblesses communes à tous les détenteurs d'un pouvoir d'un Fruit du Démon, les efforts fournis par les membres semblent être transmis à l'utilisateur. Par exemple, si celui-ci essaie de soulever quelque chose de très lourd, bien que les bras ne soient pas connectés directement à lui, cela l'épuisera autant que s'il utilisait ses vrais membres. Les membres peuvent être blessés, ce qui fait ressentir la douleur à l'utilisateur, cependant les vrais membres ne sont pas blessés. Cette faiblesse s'étend aux autres Fruits du Démon, car si un membre dupliqué est touché par un pouvoir de Fruit du Démon, l'utilisateur sera également affecté. Par exemple, quand Robin a fait pousser des bras pour restreindre Ain, cette dernière a pu utiliser son propre pouvoir (le Modo Modo no Mi) pour rajeunir de 12 ans Robin en touchant ses bras dupliqués. De plus, si l'adversaire est suffisamment rapide, il pourra éviter que Robin fasse éclore des membres sur son corps comme ce fut le cas contre Binz.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Uma Uma no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Ce fruit permet à l'utilisateur de se transformer en un cheval ou en cheval-hybride selon sa volonté. Sa dentition lui permet de mordre plus facilement les gens, Pierre n'ayant de base pas de dents.
    **Faiblesses:**
    Ce fruit ne semble pas avoir de faiblesses spécifiques, en dehors des faiblesse de tous les Fruits du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Numa Numa no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    **Forces:**
    La force principale de ce fruit est de permettre à Caribou de créer des marécages sans fond dont on ne peut s'échapper. Si quelqu'un est attrapé par le marais créé par Caribou, il s'enfonce de plus en plus si il se débat. Le marais est aussi un espace de stockage, permettant à Caribou de stocker une quantité infinie de tout ce qu'il a pris à l'intérieur de son corps. Il est capable de garder des créatures capables de respirer sous l'eau, tels que des sirènes, vivantes alors qu'elles sont dans son marais. On ignore cependant s'il peut garder en vie des créatures seulement capables de respirer de l'air dans son marais.     
    Comme la plupart des autres utilisateurs de Fruits du Démon de type Logia, Caribou ne peut pas être atteint ou découpé en tranches comme son élément est intangible, et toutes les attaques seront absorbées dans son corps sans danger. Mais plus comme Marshall D. Teach, Caribou ne peut pas laisser les attaques frapper son corps, mais plutôt, elles doivent être absorbées.
    Le liquide épais produit par ce fruit est probablement de la boue, qui se trouve près des marais et des tourbières. Franky le décrit d'ailleurs comme "une sorte de boue".
    **Faiblesses:**
    La principale faiblesse de ce fruit, c'est que l'utilisateur ne peut pas se transformer de nouveau dans sa forme normale, s'il est confiné dans un espace dans lequel leur corps normal ne peut pas s'adapter. En raison de cette faiblesse, Franky a su capturer et sceller Caribou dans un tonneau facilement. En outre, la faiblesse naturelle de ce fruit est l'eau, ce qui laisse Caribou vulnérable face à des personnes capables de manipuler l'eau, telles que Jinbei. Enfin, l'utilisateur est également affecté par les faiblesses communes à tous les Fruits du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Doru Doru no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La principale utilité de ce fruit, c'est qu'il permet de créer et de modeler de la cire à volonté. De plus lorsque la cire durcit, elle devient aussi dure que l'acier et résiste aux acides de l'estomac des Bananadiles, et aux poisons ordinaires de Magellan. L'une des facultés les plus utilisées octroyé par le pouvoir de ce fruit est de créer des clés pouvant permettre à libérer des prisonniers de leurs menottes, même si ces dernières sont faites de Granit Marin.
    **Faiblesses:**
    L'une des principales faiblesses de ce Fruit est que la cire ne résiste pas à la chaleur. Une flamme peut donc suffire à neutraliser ce pouvoir. La cire durcie peut aussi être détruite par une autre cire durcie. Enfin, le poison le plus corrosif de Magellan, qu'il utilise rarement, est capable de dissoudre la cire que Galdino .À part ça, le Fruit possède les faiblesses communes à tous les Fruits du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Neko Neko no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    Le point fort majeur de ce fruit, comme le démontre Lucci, est que son utilisateur gagne en force physique dans sa forme hybride et léopard, force équivalente à celle d'un léopard réel, voire plus. Sa forme hybride est extrêmement large car elle augmente la taille et la masse originelles de l'utilisateur de manière importante. Les techniques et aptitudes de combat, comme le Rokushiki, sont grandement renforcées grâce aux pouvoirs de ce fruit. Selon Chopper, un Zoan Carnivore est bien plus violent qu'un Zoan normal. Lucci est même allé jusqu'à mordre Luffy dans sa forme animale. D'après Lucci, ceux qui ont mangé un tel fruit sont grandement spécialisés dans la force physique et le combat rapproché.
    A ce jour, ce fruit ne semble pas avoir de faiblesses spécifiques, hormis celles liées à tout Fruit du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Magu Magu no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces :**
    La force principale de ce Fruit du Démon, c'est qu'il permet à Akainu de produire du magma pour attaquer ses adversaires. La chaleur intense peut vaporiser instantanément un iceberg et bouillonner l'eau de mer dans laquelle le magma atterrit. Avec ce pouvoir il a pu livrer une bataille de 10 jours, il était assez fort pour changer de façon permanente le climat de la moitié d'une îledans un brasier infernal.
    En tant qu'utilisateur de fruit de type Logia, Akainu peut laisser les attaques physiques lui passer à travers sans être blessé et ne peut être blessé qu'à l'aide du Fluide d'Armement, le Granit Marin, ayant sa garde baissée et par une hypothétique faiblesse élémentaire. Apparemment, Akainu est au courant à propos du Fluide et a trouvé quelques moyens d'éviter les attaques améliorées avec ceci, même après que Marco et Vista le tranchèrent au cou avec des attaques infusées de Fluide, quoiqu’il éprouva quelques malaises lorsqu’il prit les coups. Étant composé de magma, quiconque essaie d'affronter directement Akainu aura l'effet additionné de se faire brûler.[7] Les armes, telle que les épées, ont également été vu entrain de fondre après avoir été en contact avec lui.
    Son aptitude magma est naturellement d'un ordre plus haut que les aptitudes pyrokinétiques d'Ace, ce qui permit à l'amiral de submerger les aptitudes à base de feu d'Ace et de le brûler. Le Fruit du Démon d'Akainu est assez puissant pour s'en prendre à des gens comme Emporio Ivankov et Jinbei avec des efforts minimaux.
    **Faiblesses :**
    À part les faiblesses habituelles des Fruits du Démon, les pouvoirs d'Akainu ne semblent être faibles contre rien de spécifique. Cependant, il faut mentionner que même si le Fruit du Démon d'Akainu a été capable de dominer les aptitudes à base de feu d'Ace, il fut complètement infructueux contre le Fruit du Démon de type Zoan Mythique de Marco. Par contre, dans l'anime, Akainu fut capable de repousser de côté Marco afin d'atteindre Luffy avec un autre éclat de magma.      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Baku Baku no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces :**
    La principale force de ce Fruit du Démon est qu'il permet à Wapold'agrandir la taille de sa bouche afin de manger des choses normalement immangeables comme le métal ou le bois. Il peut également transformer son corps en arme en fonction de celle qu'il a consommée mais aussi les fusionner entre eux et s'en servir comme bon lui semble.
    **Faiblesses :**
    Ce fruit, bien qu'il permette à son utilisateur de manger en quantité apparemment illimitée sans en avoir mal au ventre, rend celui-ci très sensible à la faim. De plus, l'utilisateur semble éprouver de la difficulté à manger des aliments mous et gluant, comme lorsqu'il se révéla incapable d'engloutir la tête de Luffy. En outre, l'utilisateur ne peut utiliser les objets qu'il a ingéré seulement dans les 24 heures qui vont suivre. Enfin, ce fruit possède les faiblesses communes à tous les Fruits du Démon.            
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Ushi Ushi no Mi modèle Girafe') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces :**
    Ce fruit de type Zoan permet à son utilisateur de se transformer en girafe ou en une créature hybride. Contrairement à ce que l'on pourrait penser, son long coup n'est pas une faiblesse : bien au contraire, il peut attaquer avec et contrer tout type d'attaque, donnant à ses capacités un rayon d'action plus étendu. Lorsqu'il est en mode animal ou hybride, Kaku peut rendre ses attaques "Pied Ouragan" encore plus dévastatrices. Il peut aussi accroître sa vitesse et créer une version ultra puissante de l'Index Gun avec son nez carré. Grâce à la longueur de son coup de girafe ainsi que sa technique Bigan il peut attaquer son adversaire en disposant toujours de 4 membres cela lui donne un avantage considérable face à Zoro.
    **Faiblesses:**
    L'utilisateur de ce fruit souffre des mêmes faiblesses que les autres détenteurs de Fruits du Démon. Lorsque sa transformation a été vue pour la première fois, Jabura, Usopp et Zoro se sont moqués de lui, tant pour le fait qu'il se transforme en girafe que pour l'aspect absurde de sa forme hybride.
    Zoro a supposé que son long cou serait une faiblesse, mais l'agilité de Kaku lui permet d'esquiver les attaques sur son cou et contre-attaquer immédiatement.                  
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Pika Pika no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces :**
    La force majeure de ce fruit, comme tous les autres fruits de type Logia, est qu'il permet à son utilisateur de produire et de contrôler l'élément caractéristique du fruit, Ainsi Kizaru est capable de générer et de devenir de la lumière, et donc d'utiliser des attaques basées sur cet élément. Comme son nom l'indique, l'utilisateur devient un homme lumière et peut se déplacer à la vitesse de la lumière, pouvant ainsi envoyer des coups à cette vitesse (comme le montre Kizaru en battant les 4 Supernovae d'une facilité incroyable basée sur sa vitesse et la force spectaculaire de son fruit du démon en donnant juste un coup de pied à chacun, ce qui prouve une fois de plus que ce Fruit a une puissance hors du commun). D'un simple coup de pied Kizaru peut détruire un Grove entier sur L'Archipel Sabaody.
    **Faiblesses:**
    Le Pika Pika no mi se soumettant aux règles strictes de la lumière peut produire " uniquement " des lasers de vitesses rectilignes uniformes qui se déplacent en ligne droite. Afin de régler ce problème, l'Amiral Kizaru utilise la réflexion sur des objets tel que le tronc des Groove de Saboady ou du verre pour pouvoir changer de direction visibles dans l'anime par plusieurs zigzag. Il est à noter que l'Amiral Kizaru doit reprendre sa forme humaine avant de pouvoir frapper à nouveau comme le montre la confrontation entre Zephyr et ce dernier(comme c'est le cas avec la technique "Yata no Kagami"). En outre, certaines attaques de Kizaru prennent du temps à se préparer et peuvent être bloquées ou déviées par des adversaires utilisateurs du Fluide dit Haki, comme l'a fait le Seigneur des Ténèbres, Silvers Rayleigh pour sauver les Mugiwara. Enfin, ce fruit possède les faiblesses communes à tous les Fruits du Démon.       
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Mane Mane no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    Le principal pouvoir de ce fruit est qu'il permet à l'utilisateur de devenir une copie physique parfaite de la personne touchée par la main droite de ce dernier. En se transformant, il gagne tous les points forts de la personne touchée, sans oublier ses points faibles, et après avoir touché le visage d'une personne, l'utilisateur conserve en mémoire tous les détails de la personne touchée, pour l'utiliser à n'importe quel moment. Il semble que l'utilisateur peut choisir d'imiter seulement la tête ou le corps entier de la victime. Dans un combat, si l'utilisateur se transforme en une personne que son ennemi ne pourra pas combattre, cela lui donne un fort avantage, comme ce fût le cas lorsque Mr. 2 se transforme en Nami pour combattre Sanji.
    Bien que l'utilisateur puisse copier les capacités de la personne qu'il copie, cela ne s'applique généralement pas aux Fruits du Démon. Ainsi, si une personne possède un pouvoir des Fruits du Démon, l'utilisateur ne pourra pas les utiliser (Bentham ne peut pas s'étirer comme Luffy). La seule exception connue a eu lieu lorsque Bentham a copié le visage de Chopper en forme hybride. De plus, bien que l'utilisateur puisse copier parfaitement le corps de quelqu'un, il ne peut pas copier ou imiter les capacités de combat ou les talents de cette personne.       
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Mane Mane no Mi') {
    msg.channel.sendMessage(`De plus, les aptitudes au combat de l'utilisateur sont limitées par le corps qu'il utilise. Ainsi, il ne peut pas utiliser quelques-unes de ses attaques originelles si le corps "emprunté" n'est pas entraîné pour le faire (exemple: dans le corps de Nami, Mr. 2 ne pouvait pas faire son Travelo Punch, le corps de Nami étant beaucoup moins fort physiquement que celui de Bentham.).
    L'utilisateur ne peut de plus pas copier les vêtements ou les outils que la personne touchée porte, ce qui le force soit à les copier (comme lorsque Mr.2 a copié les vêtements royaux de Nefertari Cobra) ou à les voler (comme les lunettes de sniper d'Usopp). Cela implique aussi que l'utilisateur ne peut pas copier le comportement de la personne touchée, ce qui force Mr. 2 à développer un jeu d'acteur poussé pour pouvoir imiter parfaitement sa victime.
    Après avoir touché une personne, l'utilisateur conserve en mémoire tous les détails du corps de la personne touchée, pour l'utiliser à n'importe quel moment. Il doit absolument toucher une personne pour se transformer en elle, ce qui implique que Bentham ne peut pas se transformer en quelqu'un qu'il n'a jamais rencontré. L'utilisateur peut cependant mélanger les souvenirs de différentes personnes touchées et changer différentes parties de son corps en parties de différentes personnes (comme le Mane Mane Montage). Cela n'a cependant aucun avantage au combat, ou en infiltration, tel qu'utilisé par Mr. 2.
    Ce Fruit possède également les points faibles standards de tous les Fruits du Démon.`);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Inu Inu no Mi modèle Loup') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses :**
    La plus grande force de ce Fruit est d'augmenter la forme physique de l'utilisateur, qui devient même supérieure à celle d'un vrai loup grâce à l’entraînement de Jabura. La forme hybride est plus grande que les autres formes, Jabura apparaissant avec une hauteur de plusieurs mètres sous cette forme.[1] Ses techniques de combat comme les Six Pouvoirs sont de plus beaucoup plus puissantes et meurtrières avec ce Fruit, et le type de ce Fruit, qui est un Zoan Carnivore, rend l'utilisateur plus dangereux qu'un Zoan normal. L'utilisateur possède de plus des armes tranchantes à sa disposition, des griffes qu'il peut utiliser pour tuer une proie sans la faire souffrir. Avec ses griffes sa technique des Six Pouvoirs "Index Gun" devient de plus beaucoup plus meurtrière qu'un Index Gun normal.
    Ce Fruit ne semble pas avoir de faiblesse exceptées celles de tous les Fruits du Démon.             
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Yami Yami no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La principale force de ce fruit, c'est qu'il permet à Barbe Noire de contrôler les ténèbres, et par conséquent, la gravité. Les ténèbres produites par l'utilisateur sont représentées sous forme de fumée noire. L'utilisateur peut tout absorber dans ses ténèbres, que ça soit des êtres vivants ou des objet. Il peut également utiliser la gravité pour attirer irrémédiablement l'adversaire vers lui, même si c'est un utilisateur de fruit du démon de type Logia.
    Comme le font les trous noirs, l'utilisateur peut également créer un vortex qui absorbe tout ce que l'utilisateur veut. Contrairement au véritables trous noirs, les êtres et choses absorbées ne sont ni dissoutes ni anéanties, mais stockés dans un espace sans limites. Les vortex créés par Barbe Noire sont capables d'aspirer une ville tout entière, puis de l'expulser sans aucune difficulté, bien que la ville ait été détruite. Les gardiens d'Impel Down qui ont subis ce traitement ont également survécus, mais étaient grièvement blessés et en état de choc.
    Bien que l'utilisateur est vulnérable aux attaques physiques, il peut utiliser les ténèbres pour se soigner plus rapidement, comme il le montra en étouffant le feu qui le brûlait lors de son combat contre Ace.
    Ce fruit confère également à son utilisateur la possibilité d'annuler les pouvoirs des autres fruits du démon simplement en touchant leur utilisateur, et ce, quelque soit le type de fruit du démon (Logia, Paramecia ou Zoan). S'ils sont touchés, il s'exposent à une attaque redoutable, pouvant les blesser grièvement.
    Selon certaines théories, le Yami Yami no Mi permettrait à son utilisateur d'absorber les fruits du démon des autres utilisateurs une fois morts. Le procédé exact reste néanmoins inconnu. D'autres en revanche, estiment que la capacité de Teach à absorber plusieurs fruits viendrait des particularités physionomiques de ce dernier. Ce point reste donc à éclaircir.
    Lorsque Barbe Noire a récupéré le Gura Gura no Mi de Barbe Blanche, il a affirmé que grâce à la puissance des ténèbres "qui apportent l’annihilation totale" combinée à celle des tremblements de terre "qui détruisent tout", il était désormais invincible. En outre, dans l'animé, Il est qualifié par Barbe-Noire de "Plus puissant Fruit du Démon".
    **Faiblesses:**
    Contrairement à tous les autres utilisateurs de fruits du démon de type Logia, l'utilisateur est tangible et ressent la douleur qui est démultiplié par rapport à la normale.
    En outre, l'utilisateur reste en contact avec sa victime pour annuler ses pouvoirs de façon constante, ce qui signifie que s'il la lâche ou si elle parvient à se dégager, elle retrouvera l'usage de ceux-ci.
    Hormis cela, ce fruit possède les faiblesses standards de tous les Fruits du Démon.                   
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Supa Supa no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La principale capacité de ce fruit, est que l'utilisateur est capable de transformer les parties de son corps en lames. Il peut ainsi faire face à n'importe quel adversaire. De plus, sa peau est constamment aussi dure que de l'acier. Il peut donc arrêter des lames et des balles à mains nues. Mr. 1 semble de plus pouvoir couper des objets sans les toucher physiquement, en envoyant des lames d'air dessus. Ce fût montré avec des attaques comme Atomic Spar, Spar Break et une attaque non nommée qu'il utilisa pour attaquer Nami avant d'expliquer la nature de ses pouvoirs.
    **Faiblesses:**
    Ce fruit ne possède pas de réel point faible, à part les points faibles d'un fruit du Démon. Cependant, toute technique capable de trancher l'acier peut aussi affecter l'utilisateur de ce fruit. Ainsi, Zoro et Mihawk purent blesser Daz Bonez car ils était capables de trancher l'acier.                   
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Hebi Hebi no Mi modèle Anaconda') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    La principale force de ce fruit, est le gain de force la force physique et de souplesse acquises grâce à sa transformation, qui permet à Sandersonia d'avoir un long corps souple qu'elle peut utiliser comme si elle était un anaconda.
    De plus, la queue peut venir s'enrouler autour d'une cible afin de limiter ses déplacements et la laisser vulnérable. Cette force peut se révéler être une faiblesse, puisque Sandersonia peut être liée par la queue à quelque chose et être immobilisée. Ce Fruit est également sensible au feu, notamment celui dans lequel se plonge Marigold. En dehors de cela, ce fruit ne semble pas avoir de faiblesses particuliers en dehors des faiblesses standards des Fruits du Démon.                         
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Yuki Yuki no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    **Forces:**
    L'avantage chez ce fruit du démon, c'est qu'il permet à son utilisateur de se transformer en neige. Le Hie Hie no Mi, fruit du démon d'Aokiji, ainsi que le Yuki Yuki no Mi sont deux fruits du démon extrêmement similaires; cependant, il existe deux différences majeures : l'intangibilité de Monet pour la neige n'est pas un élément de l'état solide à moins qu'elle n'ait été compressé, et contrairement à Aokiji, Monet ne peut pas directement geler sa cible. En raison de l'écart de capacité de gel entre la neige et la glace, le Hie Hie no Mi est considéré supérieur au Yuki Yuki no Mi. Enfin, ce fruit, en raison de sa nature, confère à son utilisateur une résistance extrême, voire absolue, contre le froid.
    **Faiblesses:**
    Monet craint la chaleur, comme on le voit quand Nami l'attaque avec son Climat-Tact. De plus, les attaques de Mone peuvent être stoppées si son corps est frappé avant qu'elle n'ait eu le temps d'employer son attaque. En outre, Monet peut également perdre le contrôle de ses transformations si elle est submergée par la peur, comme elle le montre lors de son combat contre Zoro; en effet, la femme-neige n'arrivait pas à bouger alors que Zoro s'apprêtait à lui asséner un coup mortel. Heureusement pour elle, ce dernier n'a pas utilisé le haki de l'armement, ce qui l'aurait probablement tuée. En réalisant cela, Mone n'arrivait pas à reconstituer les parties de son corps, un effet dû, d'après Tashigi, à la crainte et à la peur d'être tuée.
    Enfin, ce fruit possède également les faiblesses communes à tous les fruit du démon.                               
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Toge Toge no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    Grâce à ce Fruit, Miss DoubleFinger peut empêcher les attaques au corps-à-corps. De plus, les piques sont suffisamment solides pour percer des murs, ce qui peut être utile pour franchir des obstacles. En faisant pousser des piques sous ses chaussures, Miss DoubleFinger peut également grimper aux murs, et même aux plafonds. Elle peut de plus piquer ses bras pour augmenter leur taille et donc sa force.
    Ce Fruit ne semble pas posséder de faiblesses mis à part les faiblesses standard des Fruits du Démon.                               
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Hebi Hebi no Mi modèle Cobra Royal') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    La principale force de ce fruit, est le gain de force la force physique et de souplesse acquises grâce à sa transformation, qui permet Marigold d'avoir un long corps souple qu'elle peut utiliser comme si elle était un anaconda. Par ailleurs, elle acquiert la capacité de cracher du venin mortel pour des attaques à moyennes distances. Sa forme hybride semble lui conférer une capacité de résistance à la chaleur et au feu. Marigold peut même s'en servir pour faire d'elle une arme vivante, en se brûlant entièrement le corps.
    Marigold peut être liée par la queue à quelque chose et être immobilisée. On ne sait pas pour combien de temps Marigold peut résister au feu. En dehors de cela, ce fruit ne semble pas avoir de faiblesses particuliers en dehors des faiblesses standards des Fruits du Démon.                               
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Toro Toro no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    Le Toro Toro no Mi permet à son utilisateur de se transformer en un liquide inconnu, permettant à son utilisateur de s'écouler à travers les petits espaces et d'attaquer avec des coups liquides. De plus, les attaques physiques passent à travers le corps liquide, car c'est un Fruit de type Logia. Honey Queen est donc à l'abri des coups physiques sans Haki.
    Cependant, l'utilisateur, sous sa forme liquide, n'a pas de force physique efficace, et Honey Queen ne peut pas transformer de nouveau dans sa forme normale si elle est dans un espace plus réduit que son corps normal. En raison de ces défauts, Nami a facilement capturé et scellé Honey Queen dans un bocal alors qu'elle était dans sa forme liquide, et donc elle ne pouvait pas échapper.
    En outre, même si la plupart des pouvoirs des Fruits du Démon permettent de transformer les vêtements de l'utilisateur avec leur corps en l'élément de l'utilisateur, elle laisse toujours ses vêtements derrière tout en se transformant en liquide. Autre que cela, l'utilisateur est également affecté par les faiblesses standards des Fruits du Démon.                            
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Ori Ori no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Le principal intérêt de ce fruit est qu'il permet de neutraliser ses adversaires sans les blesser. Hina étant un Colonel de la marine, ce fruit lui permet de capturer des pirates rien qu'en les touchant. Il y a deux moyens de piéger l'adversaire, en les faisant traverser son corps ou en les emprisonnant dans les barreaux qu'il crée. Ce Fruit semble donner à son utilisateur des propriétés des type Logia, car son corps peut être traversé et ne pas subir de dommages, de plus Hina peut produire et contrôler à volonté des barreaux. C'est cependant bien un type Paramecia. Hina semble aussi avoir développé la capacité de tordre ses bras pour former un début d'anneau, ce qui est humainement impossible sans le pouvoir de ce Fruit.
    **Faiblesses:**
    Par contre, il ne peut être utilisé que pour neutraliser, on ne peut l'utiliser ni pour attaquer, ni pour se défendre (bien que la neutralisation soit une forme d'attaque et de défense). À part ça, ce Fruit possède les faiblesses caractéristiques des Fruits du Démon.                                
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Kame Kame no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    Pekoms a la capacité de se transformer en tortue et de se protéger des attaques ennemies grâce à une carapace très résistante qu'il compare lui-même à du diamant. Elle est en effet capable de le protéger d'une rafale de balles et à l'effondrement d'une maison.
    L'un des inconvénients de ce Fruit est le fait que les vêtements de Pekoms tombent parfois quand il se transforme, car ses membres rentrent dans sa carapace; il doit donc les remettre en place après avoir retrouvé son corps de Mink. Le Fruit n'a pas d'autre faiblesse connue à part celles liés aux Fruits du Démon.                                      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Pasa Pasa no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    **Forces:**
    Comme le montre Simon, ce Fruit permet à son utilisateur de se transformer en feuilles de papier pour frapper ou esquiver des attaques comme tout autre utilisateur de Fruit du Démon de type Logia. Il apparaît également que ces transformations peuvent être utilisées pour écrire quelque chose, comme son symbole pirate sur une feuille, ce qui laisserait supposer qu'il peut produire une certaine quantité d'encre. On peut également voir qu'il peut se transformer en différentes formes plus complexes comme des cartes ou des livres. Ce fruit est très efficace face à l'électricité, à l'instar du Gomu Gomu no Mi.
    **Faiblesses:**
    Ce fruit est très vulnérable au feu et face aux objets tranchants. Mis à part cela, ce Fruit possède les faiblesses standards des Fruits du Démon.                                            
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Bane Bane no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La principale force de ce fruit, c'est qu'il permet à son utilisateur de transformer certaines parties de son corps en ressort, ce qui lui confère divers avantages, comme sauter très haut, se déplacer à une vitesse hors du commun, charger rapidement sur l'ennemi et donner des coups d'une rare violence. Lorsque l'utilisateur rebondit sur une surface solide, la force de compression du ressort provoque la fracture de celle-ci. À noter que l'utilisateur peut également transformer son abdomen en ressort, afin de se mouvoir avec plus d'agilité.
    **Faiblesses:**
    Les ressorts ne peuvent projeter l'utilisateur de ce fruit que dans une direction rectiligne, ce qui permet aux adversaires de prédire approximativement sa trajectoire et d'agir en conséquence. En outre, l'utilisateur du fruit ne peut rebondir que sur des surfaces solides. Hormis cela, ce fruit possède les faiblesses communes à tous les Fruits du Démon, à savoir une annulation de l'énergie de l'utilisateur lorsqu'il est immergé sous l'eau, ou lorsqu'il touche du Granit Marin.                                                  
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Mushi Mushi no Mi modèle Guêpe') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    Ce fruit est très utile puisqu'il permet de se transformer en insecte, ici en guêpe et ainsi de passer presque inaperçu. Bee Anne peut surement piquer grâce à ce fruit du démon et faire très mal comme une guêpe, étant donné qu'elle a un dard. Sa principale force est qu'il permet de voler.
    À part ça, il possède les faiblesses standards des autres Fruits du Démon.                                                        
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Ame Ame no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Ce Fruit permet à Gasparde de liquéfier et durcir son corps. Il peut aussi transformer ses membres en armes (ex: il peut transformer sa main en pieu). Étant un Fruit du Démon de type Logia, l'utilisateur ne craint apparemment pas les attaques physiques. Le gros avantage de ce fruit est que contrairement aux autres Logia qui laissent passer l'attaque à travers eux, le pouvoir du Ame Ame no Mi freine les coups de poings et autres attaques jusqu'à immobiliser et piéger l'adversaire dans son corps, permettant à l'utilisateur de frapper tranquillement son adversaire. L'utilisateur peut de plus faire varier la densité du sirop, ce qui est unique pour un Logia, passant d'un sirop liquide à semi-solide voire très solide quand il forme un pieu avec son bras. L'utilisateur peut paraître "comestible" mais Luffy n'a pas pu le garder en bouche et a dû le recracher, mais cela peut-être du au fait que Gasparde se débattait pour sortir de la bouche de Luffy.
    **Faiblesses :**
    Mis à part les faiblesses communes aux autres Fruits du Démon, la principale faiblesse de ce fruit est la farine. Gasparde semble de plus ne pas très bien maîtriser ses pouvoirs, ayant eu une blessure quand il fût frappé par un mât de son navire par derrière, et qu'il fut légèrement blessé par une attaque surprise de Luffy qui ne maîtrisait pas le Haki à cette époque. Cela montre qu'il fait suffisamment confiance aux pouvoirs basiques de ce fruit pour se défendre et battre ses ennemis, et qu'il se croit invulnérable à cause de son intangibilité.                                                              
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Ito Ito no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    L'utilisateur de ce fruit peut manipuler les personnes à sa guise avec des fils, comme si elles étaient des marionnettes. Une fois sous son emprise, les personnes sont incapables de résister. Le fait de lever un doigt permet de tirer le fil qui est attaché a un membre du corps et ainsi manipuler la personne.
    L'utilisateur peut également s'en servir pour "voler" dans le ciel en connectant ses fils aux nuages ou même découper des personnes et des choses plus ou moins épaisses ou les immobiliser. Cela se confirmera lors de la bataille de Marineford où il découpera le pied d'Odz Jr et empêcha Joz d'attaquer Crocodile ou encore la météorite envoyée par l'Amiral Fujitora. Ses fils sont extrêmement puissants pour détruire un bâtiment comme l'a démontré la technique "Overito" et leur portée est extrêmement longue pour permettre à Doflamingo d'atteindre des îles.
    L'utilisateur peut aussi réparer ses organes lorsque ceux ci sont endommagés en les reconstituant avec des fils. Ce pouvoir a notamment été utilisé pour réparer les organes internes de Doflamingo qui avaient été brûles par Law.
    **Faiblesses:**
    Selon les dires de Law, ce Fruit possède une faiblesse : tant qu'il n'y a pas de nuages dans le ciel, Doflamingo est incapable d'y accrocher ses fils et ne peut, de ce fait "voler". Hormis cette faiblesse, aucune autre n'a été dévoilée. Cependant le Ito Ito no Mi n'est pas immunisé contre les faiblesses standards à tous les Fruits du Démon. Il peut donc être considéré comme un fruit du démon très puissant, étant donné qu'il n'a pour le moment aucune faiblesse particulière.                                                                    
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Mushi Mushi no Mi modèle Scarabée Rhinocéros') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Ce fruit est très utile puisqu'il permet de se transformer en insecte, ici en scarabée rhinocéros et ainsi de passer presque inaperçu. Sa principale force est qu'il permet de voler.
    **Faiblesses:**
    À part ça, il possède les faiblesses standards des autres Fruits du Démon.                                                                          
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Noro Noro no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La force primaire de ce fruit, comme nous le fait témoigner Foxy, est d'émettre des rayons ralentissant tout ce qu'ils touchent nommés Photons Noroma (ノロマ光子 Noroma Kōshi), ce qui donne à l'utilisateur un très grand avantage puisque la personne ciblée devient plus lente de 30 fois, ce qui donne largement de temps pour l'utilisateur afin de bien tabasser la victime. L'effet dure 30 secondes. Pendant ces 30 secondes, l'adversaire ressent les coups, mais les impacts sont souvent visibles dès que l'effet des "photons Noroma" s'achève.
    **Faiblesses:**
    Malheureusement pour l'utilisateur, il n'est pas vraiment immunisé contre ses propres rayons, ce qui le rend exposé contre son propre pouvoir, ce dont les membres de L'Équipage du Chapeau de Paille profitent en utilisant des miroirs, sans oublier les faiblesses standards des Fruits du Démon.                                                                                
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Doa Doa no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Comme le démontre Blueno, les pouvoirs conférés par ce fruit permettent de faire apparaître des portes à travers toute surface solide (comme des murs, ou même des gens), et ainsi de les traverser aisément. Cependant, l'aspect le plus intéressant de ce fruit réside dans la possibilité de créer des portes dans l'air.
    En franchissant une de ces portes, l'utilisateur se retrouve alors dans une dimension parallèle, depuis laquelle il peut voir et entendre ce qui se passe dans le monde réel, mais par contre, il lui est impossible d'interagir avec sa dimension d'origine. Ce monde est enveloppé d'une sorte de "gelée" verte dans lequel l'utilisateur du Fruit peut évoluer à sa guise sans se faire remarquer.
    Il peut bien sûr, par le biais d'une nouvelle porte, revenir dans son monde, et ce à n'importe quel endroit. Il peut ainsi se déplacer incognito sur de longues distances. Il est à noter qu'au bout d'un certain temps, les portes se referment d'elles-même (mais l'utilisateur peut aussi décider manuellement de leur fermeture).
    **Faiblesses:**
    Ce fruit ne semble pas présenter de faiblesses particulières, hormis les faiblesses standard des fruits du démon                                                                                      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Awa Awa no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Le Awa Awa no Mi permet de créer et contrôler des bulles de savon. Les bulles sont créées à partir du corps de l'utilisateur et peuvent même être produites par-dessus ses vêtements et des gants. Ces bulles permettent de nettoyer toutes sortes de choses, et peut permettre à Kalifa de nettoyer une personne jusqu'à lui soutirer toute son énergie. L'utilisateur peut également produire des bulles qui se condenseront et formeront un bouclier entourant l'utilisateur pour le protéger. De plus, l'utilisateur est sans doute la personne la plus propre du monde grâce à ce Fruit, Kalifa peut nettoyer une ville entière de sa saleté avec le pouvoir nettoyant de l'Awa Awa no Mi.
    **Faiblesses:**
    Sa plus grande faiblesse est l'eau qui enlève le savon. À part cela, ce Fruit possède les faiblesses standards des Fruits du Démon.                                                                                           
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Zo Zo no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La force la plus fondamentale du Fruit est qu'il donne à son utilisateur les points forts d'un éléphant. Dans le cas de l'épée de Spandam, la force la plus importante du Fruit, c'est qu'il a donné vie à un objet inanimé. Grâce à cela, Spandam, assez limité physiquement en combat, a reçu une arme unique avec laquelle se battre.
    **Faiblesses:**
    L'animal créé à partir de ce fruit a une faiblesse mineure donnée par la conscience de l'animal du Fruit. Le Fruit a certes donné à l'épée de Spandam la force et l'intelligence de l'éléphant, mais le Fruit a par inadvertance aussi donné à l'épée un peu de bon sens. Cela s'est révélé être une faiblesse lorsque Franky a menacé de tirer sur Funkfreed en plein dans le visage. Alors que l'épée ne peut pas réfléchir, l'éléphant Funkfreed a eu peur d'être tué par Franky comme un éléphant réel l'aurait été dans une telle situation et est passé de forme hybride à animale comme Franky le demandait. En d'autres termes, la peur d'être tué a été insufflée à l'épée grâce aux pouvoirs de ce Fruit.
    Le fruit jusqu'à présent ne semble pas avoir de faiblesses particulières en dehors des faiblesses standards des Fruits du Démon.                                                                                                 
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Beri Beri no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces:**
    La seule force du fruit vue jusqu'ici, est que l'utilisateur est apparemment à l'abri d'attaques directes,(comme des coup de poing ou des coups de pied...). En se transformant en boules en forme de baies, une attaque comme une droite de Franky n'a aucun effet. Dans le manga, les boules formées semblent ne pas pouvoir flotter, uniquement rebondir sur le sol. Dans l'anime, il est démontré que les parties du corps de l'utilisateur peut flotter dans les airs comme Baggy. Contrairement au Bara Bara no Mi, le pouvoir du Beri Beri no Mi permet à l'utilisateur de faire léviter toutes les parties séparées de son corps, y compris les pieds.
    **Faiblesses:**
    Malheureusement, la principale faiblesse du Beri Beri no Mi est qu'il sacrifie la force de l'utilisateur. Il semble aussi que l'utilisateur ne peut transformer que son corps tout entier à la fois dans ces sphères, à la différence de Baggy, qui peut utiliser son pouvoir uniquement les parties du corps choisies. Il est également montré dans l'anime que l'utilisateur est totalement sans défense si sa tête est prise. A part cela, ce Fruit possède les faiblesses classiques des Fruits du Démon.                                                                                                       
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Sara Sara no Mi modèle Axolotl') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    **Forces:**
    Ce Fruit octroie à Smiley un pouvoir simple: se déplacer. En effet étant à l'origine un condensé de gaz, Smiley ne pouvait faire le moindre mouvement mais dû à la nature du Fruit, il peut se transformer en animal lui permettant de se déplacer. Ce fruit est totalement immunisé face au feu. Les soldats du G-5 ont essayé de l'enflammer ce qui a eu pour effet de le faire exploser en tuant les soldats, mais Slimey a pu se reconstituer après, de par sa nature de gaz. De plus un soldat a tenté de le pousser mais s'est retrouvé coincé dans Smiley (il est fait de matière gluante) ce qui a eu pour effet de l'empoisonner en inhalant du gaz. Sa forme d'animal et son corps "physique" restent ainsi faits de gaz, et conservent les mêmes propriétés, même si Smiley peut avoir une forme semi-solide quand il se divise en petits Smileys.
    **Faiblesses:**
    A part les faiblesses communes à tous les Fruits du Démon, ce fruit semble handicaper son utilisateur étant donné que l'Axolotl est une créature vivant essentiellement dans l'eau. Comme l'utilisateur ne peut plus nager, il ne peut donc plus vivre sous l'eau. Smiley semble avoir compris que l'eau était une de ses faiblesses, puisqu'il se divise pour se projeter au-dessus de l'eau et l'éviter s'il a besoin de traverser un lac.                                                                                                             
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === '.wiki Sabi Sabi no Mi') {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses**
    **Forces:**
    La force principale de ce Fruit est de donner à son utilisateur la capacité de rouiller et de réduire en poussière tout objet métallique, ce qui donne un avantage considérable face à des adversaires sabreurs.
    Dans l'animé, il est montré que ce fruit confère a son utilisateur une défense permanente contre les épées ou tout autres armes faites avec du métal. En effet, une épée touchant le corps de l'utilisateur va rouiller immédiatement avant que le sabreur puisse couper l'utilisateur. De plus, l'utilisateur est également en mesure de rouiller les articulations humaines rien qu'en les touchants, surement en rouillant le fer contenu dans le sang.
    **Faiblesses:**
    Cependant, ces pouvoirs ne protègent pas l'utilisateur contre des objets non-métalliques, comme un oiseau enflammé lancé par Usopp. De plus, si ces pouvoirs sont utilisés sur un être vivant, l'effet de rouille peut disparaître en laissant seulement quelques traces, si la victime n'est pas transformée intégralement en rouille. En effet, la rouille sur le bras de Zoro a disparu juste après que Shû l'ait lâché. Mis à part cela, ce Fruit possède les faiblesses standards des Fruits du Démon.                                                                                                                   
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Fruit d'Alpacacino`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    Alcapacino est un bazooka qui, même en se transformant en alpaga, peut envoyer des boulets de canon destructeurs.
    Aucune faiblesse n'est connue hormis celle de tous les Fruits du Démon.      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Shari Shari no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Le seul avantage démontré procuré par ce fruit est que l'utilisateur peut faire tourner des parties de son corps comme des roues avec une vitesse très élevée. Ces roues sont alors redoutablement puissantes quand il s'agit d'attaquer un adversaire.
    **Faiblesses:**
    Aucune faiblesse de ce fruit n'a été démontrée, en dehors des faiblesses standards qui touche les utilisateurs des fruits du démon (l'impossibilité de nager, et la faiblesse contre le Granit Marin). Cependant, il semble qu'un cyborg comme Franky puisse contrer ces roues sans montrer un effort apparent, ce qui montrerait une limite à la puissance de rotation des roues.            
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Ryu Ryu no Mi modèle Allosaure`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    C'est un Zoan Antique, un type de Fruit du Démon extrêmement rare. L'animal en lequel peut se transformer Drake est un immense Allosaure vert plus grand qu'un Pacifista, la taille de l'animal en lequel Drake se transforme étant plus de 3 fois sa taille normale. Dans cette forme, il est assez grand et fort pour causer des dommages sérieux à l'un des Pacifistas en lui mordant la tête, ce qui est assez difficile à cause de la solidité des Pacifistas.
    Sa mâchoire est beaucoup plus développée et ses dents plus pointues et acérées, il est capable de blesser un Pacifista, donc de fendre l'acier qui les compose en partie. Ses mains n'ont plus que trois doigts avec de grandes griffes également pointues et acérées.
    On peut également mentionner qu'il est un Zoan Carnivore, l'Allosaure étant un grand dinosaure carnivore terrestre. Cela lui donne des capacités de combat plus féroces qu'un Zoan classique.
    Cependant, il est vulnérable aux lasers des Pacifistas
    Mis à part cette faiblesse et les faiblesses standards des Fruits du Démon, il ne semble pas posséder d'autres faiblesses particulières.                  
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Yomi Yomi no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Ce fruit permet d'avoir une seconde vie. Cependant, grâce au faible poids de l'utilisateur, il permet aussi de courir sur l'eau et de faire des bonds prodigieux. N'ayant pas d'organes vitaux, il ne peut pas y être blessé, et ne pourra pas donc être mortellement blessé.
    **Faiblesses:**
    Il n'a pas de faiblesses particulières sauf pour les faiblesses basiques des utilisateurs de Fruits du Démon.                        
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Zo Zo no Mi modèle Mammouth`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La forme gigantesque accordée par ce fruit est incroyablement massive, Jackétant de base anormalement grand, il devient encore plus imposant sous cette forme. Il est deux à trois fois plus grand qu'Inuarashi, qui est beaucoup plus grand qu'un humain moyen. Jack peut détruire les bâtiments avec un seul coup de trompe et laisser des empreintes sur le sol juste en marchant avec ses pattes massives.
    **Faiblesses:**
    Toutefois, la force que donne ce fruit est inutile si la cible peut y résister et la surmonter, comme quand Jack se confronte à Inuarashi et Nekomamushi qui ont pu le stopper et même le retourner dans les airs. L'utilisateur est également très lourd et lent sous cette forme, étant incapable d'éviter rapidement les attaques. Sinon, l'utilisateur est affecté par les faiblesses standards des Fruits du Démon. Jack, bien que pouvant survivre sous l'eau, est ainsi immobilisé lorsqu'il devient immergé au fond de l'océan.                            
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Kage Kage no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La force première de ce fruit comme l'a démontrée Moria, est que son utilisateur peut manifester des ombres sous une forme physique et tangible. L'ombre suit l'âme des mouvements de son propriétaire et ne peut être changée de la naissance à la mort. Ce Fruit du Démon permet à l'utilisateur de modifier cette règle absolue. Avec ce pouvoir, l'utilisateur peut saisir l'ombre de sa victime et peut la couper avec une paire de ciseaux comme s'il s'agissait de ruban adhésif. Il peut ensuite placer l'ombre dans un cadavre sans vie afin de créer un zombie. La taille de l'ombre elle-même n'a pas besoin d'être proportionnée à celle du cadavre pour la faire revivre comme on peut le voir lorsque Moria a réanimé le corps colossal d'Oz en utilisant l'ombre de Luffy. Le zombie créé conserve les manières et les capacités de la victime.Cependant, le zombie n’a que la force de son corps. Au cours de la bataille de Marineford, Moria a démontré que le Kage Kage no Mi est particulièrement utile dans des conditions de guerre où il y trouve beaucoup de soldats pour voler des ombres et beaucoup de corps pour une zombification facile.
    Le zombie en lui-même n'hérite pas non plus des pouvoirs du Fruit du Démon du propriétaire de l'ombre. Bien que le sbire n'hérite d'aucun pouvoir du Fruit du Démon, l'utilisateur du Kage Kage no Mi peut manipuler l'ombre du zombie afin que son corps puisse avoir les capacités pour changer son corps, telles que celles de certains Fruits du Démon de type Paramecia.                            
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Kage Kage no Mi') {
    msg.channel.sendMessage(`Quant aux propriétaires d'origine de l'ombre, une fois celle-ci séparée de leur corps, ils tombent dans un coma de deux jours. L'utilisateur du Fruit du Démon peut utiliser cet effet secondaire à son avantage en combat car le propriétaire est complètement sans défense jusqu'à ce qu'il se réveille. Le propriétaire originaire de l'ombre est obligé de rester dans l'obscurité car il se désagrège s'il est frappé par la lumière du soleil.`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Kage Kage no Mi') {
    msg.channel.sendMessage(`Le propriétaire originaire est également incapable de projeter un reflet dans un miroir et ne peut pas être photographié. Il est à noter que le fait d'être exposé à la lumière du jour après l'extraction de son ombre signifie généralement la mort instantanée ; les victimes dont les ombres ont été extraites depuis un certain temps peuvent en réalité rester un peu plus longtemps sous le soleil comparées à celles qui ont été prises récemment. Au cours de la bataille finale contre Moria, les membres sans ombres de l'Équipage du Chapeau de Paille ont instantanément perdu la partie supérieure de leur corps tandis que l'Équipage du Rolling commençaient seulement à se désagréger un peu.
    L'utilisateur du Kage Kage no Mi a également le contrôle total sur le retour ou non des ombres à leurs propriétaires d'origine ; le simple fait de vaincre l'utilisateur, voire de le tuer, ne restituera pas les ombres volées par l'utilisateur. L'utilisateur doit volontairement dire qu'une ombre doit revenir à son maître pour pouvoir être renvoyée dans son intégralité. Cependant, cela est contredit par le fait que les ombres peuvent être restituées aux propriétaires en purifiant ou en détruisant les zombies animés par leur ombre.
    L'utilisateur est également capable de manifester sa propre ombre sous une forme physique semi-liquide. Il est alors capable de contrôler son ombre et de la faire se battre pour lui à sa place. Son ombre, en tant que manifestation physique, est un être d'une force semblable à celle d'un utilisateur d'un Fruit du Démon de type Logia car dans cet état, l'ombre est insensible aux dommages. Il est également capable de changer de forme et de taille en fonction des souhaits de l'utilisateur. L'utilisateur peut également changer de lieu avec son ombre pour se rendre à différents endroits. Le moment où l'utilisateur change de place avec son ombre peut également être utilisé pour esquiver les attaques car l'ombre est invulnérable.`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Kage Kage no Mi') {
    msg.channel.sendMessage(`L'aspect le plus puissant du fruit est que l'utilisateur peut prendre les ombres qu'il a implanté dans ses zombies et les placer à l'intérieur de lui-même pour un gain de puissance. Cette augmentation de puissance peut être dévastatrice si l'utilisateur absorbe suffisamment d'ombres et peut finalement provoquer une augmentation spectaculaire de la taille de l'utilisateur.
    **Faiblesses:**
    Bien que ce fruit puisse avoir de nombreux points forts, il comporte également de nombreux points faibles.
    L'utilisateur s'appuie normalement sur les ombres pour pouvoir utiliser ses pouvoirs mais en le privant de ses ombres, y compris la sienne, un adversaire peut empêcher l'utilisation du Fruit et le rendre complètement impuissant. Cela a été démontré lorsque Moria a été attaqué par Don Quichotte Doflamingo et s'est, en quelque sorte séparé de son ombre, le laissant ainsi sans défense.
    Une autre faiblesse est que l'utilisateur n'a pas à donner l'ordre pour qu'une ombre soit renvoyée au propriétaire. Si un zombie qui a reçu une ombre par le pouvoir de ce fruit et qu'il mange du sel, l'ombre retournera à son propriétaire d'origine. Le sel étant un élément de la mer, cela supprime les pouvoirs des Fruits du Démon. La quantité de sel nécessaire pour extraire une ombre d'un zombie est proportionnelle à la taille de celui-ci ; Oz était immunisé contre une pastille de sel lancée par Usopp, mais aurait pu être purifié par un grand sac de sel projeté dans sa bouche, si il n'avait pas été protégé par l'ombre de Moria. Un homme habile à manipuler l'eau de mer devient alors une menace sérieuse pour l'utilisateur. Une ombre reviendra également à son propriétaire d'origine si le corps contenant l'ombre est complètement détruit car lorsque Ryuma a été complètement brûlé, Brook a retrouvé son ombre. De plus, Moria ne peut tout simplement pas tuer ses victimes pour les empêcher d'essayer de récupérer leurs ombres plus tard, car leurs ombres disparaîtront si elles meurent.`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Kage Kage no Mi') {
    msg.channel.sendMessage(`En outre, l'utilisateur ne peut contrôler entièrement ses sbires que lorsque les ombres proviennent de propriétaires relativement faibles. Les serviteurs des ombres provenant de propriétaires relativement puissants sont plus difficiles à contrôler, comme l'a démontré Inuppe, qui contenait l'ombre de Sanji, s'est battu contre les autres zombies pour protéger Nami. Malgré cela, quelle que soit la force de l'ombre, il finira par oublier les souvenirs de son propriétaire d'origine et obéir complètement à l'utilisateur. Cependant, il y a des moments où un zombie peut devenir désobéissant et même rassembler au moins une partie de son humanité antérieure telle qu'il était ; par exemple lorsque Victoria Cindryne pouvait plus bouger et ne pouvait pas suivre les ordres de Hogback après la déclaration de Chopper sur l'humanité. Il y avait aussi des cas où un ordre donné forcerait le zombie créé à donner la priorité à cet ordre plutôt qu'à sa loyauté envers Moria, comme en témoigne le fait que les Wild Zombies ont aidé Perona à fuir de Thriller Bark après qu'elle les ait informés de son intention de quitter Moria. En outre, les sbires peuvent toujours conserver certains maniérismes de l'ombre qui y est implantée même après être devenus complètement obéissants tels que les tentatives de Laura de se marier, la perversité de Ryuma, la consommation de boisson de John, Inuppe et les querelles incessantes de Jigoro et la crédulité de Oars. Les sbires peuvent aussi être trop obéissants pour leur propre bien; quand Hogback fut amené à ordonner à Inuppe et à Jigoro de sauter hors du bâtiment, chose qu'ils ont fait sans hésiter.
    Une autre faiblesse notable du fruit est que les ombres libérées par les pouvoirs de l'utilisateur peuvent être utilisés contre lui.`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Kage Kage no Mi') {
    msg.channel.sendMessage(`Après la purification d'un zombie, l'ombre libérée peut être capturée par n'importe qui (puisqu'elle est encore temporairement dans un état tangible jusqu'à ce qu'elle soit correctement réunie avec son propriétaire d'origine), qui peut la placer en eux-mêmes ou dans le corps d'un allié. Si la personne est toujours consciente, elle va acquérir les capacités du propriétaire d'origine de l'ombre et devenir plus forte. On peut également y placer plusieurs ombres, en multipliant leur force par le nombre d'ombres implantées. Cependant, comme l'ombre implantée dans une personne vivante n'a pas la même âme, elle ne restera dans son corps que pendant dix minutes. Ensuite, l'ombre retournera à son propriétaire d'origine. En outre, le nombre d'ombres pouvant être implantées dans une personne est quelque peu limité par la force de son esprit. Si l'esprit de la personne est faible, elle perdra conscience et les ombres seront perdues. Pour une personne normale, la limite est de deux ou trois ombres, mais une forte volonté peut en contenir plus et même se transformer en une forme beaucoup plus forte, en fonction du nombre d'ombres qu'ils absorbent. Monkey D. Luffy, en particulier, était capable de contenir 100 ombres dans son corps, se transformant en hulk connu sous le nom de Nightmare Luffy.
   De plus, l'utilisateur ne semble avoir aucun moyen de garder une trace des ombres qu'il extrait de ses victimes. Lorsque Luffy, en mode Nightmare Luffy vint confronter Moria, le Shichibukai pensa en fait que la nouvelle forme de Luffy était le résultat de ses pouvoirs qui ont changé, ne réalisant pas que son rôle avait permis à Luffy de devenir plus fort plus tard.
   De plus, si l'utilisateur absorbe beaucoup d'ombres, comme on a pu le voir lorsque Moria a absorbé 1000 ombres, si on le frappe avec suffisamment de force ou de pression, les ombres peuvent s'échapper par sa bouche et revenir aux propriétaires d'origine.`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Kage Kage no Mi') {
    msg.channel.sendMessage(`Cela a été démontré lorsque Moria a été écrasé sous son propre manoir et lorsqu'il a été frappé par le Gomu Gomu no Mi Gigant Jet Shell de Luffy. L'utilisateur peut partiellement empêcher cela en se couvrant la bouche avec les mains, mais il ne s'agit que d'une solution temporaire.
    Étant donné que le pouvoir repose largement sur le pouvoir des autres, cela peut affaiblir l’utilisateur au fil du temps car ils comptent trop sur ses subordonnés pour se battre, ce qui rend l’utilisateur paresseux; Moria affirme qu’il deviendrait le Roi des Pirates par la simple utilisation de son armée de zombies, et le ou les hauts représentants du Gouvernement Mondial décident plus tard qu'il est trop faible pour continuer à être un Shichibukai et envoient Doflamingo pour l'éliminer.
    De plus, bien que Doppelman protège automatiquement l'utilisateur des attaques, il peut être trompé et ne peut pas réagir à une embuscade ou à une attaque surprise.
    Autre que cela, l'utilisateur est affecté par les faiblesses standard d'un Fruit du Démon.`);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Ryu Ryu no Mi modèle Spinosaure`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    La force principale de ce Fruit est de permettre à l'utilisateur de se transformer en Spinosaure, un dinosaure haut de plus de quatre mètres. Il permet notamment à Page One d'être plus féroce, étant donné que les Zoans Carnivores sont supposés être plus féroces que les Zoans normaux. Il donne également à Page One une taille suffisamment grande pour se tenir aux toits des maisons.                                  
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Horo Horo no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Les fantômes créés par le Horo Horo no Mi dépriment de façon extrême, au point de les faire regretter d'exister, toute personne qu'ils touchent, les rendant ainsi inoffensifs et vulnérables pendant la durée de l'effet. Étrangement quand les ectoplasmes ont traversé le corps d'Usopp l'effet dépressif de ceux-ci n'a pas fonctionné sur ce dernier. L'effet est suffisamment long pour être fatal lors d'un duel à mort. Il est possible de lancer plusieurs fantômes à répétition pour paralyser indéfiniment la/les cible(s).
    Une deuxième catégorie de fantôme peut être créée. Des ectoplasmes-bombes qui explosent à l'impact ou selon la volonté de détenteur du pouvoir. L'explosion est suffisamment forte pour percer un mur et les ectoplasmes peuvent acquérir plusieurs tailles et forces. Il est possible de faire un fantôme-bombe suffisamment grand pour avaler une personne.
    Le détenteur du fruit peut se détacher de son corps et se déplacer en tant que fantôme ayant l'aspect de détenteur (Pas de transparence). Sous cette forme le détenteur peut utiliser tous ses pouvoirs, changer de taille et passer à travers les murs puisque celui-ci est intangible et donc invulnérable à toute forme d'attaque. Il n'existe à ce jour aucune limite de distance qui peut séparer le corps de la forme astrale.
    De plus, les fantômes sont également capables de traverser les murs et les personnes, ce qui est pratique pour l'espionnage.
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Horo Horo no Mi`) {
    msg.channel.sendMessage(`**Faiblesses:**
    Lorsque le détenteur du pouvoir quitte son corps pour se déplacer sous sa forme astrale, son corps matériel ne peut être contrôlé et est donc très vulnérable car inanimé. Le détenteur doit réintégrer son corps pour le déplacer de nouveau. La réintégration n'est pas instantané, ce qui signifie que le fantôme doit voler jusqu'à son corps.
    De plus, le pouvoir de démoralisation est inefficace contre quelqu'un qui pense tout en négatif (comme on a pu le voir avec Usopp), se retournant même contre l'utilisateur si cette personne est totalement négative.
    Mis à part cette faiblesse et les faiblesses standards des Fruits du Démon, il ne semble pas posséder d'autres faiblesses particulières. 
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Ryu Ryu no Mi modèle Ptéranodon`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    La principale force de ce Fruit est qu'il permet à son utilisateur de voler en se transformant en Ptéranodon, un grand reptiles volants préhistoriques. Sous sa forme animale, l'utilisateur peut endommager d'un seul coup de patte le navire principal de l'Équipage de Big Mom, le Queen Mama Chanter
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Suke Suke no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
    **Forces:**
    La capacité primaire du Suke Suke no Mi est de rendre l'utilisateur invisible. Cette capacité s'étend également à quoi que ce soit en contact direct avec l'utilisateur.En raison de cette capacité, l'utilisateur peut espionner des conversations sans être repéré (ainsi que le pouvoir de mater les filles) et lui permet également d'enlever les gens avec aucun risque d'être suivi. Il peut attaquer les ennemis par surprise et s'infiltrer dans des camps ennemis. Cela lui permet également de cacher des armes comme des bazookas, provoquant un effet de surprise, les munitions restant invisibles. Il peut même rendre des navires entiers invisibles afin de s'enfuir sans être repéré.
    **Faiblesses:**
    Le principal défaut de ce Fruit, c'est que la présence de l'utilisateur peut être révélée si le corps de l'utilisateur est recouvert par des substances telles que l'eau, le sel, le sang, etc... même s'il peut probablement rendre invisible cette tâche s'il se rend compte de sa présence. Toutefois, l'adversaire a encore une chance de les apercevoir. Une autre faiblesse est que si l'utilisateur s'approche de trop près d'un adversaire, il pourrait être frappé si l'adversaire frappe dans le vide et a un coup de chance. En outre, l'adversaire peut recourir à d'autres sens (ouïe, odorat, etc...) Les objets invisibles deviennent visibles instantanément, une fois qu'ils n'ont plus de contact avec l'utilisateur, si l'utilisateur n'est pas concentré dessus. Le pouvoir du Fruit s'estompe également pour un court instant si l'utilisateur est frappé puissamment (comme les coups de pied de Sanji). Cela va même jusqu'à rendre l'utilisateur visible complètement s'il est inconscient.
    A part cela, le Fruit possède les faiblesses propres à tous les Fruits du Démon.      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Minotaure`) {
    msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Nikyu Nikyu no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Le principal atout conféré par ce fruit est que l'utilisateur peut repousser tout ce qu'il veut grâce aux coussinets sur ses mains. Il peut repousser tout ce qui est tangible (objets, humains, animaux...) et aussi ce qui est intangible (air, attaque), voire abstrait (douleur, fatigue). La vitesse à laquelle ces choses sont repoussées dépend de l'utilisateur, et peut s'élever à la vitesse de la lumière.
    Kuma s'en sert aussi pour se déplacer très vite, en repoussant l'air à très grande vitesse, ce qui donne l'impression qu'il se téléporte. Le plus impressionnant étant qu'il peut envoyer une personne à un endroit dans le monde juste en le frappant avec ses coussinets, la victime volera trois jours de suite avant de s'écraser sur une île (le plus souvent inaccessible et située à l'autre bout du monde).
    **Faiblesses:**
    Ce fruit n'a pas de faiblesse connue à ce jour, hormis celle commune à tous les Fruits du Démon.            
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Minorhinocéros`) {
    msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !           
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Ope Ope no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    **Forces:**
    Le Ope Ope no Mi permet à l'utilisateur de manipuler n'importe quoi (personnes, boulets de canon, navires, etc.) dans une zone délimitée appelée "Room" dont il peut gérer la taille. Grâce à cette capacité, Law peut démembrer les personnes à distance sans les tuer ni même leur faire mal, soulever ou déplacer des objets de toute taille, échanger les cœurs des personnes ainsi qu'intervertir leurs personnalités. Depuis sa première apparition, Law a développé ses capacités en grande partie pendant l'ellipse et peut maintenant, contrairement à avant, couvrir une zone beaucoup plus grande avec sa technique "Room".
    Après avoir échangé les personnalités d'autres personnes, seul Law peut les ré-échanger, mais les corps doivent être présents pour qu'il puisse les restituer dans les corps d'origines. Dans le cas d'échange d"âmes", les pouvoirs d'un Fruit du Démon sont maintenus dans le corps d'origine, alors que les capacités comme le Fluide semble rester dans l"âme", tel qu'on le voit lorsque Sanji a utilisé son Kebunshoku Haki (Haki de l'Observation) dans le corps de Nami.
    Il peut également rattacher des pièces séparées comme bon lui semble, comme coller la tête de quelqu'un à un tonneau. Les personnes séparées par cette capacité ne sont pas tuées et peuvent encore sentir leurs parties séparées, quelle que soit la distance (un peu comme Baggy quand il utilise ses pouvoirs du Bara Bara no Mi).
    En d'autres termes, il peut couper à travers la chair et les os sans pour autant nuire à la victime. Toutefois, lorsque le pouvoir est utilisé sur un objet inanimé, le pouvoir agit normalement et l'effet persiste même après que Law retire la sphère.             
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Ope Ope no Mi`) {
    msg.channel.sendMessage(`
    Les parties séparées peuvent être rassemblées à la normale. Cependant, elles peuvent être temporairement assemblées dans le désordre ou "rattachées" sur d'autres surfaces, y compris sur le corps de quelqu'un d'autre le temps d'être complètement ré-assemblées.
    Il est également capable de changer de place les gens qui se trouvent dans sa "Room", comme il l'a fait avec Jean Bartet Bepo pour protéger ce dernier contre un Pacifista dans l'anime. Law est ainsi en mesure d'utiliser une "Room" pour se téléporter. Il a aussi la capacité de générer de forts courants électriques semblable à ceux d'un défibrillateur mais aussi d'isoler l'organe d'une personne, comme le cœur. L'organe interne prélevé par cette capacité devient vulnérable et sans protection.
    Il semble que si un utilisateur d'un fruit de type Logia est manipulée par le pouvoir de Law, alors la partie extraite de ce dernier devient indépendante des pouvoirs de son Fruit du Démon, ce qui signifie que cette partie peut également être blessée puisqu'elle n'est plus protégée par l'inconsistance du Logia. Détail observable lorsque César tue Monet(utilisatrice du Yuki Yuki no Mi) en poignardant son cœur sans utiliser de fluide ou de Granit Marin.             
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Ope Ope no Mi`) {
    msg.channel.sendMessage(`**Faiblesses:**
    L'inconvénient du fruit est que l'utilisateur de l'Ope Ope no Mi peut seulement utiliser ces pouvoirs dans une zone spécifique, donc si la cible se déplace hors de la zone, elle est à l'abri de ses pouvoirs. Il semble que Law doive faire des gestes de la main pour utiliser certaines attaques. Il a également été suggéré par Smokerque l'inconsistance d'un Logia puisse offrir un certain niveau de protection contre les pouvoirs de ce fruit, puisqu'il affronte Law de front sous forme de fumée partielle.
    De plus, Smoker a aussi fortement insinué que la maîtrise suffisante du fluide peut offrir une certaine résistance. Mais en dépit de cela, Law a pu scinder Vergo en deux, même après que le vice-amiral de la Marine ait utilisé le fluide offensif intégral.
    Pour finir, l'utilisation de ce fruit est dangereuse pour son utilisateur car très éprouvante.
    Les utilisateurs de Fruit du Démon qui ont été divisés par ce pouvoir ressentiront les effets de l'eau de mer si l'une des parties de leur corps a été submergée.
    L'Ope Ope no Mi n'a pas révélé d'autres faiblesses mis à part les faiblesses normales des Fruits du Démon.    
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Minozèbre`) {
    msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !             
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Shiro Shiro no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    Il semble posséder un pouvoir qui lui permet de faire de son corps une véritable forteresse qui peut contenir ses hommes miniaturisés. Ceux-ci retrouvent leurs tailles lorsqu'ils en sortent. On les voit tirer des boulets de canons à travers des ouvertures au niveau de son ventre, qui retrouvent eux aussi leur taille normale et explosent sur les Marines. On voit de plus des tireurs placés dans sa tête et voyant à travers les yeux de Capone Bege les cibles qu'ils doivent viser.
    Comme Don Krieg, Bege contrôle un certain nombre de subordonnés. Contrairement à Krieg, cependant, il les "stocke" dans son corps en utilisant son Fruit du Démon, y compris les chevaux et les canons. Il manifeste ces objets en dehors de son corps en commençant par les canonnières et fait apparaître des pont-levis sur sa personne par lesquelles ses "troupes" peuvent sortir. On ne sait pas si les personnes, les animaux et les objets qui ont été créés par ses propres pouvoirs ont été bien réels et miniaturisés par ses pouvoirs. C'est essentiellement ce qui fait de Bege une forteresse à taille humaine et littéralement un homme-armée. Si aucune attaque n'est effectuée par les personnes à l'intérieur de Bege, le corps de ce dernier ne montre alors aucun indice d'une quelconque anormalité. Cela peut leurrer d'éventuels ennemis qui croient ainsi avoir affaire à quelqu'un sans défense.
    Son intérieur ressemble littéralement à une forteresse avec des chambres de briques en pierre ainsi que des ponts-levis qui peuvent s'ouvrir et se fermer. Différentes salles sont présentes, de la salle présente dans son œil servant de lieu de tir pour ses soldats, à la salle de banquet qu'il utilise pour parler pacifiquement avec un interlocuteur.             
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Shiro Shiro no Mi`) {
    msg.channel.sendMessage(` Lorsque les objets et les personnes à l'intérieur parviennent à une certaine distance de son corps, ils passent à travers une couche rosée autour de Bege, ils reprennent leur taille normale après avoir traversé cette couche rose, entraînant une grande salve de canon et une cavalerie qui sort de nulle part du corps de Bege.
    Il peut se déplacer instantanément à sa guise à l'intérieur de son intérieur, se matérialisant en une forme miniaturisée de lui-même, via un étrange fluide qui prend la forme de son corps. La forteresse étant littéralement le corps de l'utilisateur, celui-ci peut communiquer indifféremment avec les personnes à l'intérieur comme à l'extérieur.
    **Faiblesses:**
    Si personne n'est "dans son corps", ce fruit est logiquement inutile. De plus, il semble que si l'utilisateur fume, ceci affecte les troupes qui se situent dans son corps, les empêchant de combattre correctement. Capone a été horrifié lorsqu’il s'est rendu compte que la cigarette de Sanji était dans son château, craignant un incendie. Cela suppose que son corps est comme une maison donc, vulnérable de l'intérieur. Ainsi, même sa forme "Big Father" n'est pas invulnérable, et peut être détruit par des attaques extérieures, entraînant la mort de l'utilisateur et la disparition de la forteresse. De plus, n'importe qui peut sortir de son corps en marchant à travers la sortie principale, forçant l'utilisateur à être attentif pour ne laisser personne s'échapper. Ces aspects mis à part, ce fruit possède les faiblesses standards des Fruits du Démon.                   
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Minokoala`) {
    msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !                   
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Wara Wara no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    **Forces:**
    Basil Hawkins à la capacité du Fruit du Démonde type Paramecia de la paille qui lui permet tout d'abord de créer et manipuler de la paille. Il peut aussi rediriger tous les dommages physiques qui lui sont infligés vers une autre personne en utilisant des poupées vaudous de paille. Ainsi, il reste indemne, mais oblige sa victime à prendre des dommages s'élevant à ce qu'il aurait dû recevoir. Il a été capable de résister consécutivement à un coup et à un tir de laser de Kizaru, le premier ayant fait tomber un bâtiment. On ne sait pas si Hawkins peut choisir directement qui va recevoir les dommages à sa place. Après que les dommages corporels aient été pris, les poupées vaudou qui représentent les personnes qui ont pris les dégâts sortent de son corps, montrant les effets de l'attaque. Le Fruit du Démon lui permet également de transformer en un gigantesque épouvantail qui ressemble à une poupée vaudou géante, avec des clous en métal fonctionnant comme des griffes ou des ongles.             
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Wara Wara no Mi') {
    msg.channel.sendMessage(`**Faiblesses:**
    La faiblesse de ce pouvoir est que le nombre de poupées vaudou qu'Hawkins conserve en lui est limité. Ceci est indiqué quand il dit à Kizaru qu'il était peu sage pour lui de se battre avec une dizaine de simples «hommes» (poupées vaudou). Ceci implique qu'il peut tenir un plus grand nombre de poupées si besoin. Chaque attaque correspond à une poupée unique, donc si il est touché plus de fois qu'il a de poupées pour rediriger ces blessures, il devient tout aussi vulnérable qu'un être humain ordinaire. Les tirs rapides et les attaques qui viennent en succession rapide sont particulièrement puissantes contre Hawkins. Cela se voit quand Kizaru a tout simplement tiré des lasers quand il était sous sa forme d'épouvantail à un rythme rapide, brûlant huit autres de ses poupées en quelques secondes. Il semble également que la capacité de la poupée à transférer des dommages est limitée aux seuls dommages corporels, comme l'a indiqué Kizaru lorsque qu'il aveugle Hawkins en utilisant une lumière intense.
    Sa forme d'épouvantail présente également une faiblesse significative. Bien que cette forme lui accorde une plus grande force et des capacités d'attaque, les bases de son Fruit du Démon s'appliquent toujours. Cela signifie que en utilisant cette forme il fournit à ses ennemis une cible beaucoup plus importante, ce qui rend beaucoup plus facile le fait d'épuiser son stock de poupées vaudou à travers des dégâts répétés. Il semble également revenir à sa forme humaine à l'épuisement des poupées au combat.
    Il a aussi les faiblesses communes à tous les Fruits du Démon : l'eau, le Granit Marin et le Haki.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Minochihuahua`) {
    msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !             
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Mero Mero no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    Ce Fruit permet à son utilisateur d'envoyer un rayon semblable à celui du Noro Noro no Mi de Foxy qui fige et transforme en pierre toute personne ressentant de l'amour (perverti ou non) envers le possesseur du fruit. La pierre peut être brisée. Toutes les personnes ayant été victime du Mero Mero no Mi perdent une partie de leurs souvenirs. Ce Fruit permet également de faire en sorte que toute personne (ou presque, ce ne fût pas le cas pour Luffy) regardant Boa Hancock devienne instantanément amoureux d'elle.
    Le rayon du fruit est sans effet si les personnes ne ressentent rien pour le détenteur du Mero Mero no Mi ou si les personnes détournent leurs sens vers une source d'attention (ex : la douleur comme le fait le vice-amiral Momonga en se plantant un couteau dans la main). Toutefois, les autres capacités de ce fruit semblent pouvoir atteindre toutes les cibles, même si elles ne ressentent aucune attirance pour l'utilisateur (le Pistol Kiss frappe douloureusement Luffy, et elle détruit facilement des objets et des Pacifista). Par ailleurs, quelqu'un qui ne peut pas voir Hancock ne ressent pas d'effets du fruit.             
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Tori Tori no Mi modèle Phoenix`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    **Forces:**
    C'est un Fruit du Démon de type Zoan Mythique, un type de Fruit du Démon très rare, plus rare qu'un Logia selon Kizaru, qui permet à son utilisateur de se transformer en phénix ou en une forme hybride.
    Il peut soigner ses blessures et peut donc posséder une très longue vie. Cette capacité est bien entendu compromise si le possesseur du fruit a des menottes en granit marin à son poignet comme lors de la bataille de Marineford, lorsqu'Onigumo réussit à en attacher une paire à Marco, ce qui a permis à Kizaru de le blesser. Ce fruit permet également à son utilisateur de voler, tout comme le Tori Tori no Mi, modèle Faucon mangé par Pell.
    Enfin, le possesseur de ce fruit peut appliquer les flammes sur autrui pour le soigner, bien que ce pouvoir est très réduit par rapport à celui d'auto-régénération et marche mieux sur des faibles blessures.
    **Attaques physiques et régénération:**
    L'utilisateur est immunisé contre les attaques physiques de la même manière que les Logia. On le voit la première fois que Marco utilise son fruit du démon, à Marineford lorsqu'il contre les rayons de Kizaru en les prenant à la place de Barbe Blanche. Ces rayons laissent des blessures, qu'il referme rapidement grâce au pouvoir de régénération du phénix. Marco dira cependant qu'elles lui ont fait mal. La forme hybride permettrait de ne pas être blessé par ces attaques mais de les sentir, alors que sous sa forme animale, Marco semble ne rien sentir et est à l'épreuve de toutes sortes d'attaques.             
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Tori Tori no Mi modèle Phoenix') {
    msg.channel.sendMessage(`**Feu:**
    Le phénix étant l'oiseau de feu, Marco peut donc maîtriser le feu, une ressemblance de plus avec les Logia qui maîtrisent chacun un élément de la nature. Ce feu est cependant différent du pouvoir de feu d'Ace puisque celui que Marco maîtrise est de couleur bleue, dans lequel circule de petites flammèches de feu orange, mais ne brûle pas contrairement au feu d'Ace. Ces flammes ne brûlent pas et ne sont pas chaudes, mais peuvent régénérer les blessures. Elles peuvent lui servir de bouclier, comme lorsqu'il a défendu Ace et Jinbe d'Akainu.
    Une autre particularité est qu'il peut faire apparaître des flammes sans avoir besoin de se transformer, alors que les Zoans habituels ne peuvent bénéficier de leurs pouvoirs que sous la forme hybride ou animale, comme lorsqu'il produit des flammes avec sa main.
    **Faiblesses:**
    Ce fruit ne semble pas posséder de faiblesse particulière, à part le Haki de l'Armement qui permet de frapper Marco même sous sa forme complète de Phénix et celles communes à tous les Fruits du Démon. Cependant, même si le Fluide est efficace face à Marco il peut se soigner, seul le granit marin est utile pour neutraliser ses pouvoirs.
    Ce fruit ne possède pas d'autres faiblesses particulières, hormis celles communes à tous les Fruits du Démon.
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Doku Doku no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La principale force de ce fruit, c'est d'accorder à son utilisateur la capacité de produire et contrôler différents types de poisons. En fonction du type de poison utilisé, la victime peut être prise de symptômes allant de simples éternuements à la mort. Ce fruit confère également à son utilisateur une immunité totale à tout type de poison. Lors de ses combat, Magellan recouvre son corps de poison, le protégeant ainsi de toutes les attaques directes.
    A noter que le poison libéré par Magellan peut être liquide ou gazeux selon sa volonté. Le poison habituellement utilisé par Magellan se soigne sans trop de complications grâce à un antidote; cependant, si la victime a inhalé ou a été en contact avec trop de poison, il devient très difficile de la soigner, voire impossible.             
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Doku Doku no Mi') {
    msg.channel.sendMessage(`
    **Faiblesses:**
    Outre la faiblesse qui s'applique à tous les utilisateurs de Fruits du Démon, le Doku Doku no Mi souffre de plusieurs faiblesses. En effet, il provoque chez son utilisateur de fortes diarrhées, forçant Magellan à passer pas moins de 10h par jour aux toilettes, même si cela semble être dû au fait que Magellan respecte le vieil adage: "Tu es ce que tu manges". Comme il est un homme poison, il se doit d'en manger à chaque repas, ce qui provoque ces effets négatifs. De plus, Magellan doit éviter d'utiliser trop de poison lors de ses combats; par exemple, après son combat contre Luffy, il eut de forts maux de ventre et des envies difficilement contrôlables.
    En outre, le poison liquide produit par le Doku Doku no Mi est inefficace face au feu et ne peut traverser certains matériaux non-organiques, comme la Doru Doru no Mi de Mr. 3. A noter que les ténèbres du Yami Yami no Mi de Barbe-Noire peuvent elles aussi absorber le poison de Magellan. Enfin, si la victime guérit miraculeusement des effets corrosifs et mortels du poison, par exemple grâce au Horu Horu no Mi, elle développe des anticorps qui la rendront insensibles au poison, quelque soit le type utilisé.      
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Hito Hito no Mi modèle Daibutsu`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    **Forces:**
    La principale force de ce Fruit est qu'il permet à son utilisateur de se transformer en un imposant daibutsu (bouddha) géant doré, ou grise dans Gigant Battle. Sous cette forme, l'utilisateur décuple sa puissance et sa taille, lui donnant d'énormes bras et paradoxalement de minces jambes. Sous cette forme, il est suffisamment lourd pour détruire des structures rien qu'en étant dessus (comme l'échafaud d'exécution de Portgas D. Ace). En plus de cette transformation, l'utilisateur peut provoquer avec ses mains des vagues d'ondes dévastatrices, qui semblent être générées de ses mains.
    **Faiblesses:**
    Ce fruit ne semble pas posséder de faiblesses, exceptées les faiblesses propres à tous les Fruits du Démon.             
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Horu Horu no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La principale force du fruit, comme le dit Emporio Ivankov, est de créer et de manipuler des hormones spéciales. En transformant les doigts de sa main (excepté le pouce) en seringues, il peut transmettre différents types d'hormones à une autre personne. Ces hormones peuvent manipuler les différents aspects d'une personne, comme la température du corps, le sexe, la pigmentation, la croissance, et même l'état émotionnel. En tournant ses quatre doigts sous forme de seringues et en plantant une personne avec, l'utilisateur est en mesure d'injecter ces hormones. Ainsi, il donne à la personne un plan génétique selon ses désirs. Ce processus peut également être utilisé par l'utilisateur sur lui-même, avec les même effets.
    **Faiblesses:**
    Ivankov semble être obligé d'être en contact avec sa victime pour lui appliquer des hormones. Sa technique "hormones de vigueur" (utilisée sur Luffy à Impel Down et à Marine Ford) a également une lacune : elle permet certes de récupérer son énergie, mais elle fait perdre 10 ans de sa vie à la cible. Ivankov déclare aussi que son pouvoir de guérison est limité et dépend beaucoup de la volonté de survivre de l'utilisateur. Le fruit, jusqu'à présent, ne semble pas avoir d'autres points faibles en dehors des faiblesses standards des autres Fruits du Démon.                   
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Fruit du Démon Artificiel`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
    Le Fruit du Démon Artificiel est un fruit qui permet à son utilisateur de se transformer en dragon oriental. La transformation semble être inférieure à celles des vrais Fruits de type Zoan : bien qu'il soit un dragon, Momonosuke est à peine assez grand pour transporter Luffy, et ses vêtements ont complètement disparu après sa transformation. L'utilisateur de ce Fruit peut également créer des nuages sur lesquels il peut s'accrocher, donnant l'impression qu'il vole.
    Le Fruit a été crée artificiellement et il semblerait que ce soit un échec, il semble avoir quelques défauts. Quelques instants après avoir mangé le Fruit, Momonosuke s'est transformé inconsciemment et il affirme ne pas savoir comment reprendre forme humaine. On remarquera plus tard qu'il est capable de se transformer à nouveau, mais que cela semble être de manière aléatoire et inconsciente. Comme ses vêtements disparaissent lorsque Momonosuke se transforme en dragon, il se retrouve entièrement nu quand il reprend forme humaine.
    Le Fruit donne également l'incapacité à nager, comme les Fruits du Démon non-Artificiel, voire chapitre 795 du manga. De plus, la forme mi-dragon mi-humain de Momonosuke n'a jamais été vu, il se pourrait donc qu'il n'existe pas de forme hybride.                         
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Choki Choki no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    **Forces:**
    La principale force de ce fruit, comme le témoigne Inazuma, c'est de permettre à son utilisateur de transformer certaines parties de son corps en ciseaux. Sous cette forme, il peut trancher n'importe quelle matière solide très facilement, quelque soit sa dureté. Il peut de plus crocheter les serrures, qu'elles soient en granit marin ou pas.
    Une fois coupé, le matériau est susceptible d'être manipulée comme de simples feuilles de papier mais tout en conservant sa densité d'origine.
    **Faiblesses:**
    La défense de ce fruit n'est pas très riche. Il coupe tout ce qui est solide rendant ce pouvoir peu commode dans un endroit comme un bateau. Enfin, ce fruit possède les faiblesses communes à tous les fruit du démon.                               
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Fruit de Kaido`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
    Kaido est suffisamment grand pour se déplacer très rapidement sur une grande distance, et se sert du ciel pour voler sur des nuages. Il peut cracher des attaques dévastatrices capables de détruire des ruines d'un château instantanément.
    Ce fruit n'a pas de faiblesses connues hormis celles communes à tous les fruits du démon. Cependant, Kaido a repris forme humaine après que Luffy l'ait frappé à plusieurs reprises, ce qui peut indiquer qu'il préfère sa forme humaine dans un combat.                               
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Gura Gura no Mi`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet:   **Forces et Faiblesses:**
    **Forces:**
    Ce Fruit du Démon permet à son utilisateur de générer des tremblements de terre sous la forme d'ondes sismiques en frappant l'air ambiant qui se fissure, causant ainsi le tremblement. Les séismes causés peuvent détruire quasiment tout. C'est pourquoi on peut dire que le Gura Gura no Mi est très certainement l'un des Fruits du Démon les plus destructeurs au monde, comme le souligne Sengoku. Il est de type Paramecia, ce qui rend son utilisateur totalement vulnérable aux attaques physiques mais il permet également des créer des tsunamis gigantesques. Selon Sengoku, c'est le plus puissant de tous les Fruits du Démon, sa force est tel qu'il rivalise avec les Logia très facilement. L'onde de choc provoquée par son utilisateur peux « ébranler » les océans sur toutes les mers. Barbe Blanche qui est le possesseur original de ce fruit est surnommé « le Roi des Mers ». De plus, il s'en sert aussi de « bouclier » pour détruire les attaques venant contre lui comme les tirs de canons par exemple.
    **Faiblesses:**
    A part les faiblesses standards des Fruits du Démon, le Gura Gura no Mi ne semble pas posséder de faiblesses particulières.                               
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
  if (msg.content === `.wiki Inu Inu no Mim modèle Kyubi no Kitsune`) {
    msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et Faiblesses:**
    La principale force de ce Fruit est qu'il donne à son utilisateur la capacité de se transformer en Kyubi, une créature mythologique. Elle peut se transformer en une personne différente suffisamment bien pour tromper des connaissances de cette personne.
    Jusqu'à présent, ce Fruit ne présente aucune faiblesse, hormis celles communes à tous les Fruits du Démon. Il semble cependant que Devon doive d'abord se transformer en renard si elle veut reprendre son apparence originelle.                               
    `);
  }
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Kira Kira no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et Faiblesses:**
  **Forces:**
  La principale force de ce fruit est qu'il permet à son utilisateur d'avoir une défense quasi impénétrable car il peut se défendre en recouvrant son corps de diamant. Le diamant en question est capable de résister à un coup d'épée de Dracule Mihawk, ainsi que de solidifier ses coups de poing, les rendant ainsi plus puissants.
  **Faiblesses:**
  Hormis les faiblesses communes à tous les Fruits du Démon, la seule faiblesse de ce fruit connue à ce jour est les attaques d'éléments comme celles du Hie Hie no Mi d'Aokiji.                               
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Hebi Hebi no Mi modèle Yamata no Orochi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et faiblesses:**
  **Forces:**
  Avec ce fruit, Orochi acquiert huit têtes, qui bougent indépendamment des autres en combat, pouvant aisément attraper un humain dans leur gueule. Orochi doit avoir confiance en son pouvoir étant donné qu'il l'utilise dans le but d'attaquer Komurasaki.
  **Faiblesses:** 
  Ce fruit n'a aucune faiblesse connue si ce n'est celles communes à tous les fruits du démon.
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Woshu Woshu no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et Faiblesses:**
  **Forces:**
  Apparemment ce fruit permet "d'étendre" ses adversaires à la manière d'un linge pour le faire sécher au soleil. Les personnes étendues sont alors douces comme des agneaux et n'ont plus aucune envie de se battre. Ce fruit peut également étendre les armes comme les épées retirant alors tous leurs tranchants.
  **Faiblesses:**
  Ce fruit n'a apparemment aucune faiblesse particulière excepté les faiblesses standard des Fruits du Démon.
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Inu Inu no Mi modèle Bake-danuki`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et Faiblesses:**
  **Forces:**
  La principale force de ce Fruit est qu'il permet à Pato de se transformer en Tanuki, une sorte de raton laveur issu de la mythologie japonaise. Étant un Fruit de type Zoan Mythique, il permet de se transformer en authentique Tanuki, et permet donc d'écrire sur des feuilles pour les transformer en objets vivants.
  **Faiblesses:**
  Ce fruit ne semble pas posséder de faiblesse particulière à part celles communes aux Fruits du Démon.
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Fuwa Fuwa no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et Faiblesses:**
  **Forces:**
  La force primaire de ce fruit consiste dans le fait que l'utilisateur peut contrôler la gravité, et l'utilisateur peut donc soulever les objets non-vivants, sans aucun contact physique même si les objets sont très lourds comme des immenses bateaux de guerre de la Marine. Cette capacité est similaire à la télékinésie.
  **Faiblesses:**
  La faiblesse primaire de ce fruit est le fait qu'il ne peut pas soulever les êtres vivants, et que pour contrôler la gravité d'un objet, l'utilisateur doit l'avoir touché au préalable. Si Shiki peut voler c'est grâce au deux épées qu'il a a la place des jambes. En effet, pour s’échapper d'Impel Down, il a du se sectionner les deux jambes qui étaient enchaînées, il les a ensuite remplacé par deux épées, et grâce a son Fruit du Démon qui lui permet de faire flotter tout objet non vivant, il peut faire flotter son propre corps en faisant flotter les épées qui remplace ses jambes. Mis à part cela, ce Fruit possède les faiblesses standards des Fruits du Démon.
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Batto Batto no Mi modèle Vampire`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et faiblesses:**
  **Forces:**
  La force principale du pouvoir de ce fruit est qu'il permet à l'utilisateur de se transformer complètement en vampire ou en une forme hybride. Il permet aussi de voler grâce aux ailes que possède une chauve-souris et donne la capacité de voler l'énergie vitale de sa cible en mordant son cou ou en y creusant ses ongles dans sa peau. Ainsi les victimes vieillissent et sont affaiblies. Il peut également rendre la force vitale qu'il a volé à ses cibles. L'utilisateur peut également disparaître et réapparaître ailleurs, comme un vampire. Il peut également lancer de puissantes ondes de choc de sang. 
  **Faiblesses:**
  Excepté les faiblesses de tous les fruits du démon, ce fruit ne semble pas avoir de faiblesses particulières.
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Mato Mato no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et Faiblesses:**
  **Forces:**
  Ce fruit rend l'utilisateur capable de viser toute personne qu'il touche avec ses mains et d'envoyer tout objet qu'il touche vers la cible mémorisée, peut importe la taille de l'objet. Après que sa main ait touché une personne, elle mémorise cette personne et l'utilisateur est en mesure de cibler la personne de n'importe quel endroit et à tout moment avec n'importe quoi, peu importe si l'utilisateur est ou non conscient de la localisation réelle de la cible. Même si les objectifs s'éloignent de leur emplacement actuel, les objets jetés iront toujours à eux, changeant immédiatement de trajectoire s'ils rencontrent un éventuel obstacle, allant même, dans le cas de flèches, à se plier pour suivre la trajectoire de leur cible. Il semble qu'une fois que l'utilisateur désigne une cible spécifique en les marquant à travers le toucher physique, les objets qu'il jette vont ensuite se planter au même endroit que celui à partir duquel l'utilisateur a établi le contact avec la personne, comme on peut le voir quand Decken a utilisé son pouvoir sur Octo en le touchant dans le dos, puis en lançant un couteau qui a fait une embardée et a ensuite heurté Octo sur ce point précis par la suite. Il faut de plus noter que ce Fruit a une particularité singulière parmi les Fruits du Démon, en effet alors que l'utilisateur est affecté par l'eau, les objets qu'il envoient, bien que guidés par le pouvoir du Fruit, peuvent traverser une grande étendue d'eau sans problème.
  A noter que l'utilisateur n'a pas besoin de lancer un objet. S'il le souhaite, il peut déplacer un objet, comme un bateau géant, en le touchant avec sa main qui a mémorisé la cible. En l’occurrence, il a touché le navire géant Noah et celui-ci s'est déplacé en direction de la cible, Shirahoshi, sans aucune assistance.
  `);
}
});

bot.on('message', msg => {
if (msg.content === '.wiki Mato Mato no Mi') {
  msg.channel.sendMessage(` **Faiblesses:**
  Vander Decken a dit à Octo qu'il ne s'est jamais lavé la main avec laquelle il a touché Shirahoshi. On peut donc supposer que si ses mains entrent en contact avec de l'eau son pouvoir s'annule. De plus, même si Vander Decken est un Homme-Poisson il peut se noyer suite à l'ingestion de ce Fruit du Démon, ce qui est un gros handicap pour un Homme-Poisson. L'utilisateur doit aussi toujours savoir où le projectile se trouve, pour éviter d'être blessé par ses propres armes qui suivent leur cible. Hody Jones, par exemple a utilisé cette particularité pour placer Decken entre lui et le poignard que Decken a lancé, poignard qui a alors transpercé Decken.
  Mis à part cela, ce Fruit possède les faiblesses standards des Fruits du Démon.
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Fuku Fuku no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  Ce Fruit permet d'apporter du confort immédiat dans toute situation. L'utilisateur peut générer des habits pour s'adapter aux conditions de l'environnement où il se trouve, comme lorsque Kinemon a matérialisé des habits chauds aux enfants de Punk Hazard et aux membres de l'Équipage du Chapeau de Paille qui avaient froid à cause de la neige. L'utilisateur peut également se déguiser, comme lorsque Kinemon s'est déguisé en Don Quichotte Doflamingo avec succès, puisque Gladius, de l'équipage de Doflamingo, l'a confondu avec le vrai.
  **Faiblesses:**
  Les vêtements, une fois enlevés, disparaissent instantanément et ne peuvent être récupérés. Kinemon semble avoir besoin de placer une pierre ou un petit objet sur la tête des personnes qu'il va habiller.
  Mis à part cela, ce Fruit possède les faiblesses standards des Fruits du Démon.      
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Buki Buki no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  Le Buki Buki no Mi confère à son utilisateur la capacité de changer toutes les parties de son corps (comme les mains, les bras, les doigts, les jambes voir même le corps tout entier) en n'importe quel type d'arme.
  Bien qu'étant transformée en arme, Baby 5 ne subit aucun dégât dû aux explosions ou détonations des armes de son corps. Si l'utilisateur s'est transformé en une arme destinée à exploser, un missile par exemple, les fragments de son corps se rassembleront automatiquement et reformeront son corps, à la manière d'un Fruit du Démon de type Logia.
  **Faiblesses:**
  Bien que l'utilisateur puisse se transformer lui même en arme, il n'est pas à l'abri des armes qui lui sont destinées, comme le prouva Gladius en lui tirant une balle dans la jambe. Cette faiblesse est d'autant plus importante que Baby 5 a une personnalité fragile, et n'hésitera pas à se tirer dessus si on le lui demande. En outre, ce fruit est atteint par les faiblesses communes à tous les Fruits du Démon.       
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Batman`) {
  msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !       
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Holdem`) {
  msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !       
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Bari Bari no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  La principale force du Bari Bari no Mi est de permettre à son utilisateur de créer des barrières (peut-être de toutes formes, car il a pu en créer des carrées ou des rondes) quasi-impénétrables permettant de se défendre à n'importe quelle occasion des attaques frontales ou autres.
  Il peut les solidifier afin de les rendre visiblement transparentes. Les barrières sont assez résistantes pour résister à un coup surpuissant d'un Homme-Poisson et même au fameux coup de poing d'Elizaberro II, qui est décrit pourtant comme étant capable de briser la défense d'une forteresse ou encore de mettre K.O l'un des Quatre Empereurs. Par ailleurs, elles peuvent être utilisées à des fins offensives, en les utilisant pour frapper l'ennemi.
  **Faiblesses:**
  Bien qu'elles soient très résistantes, les barrières ne sont apparemment pas permanentes, puisqu'à un moment, Bellamya été capable de toucher Bartolomeo avec une main tendue. La principale faiblesse de ce fruit réside dans le fait que Bartolomeo ne puisse assembler qu'un certain nombre de barrières (nombre inconnu), et qu'une fois ce nombre atteint, il ne peut plus en former avant que les précédentes ne soient détruites ou s'effacent avec le temps. Bartolomeo ne peut créer qu'une seule barrière à la fois et, pour ce, il est obligé de croiser ses doigts pour le faire. Ce qui signifie que, si les mains de Bartolomeo sont occupé, il ne peut créer de barrières et est donc à la merci de ses adversaires. A noter que les barrières crées par Bartolomeo ne sont pas insonorisées. Enfin, Les barrières crées par Bartolomeo ont une taille limitée. Hormis ces faiblesses, ce fruit possède également celles communes à tous les Fruits du Démon.             
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Speed`) {
  msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !       
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Nui Nui no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et Faiblesses:**
  **Forces:**
  La principale force de ce fruit, c'est qu'il peut coudre ses victimes pour les empêcher de bouger et les rendre ainsi immobiles et impuissantes. L'utilisation d'un fil sur une victime ne la blesse pas.
  **Faiblesses:**
  Il ne semble pas avoir de faiblesse particulière, hormis les faiblesses communes à tous les Fruits du Démon.
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Dobon`) {
  msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !       
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Giro Giro no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et Faiblesses:**
  **Forces:**
  La principale force de ce Fruit est qu'il permet à son utilisateur de voir à travers toute chose (ce qui est à prendre au sens propre comme au sens figuré); pour ce, l'utilisateur forme des cercles avec ses doigts et les place autour de ses yeux en se servant de l'index et du pouce de ses mains, comme des lunettes. Ainsi, l'utilisateur peut en quelque sorte "scanner" son regard sur une personne et peut voir à travers ses vêtements et même son squelette, un peu comme des rayons X.
  Ce n'est pas tout, le Giro Giro no Mi permet également à son utilisateur de lire dans l'esprit d'une personne et par la même occasion dans ses pensées. De ce fait, aucun mensonge ne peut s'interposer face à ce pouvoir. Ce Fruit a aussi la capacité de transférer ses propres souvenirs à une autre personne en regardant dans l’œil du transmetteur. Pour cela, il suffit de former un cercle autour de son œil et de le rapprocher en face de l’œil du receveur.
  Ce Fruit du Démon présente également des capacités offensives, puisqu'il permet à son utilisateur de manipuler ses larmes et de les transformer en projectiles dangereux, aussi durs que l'acier.
  Le Giro Giro no Mi permet à son utilisateur d'utiliser une vue d'ensemble lui permettant de tout voir dans un rayon de 4.000 kilomètres à la manière d'un rapace. Ainsi, l'utilisateur peut voir ce qu'il veut, d’où il le veut, même à l’intérieur d'un bâtiment, (s'il le connait déjà au préalable), et en plus il ne peut pas être surpris par son adversaire. Cette capacité est de loin la plus importante et la plus cruciale pour un équipage qui veut tout savoir d'un endroit ou d'un groupe d'ennemi sans être repéré par celui-ci.      
  `);
}
});

bot.on('message', msg => {
if (msg.content === '.wiki Giro Giro no Mi') {
  msg.channel.sendMessage(`**Faiblesses:**
  Ce Fruit ne semble pas avoir de grandes faiblesses hormis la faiblesse commune à tous les Fruits du Démon, cependant, il semblerait que l'utilisateur puisse être choqué par les pensées de sa cible ou bien que sa vision puisse être brouillée lorsque les désirs et les pensées de la victime sont forts.      
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Ato Ato no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet:  **Forces et Faiblesses:**
  **Forces:**
  La principale force de ce Fruit du Démon, c'est qu'il peut permettre à son utilisateur de transformer une personne ou un objet en œuvre d'art. Il peut également altérer la forme et l'apparence de n'importe quel objet comme on a pu le voir lorsqu'elle a tordu la Baguette Climatique de Nami. Une fois transformé, l'objet, qu'il s'agisse d'une arme ou d'un moyen de transport, perd sa fonctionnalité. C'est ce qui est arrivé à la Baguette Climatique de Nami qui ne pouvait plus utiliser ses Dials.
  **Faiblesses:**
  Pour que l'objet soit transformé, il faut qu'il soit en contact avec un nuage que produit Jora, celui-ci représentant l’œuvre qu'elle a imaginée.
  C'est ce qui semble être le seul point faible de ce fruit, car il suffit tout simplement d'éviter le nuage pour ne pas être transformé. Hormis cela, il possède les faiblesses standards des Fruits du Démon.            
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Alpagaman`) {
  msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !       
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Jake Jake no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  La principale force de ce fruit est qu'il peut augmenter sa corpulence et sa force en fonction de la personne qui l'enfile. Kerry Funk dit lui même qu'il peut aussi contrôler n'importe quoi et n'importe qui comme par exemple des animaux ou bien encore des monstres.
  **Faiblesses:**
  Cependant ce fruit semble être dépendant d'une autre personne pour que ca marche, il faut qu'une autre personne (ou un animal ou une créature) veuille porter la veste sinon ce serait inutile. A part ça, ce fruit possède les faiblesses communes à tous les Fruits du Démon.            
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Babanuki`) {
  msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !       
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Pamu Pamu no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  La force principale de ce pouvoir est qu'il permet à l’utilisateur de faire gonfler toute matière inorganique, au point de rompre et d'exploser violemment, il peut aussi les éclater à distance. Il peut également se faire éclater lui-même, ou des parties de son corps, à condition qu'elles soient recouvertes et sans que cela ne le blesse bien sûr.
  **Faiblesses:**
  La faiblesse de ce fruit est qu'il ne permet pas de faire exploser tout ce qui est organique, en l'occurrence les êtres vivants comme les plantes, les organes, les cellules, les animaux et bien évidement les êtres humains. Kyros ayant été transformé en un jouet, il était donc logiquement vulnérable. De même, si Gladius semble pouvoir se faire exploser lui-même, sans être amputé par la suite, c'est que son habillage complet est composé de parties métalliques et de rouages qu'il peut donc faire aisément exploser comme par exemple son casque en plomb. A part cela, ce fruit ne semble avoir aucune autre faiblesse hormis celles communes à tous les fruits du démon.                  
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Daifugo`) {
  msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !       
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Beta Beta no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  Ce fruit permet à son l'utilisateur de produire du mucus de toutes sortes, ce qui lui permet d'attraper ses adversaires et de les fixer. La cible attrapée ne peut plus bouger, ou il est plus difficile pour elle de se mouvoir.
  De plus, ce fruit rend l'utilisateur adhésif, ce qui lui permet de bien adhérer à tout type de surfaces diverses, qu'elles soient verticales ou horizontales, comme des toits ou des murs.
  Enfin, ce fruit semble capable d'amortir le choc de Trébol lorsqu'il chute, comme lorsque Trébol est tombé de très haut, on a vu que celui-ci s'est rapidement reconstitué devant Doflamingo, ce qui est très étrange pour un Paramecia car c'est une particularité que seuls les Logias possèdent.
  **Faiblesses:**
  La faiblesse de ce fruit est le feu (révélé dans le chapitre 739) puisque son mucus est inflammable. Ce détail peut être une force comme une faiblesse. Il possède aussi les faiblesses communes à tous les autres Fruits du Démon .                        
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Solitaire`) {
  msg.channel.sendMessage(`désoler mais aucune force ni faiblesse ne lui est connue si tu souhaite rediger un petit texte sur sa force et sa faiblesse n'hesites pas a contacter le fondateur bien sur tu seras recompensé !       
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Hobi Hobi no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  La principale force de ce fruit, c'est qu'il permet à son utilisateur de transformer les êtres vivants en jouets rien qu'en les touchant et de les contrôler comme s'il s'agissait de simples marionnettes, en passant un contrat forcé avec eux. L'utilisateur peut donc prendre un sérieux avantage face à un adversaire pendant un combat, car une fois que le contrat a été établi, la personne transformée se retrouve dans l'incapacité de désobéir aux ordres. Rappelons le, l'être vivant transformé en jouet est considéré comme inorganique (par conséquent, il est vulnérable au pouvoir du Pamu Pamu no Mi). De plus, l'étain dont sont constitués les jouets est fragile et sensible à la rouille, il est par conséquent facile à casser. Notez que si le jouet meurt, aucun retour en arrière n'est possible et que, par conséquent, il le restera.
  Suite à cela, les proches de ceux qui ont été victimes de la transformation perdent tout souvenir les concernant et il arrive même que ceux qui ont été transformés perdent tout souvenir de leur vie passée ou bien les gardent en mémoire. Le pouvoir du Hobi Hobi no Mi transforme instantanément la victime en jouet et, combiné à la vitesse de Sugar, celle-ci peut transformer un groupe de victime en quelques secondes. Il semblerait qu'elle puisse contrôler la transformation puisqu'elle a choisit de transformer un subordonné en une marionnette bien spécifique.
  Ce fruit possède également un gros avantage: il accorde la jeunesse éternelle à son utilisateur, c'est-à-dire le fait de ne jamais vieillir. Cet effet est également octroyé aux jouets lors de leur transformation. En effet, on peut voir que lorsque Kyros retrouve son apparence d'humain, il a le même âge qu'au moment où il avait été transformé en jouet, en dépit des 10 années passées.                        
  `);
}
});

bot.on('message', msg => {
if (msg.content === '.wiki Hobi Hobi no Mi') {
  msg.channel.sendMessage(`
  **Faiblesses:**
  Le gros défaut de ce fruit, c'est que quand l'utilisateur perd connaissance, tous les humains ayant été transformés retrouvent leur propre corps et dans le même temps, leur mémoire perdue. En outre, ce fruit arrête également la croissance de son utilisateur. Enfin, noter que si l'utilisateur du Hobi Hobi no Mi ne signe pas de contrat avec l'être vivant qu'il a transformé, celui ci sera libre d'agir à sa guise. Mis à part cela, l'utilisateur reste vulnérable aux faiblesses standards communes à tous les Fruits du Démon.
        
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Raki Raki no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  En touchant simplement une autre personne, l'utilisateur va voler la chance de cette dernière au point qu'elle deviendra extrêmement malchanceuse. Le toucher semble complètement normal, permettant à l'utilisateur d'agir discrètement. Une fois que l'utilisateur a absorbé suffisamment de chance, il devient si chanceux qu'il est presque invincible, car toute tentative de le blesser se solde par un échec, et il peut même utiliser des objets inoffensifs tels que des pièces pour causer de nombreux accidents en sa faveur. Un inconvénient à ceci est que l'utilisateur n'a aucun contrôle sur la chance en elle même; il sait juste qu'elle lui donnera un certain avantage.
  L'utilisateur peut également augmenter la chance des gens. Si cela arrive, la personne qui a été touchée deviendra soudainement très chanceuse, comme la façon dont Monkey D. Luffy a été en mesure de gagner chaque match au Gran Tesoro.
  Une des faiblesses de ce pouvoir est que son effet semble être temporaire, comme Luffy et Sanji ont cessé d'être affectés par la malchance après un certain temps. De ce fait, la chance que l'utilisateur a volée à d'autres personnes peut être épuisée, soit parce que suffisamment de temps a passé pour que la chance retourne aux victimes de l'utilisateur, ou parce que l'utilisateur a dépensé toute sa chance. L'utilisateur n'a aucun contrôle sur ce que la chance va lui faire faire, et peut accidentellement dépenser cette chance sur quelque chose qu'il ne voulait pas faire, même si cela restera positif pour lui. Un adversaire intelligent peut abuser de cela et finir par utiliser la chance plus rapidement que l'utilisateur.                              
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Sui Sui no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
  **Forces:**
  Grâce à ce fruit, l'utilisateur peut nager à travers les murs et le sol. L'utilisateur peut également utiliser cette capacité pour éviter les coups et ainsi avoir une défense parfaite. Il peut également nager vers le haut d'un bâtiment pour tomber d'une grande hauteur sans subir de blessures, à la manière d'un plongeon dans l'eau.
  **Faiblesses:**
  Aucune faiblesse n'est connue pour ce fruit, hormis celles communes à tous les Fruits du Démon. Ainsi, Señor Pink ne peut pas nager dans l'eau, comme tous les utilisateurs de Fruits du Démon.                                    
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Ton Ton no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  La principale force de ce fruit est qu'il permet à son utilisateur de planer dans les airs et d'augmenter son poids jusqu'à 10 000 tonnes afin d'écraser son adversaire. La puissance de cet écrasement est suffisante pour éclater le sol en morceaux ainsi que pour briser les os d'un géant.
  **Faiblesses:**
  La faiblesse de ce fruit est qu'il cause à Machvise de gros maux de ventre quand celui ci s'écrase sur le sol, l'empêchant même de bouger pendant quelques instants. Hormis cette faiblesse, ce fruit possède les faiblesses communes à tous les Fruits du Démon.                                          
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Ishi Ishi no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  La force principale de ce fruit réside dans sa capacité à se "fondre" dans la pierre, l'assimiler et pouvoir la contrôler. Ainsi, il peut prendre le contrôle de tout ce qui est constitué de pierre quand il entre en contact avec. Il en a fait la démonstration, notamment quand il a contrôlé le Palais Royal de Doflamingo, comme s'il s'agissait de son propre corps. À l'aide d'une méthode encore inconnue, Pica peut, semble t-il, augmenter considérablement les dimensions de son corps et se transformer en un golem titanesque. Par ailleurs, il peut changer la forme de tout ce qui est constitué de pierre. Il semblerait enfin que la force de ce Fruit soit directement proportionnelle à la quantité de pierre se trouvant dans l'environnement en question. Autrement dit, Pica aura beau avoir des parties de son corps tranchées à de nombreuses reprises, il pourra toujours se régénérer en assimilant plus de pierre. 
  De plus, comme le démontre l'image si contre, Pica possède la possibilité de modifier la taille de son corps afin de devenir géant.
  Il possède alors une force titanesque lui ayant permis de détruire la moitié de Dressrosa et d'envoyer à plusieurs kilomètres les personnes touchées.
  De plus, Pica possède grâce à son fruit du démon un pouvoir de régénération incroyable. En effet, il a réussi à reconstituer son bras après une surpuissante attaque combinée de Elizabello II et de Don Chinjao. Il a également résisté à un "Gum-Gum Grizzly Magnum" de Luffy, alors que cette attaque combine le Haki de l'armement et le Gear 3.                                          
  `);
}
});

bot.on('message', msg => {
if (msg.content === '.wiki Ishi Ishi no Mi') {
  msg.channel.sendMessage(`**Faiblesses:**
La faiblesse du Ishi Ishi no Mi est que l'utilisateur doit obligatoirement fusionner avec la roche pour la contrôler, comme lorsqu'on voit qu'au moment où Pica émerge de la pierre, le golem géant cesse de bouger. Etant donné que ce fruit n'est pas un logia, le corps de Pica ne se transforme pas en pierre mais il réside dans la structure de pierre contrôlée par lui-même. Il est alors aussi vulnérable qu'une personne normale.
En outre, l'utilisateur doit être en contact avec le sol pour assimiler la pierre.
Hormis ces faiblesses, ce fruit possède celle commune à tous les Fruits du Démon.
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Nagi Nagi no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Force:**
  L'utilisateur de ce Fruit du Démon a la capacité de créer un champ insonorisé. Le champ fait que les sons de l'extérieur ne peuvent pas être entendus de l'intérieur. Ceci s'applique dans l'ordre inverse aussi, faisant que les sons à l'intérieur du champ ne peuvent pas être entendus à l'extérieur. Il ne semble pas posséder de facultés purement offensives, bien qu'il soit utile en combat dans des espaces clos ou sombres pour des missions d’assassinat ou d’infiltration. En effet, Rossinante, après avoir pris le soin d'éteindre toutes les sources d'éclairage, se sert de son pouvoir pour s’infiltrer dans un lieu, prendre par surprise les ennemis qui ne peuvent ni le voir ni l'entendre, et s'échapper sans difficulté.
  **Faiblesses:**
  Une des faiblesses de ce Fruit est, comme évoquée juste avant, le manque de capacités offensives. Contrairement à d'autres Fruits qui peuvent avoir des pouvoirs destructeurs, ou inhibants, ou encore peuvent booster les capacités de leurs utilisateurs, le Nagi Nagi no Mi n'affecte en aucun cas, de manière physique ou mentale, l’utilisateur et les personnes autour de lui. D'ailleurs Law lui même trouve ce Fruit "nul" car pas impressionnant, et préfère les pouvoirs de Baby 5, au grand désarroi de Rossinante. L'utilisateur peut ainsi subir des blessures, et les murs insonorisants disparaissent si l'utilisateur meurt. Sinon ce Fruit n'a pas d'autres faiblesses, hormis celles communes à tous les Fruits du Démon.                                                
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Chiyu Chiyu no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  Malgré le peu d'informations connues sur ce fruit, sa principale force est qu'il peut guérir toutes les blessures physiques de tous les êtres vivants. L'utilisateur peut également se soigner lui-même. L'utilisateur peut créer une eau à partir de ses mains, qui possède les même propriétés de guérison.
  Ce pouvoir s'étend également aux êtres non vivants. En effet, il est dit que Mansherry peut, grâce à son pouvoir, reconstruire des choses ou des lieux détruits, comme l'Usine des Smiles, en échange du raccourcissement de son espérance de vie.
  **Faiblesses:**
  La principale faiblesse connue pour le moment est que ce pouvoir peut être utilisé sans l'aval de l'utilisateur, notamment en le forçant à pleurer pour que les larmes qui en découlent puissent guérir des ennemis. Il faut également un contact avec les larmes de l'utilisateur pour que celles-ci puissent guérir. Il y a également une limite au nombre de fois où ce Fruit peut être utilisé sur une personne.
  Sinon, ce fruit possède les faiblesses communes à tous les autres Fruits du Démon.                                                      
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Soru Soru no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
  **Forces:**
  Cela permet de vaincre aisément un ennemi en éliminant sa durée de vie. L'utilisateur peut, en créant des êtres formés de son âme, être "présent" dans plusieurs endroits à la fois. Big Mom peut extraire des morceaux d'âme d'un humain pour les injecter dans un objet ou un animal, lui donnant ainsi une partie de la conscience de l'utilisateur. Cette âme peut s'exprimer sous la forme d'espérance de vie, retirant des années de vie à la personne qui la perd.
  En injectant une partie d'âme dans un objet ou un animal, l'utilisateur peut leur donner une conscience basée sur celle de son ancien propriétaire. Ces nouveaux êtres humanoïdes sont appelés Homies. Le principal changement est l'apparition d'un visage au centre du Homie, sauf si c'est un animal. Si une Carte de vie est imprégnée de l'aura de l'utilisateur, la carte brillera et émettra une aura qui est visible des Homies et qui les forceront à obéir à la personne qui détient la carte de vie.
  L'utilisateur peut également créer des êtres humanoïdes noirs, des "Incarnations", qui peuvent absorber les âmes des gens pour récupérer notamment un droit de séjour sur Totto Land en échange de six mois de vie.
  **Faiblesses:**
  Les Homies créés par le pouvoir de ce Fruit, et ne venant pas de l'âme de Big Mom sont faibles face au pouvoir du Yomi Yomi no Mi, et peuvent s'évanouir si son utilisateur extériorise sa propre âme, comme lorsque Brook a combattu des Homies.
  Ce fruit est beaucoup moins efficace sur les personnes qui ne ressentent aucune peur à l'idée de mourir, cela a été vu sur Jinbe. Il souffre aussi des faiblesses standards aux autres Fruits du Démon.                                                            
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Mira Mira no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  La principale force de ce fruit est que l'utilisateur peut créer des miroirs avec ses mains. Ce miroir peut être utilisé pour renvoyer des attaques avec le reflet de l'ennemi. Ce même miroir peut également enfermer l'ennemi, et l'empêcher de sortir.
  Les miroirs peuvent également servir pour transformer l'utilisateur en reflet de quelqu'un, comme vu lorsque Brûlée prend l'apparence de Luffy. Néanmoins, cette transformation implique de reproduire chaque geste et chaque parole de la personne imitée. Une autre technique encore inconnue permet de transformer des animaux en clone de personnes, comme Sanji, Nami, Pudding, ou encore Chopper. Une fois battu, l'utilisateur peut réapparaître dans le miroir le plus proche.
  L'utilisateur est également capable de transformer certaines parties de son corps, comme Brûlée le montre lorsqu'elle prend l'apparence de César pendant sa fuite, puis redonne à son visage sa forme originale.
  La dimension parallèle "Mirror World" est une autre force de ce Fruit. Cette dimension permet de relier divers miroirs entre eux, et de se déplacer à volonté à l'intérieur, permettant de se déplacer dans le monde réel très rapidement, du moment qu'il y a un miroir à proximité.                                                            
  `);
}
});

bot.on('message', msg => {
if (msg.content === '.wiki Mira Mira no Mi') {
  msg.channel.sendMessage(`**Faiblesses:**
  L'adversaire peut profiter du fait que le reflet du miroir transforme les objets face au miroir, pour créer un leurre. Cela a été le cas avec Chopper et Carrot : quand Brûlée a utilisé son pouvoir sur Carrot, une grenouille s'est mise dans le champ a par conséquent pris l'apparence de Carrot (ce qui leur a par la suite permis d'utiliser deux "Carrot" pour piéger Brûlée). Pour qu'une tierce personne puisse traverser à volonté les miroirs créés par l'utilisateur, elle doit soit être en contact physique avec ce dernier, soit que l'utilisateur du Fruit ait une partie de son corps de chaque côté du miroir. Cette particularité s'est révélée être une faiblesse lorsque Brûlée fût capturée et utilisée comme moyen de passer les miroirs par L'Équipage du Chapeau de Paille. Aussi, les animaux transformés grâce à ce pouvoir continuent d'émettre des bruits d'animaux, ce qui peut permettre de se rendre compte de cette transformation.
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Pero Pero no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  Ce fruit permet à l'utilisateur de contrôler et de remodeler les bonbons dans n'importe quelle forme voulue et de les faire bouger à volonté, comme lorsque Perospero crée un escalator. Les bonbons qu'il manipule sont comestibles, comme il a déclaré que les invités de mariage pourrait le manger quand il aura fini de l'utiliser. Perospero a également prétendu qu'il allait transformer quelqu'un en bonbon. Le bonbon est suffisamment solide pour soutenir le poids de personnes marchant dessus, et pour immobiliser les corps pourtant renforcés des membres de la Famille Vinsmoke.
  Les bonbons créés par l'utilisateur sont susceptibles de fondre après un certain temps. Les capacités du fruit sont inefficaces contre les flammes. Le fruit n'a pas d'autre faiblesse connue hormis les faiblesses standards des Fruits du Démon.                                                                  
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Bisu Bisu no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  **Forces:**
  Cracker peut créer une infinité de biscuits, n'ayant que son endurance comme limite. Il utilise également son pouvoir pour combattre en décuplant ses membres et ainsi son épée et son bouclier, ce qui le rend quasi-intouchable. Ses biscuits sont aussi très robustes, étant difficiles à détruire. De plus, la foudre ne les détruit pas, mais les fait seulement cuire.
  **Faiblesses:**
  Au delà des faiblesses communes à tous les Fruits du Démon, la principale faiblesse connue du Bisu Bisu no Mi est qu'on peut simplement manger les clones de biscuits créés par l'utilisateur, et ainsi réduire l'effectif ennemi. C'est ce qu'a fait Luffy. Les biscuits peuvent également être mouillés, ce qui les rend inconsistants et inoffensifs, comme le fait Namiavec la pluie émanant de son Clima-Tact.                                                                        
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Kuri Kuri no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
  Ce Fruit permet à l'utilisateur de créer à volonté de la crème, et de la manipuler pour capturer des ennemis. La crème est sucrée, ce qui permet apparemment de provoquer des brûlures sur les ennemis qui rentrent en contact avec. Opera peut attaquer sur une assez grande distance tout en restant protégé par cette faculté de brûler, car les ennemis ne peuvent approcher sans toucher de la crème.
  Ce fruit ne semble pas présenter de faiblesses particulières, hormis les faiblesses standard des fruits du démon.                                                                        
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Buku Buku no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
  **Forces:**
  En combat, Mont d'Or l'utilise pour piéger l'ennemi dans une page dont il a le total contrôle, puis une fois son ennemi vaincu, il se ressert de l'ouvrage pour capturer et sceller son ennemi dans une prison intrinsèque au livre. Les dimensions créées sont aussi infinies que son imagination.
  **Faiblesses:**
  Les livres que crée Mont d'Or brûlent aussi facilement que du papier, permettant aux gens enfermés de sortir assez facilement. Ce Fruit connaît également les faiblesses basiques d'un Fruit du Démon                                                                        
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Bata Bata no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
  **Forces:**
  L'utilisatrice peut créer et contrôler du beurre comme elle l'entend. Le beurre créé semble être plus collant que du beurre normal, sous une forme semi-liquide semi-solide, assez résistant pour immobiliser un humain normal.
  **Faiblesses:**
  Ce fruit ne possède pas de faiblesses particulières, hormis celles communes à tous les Fruits du Démon.                                                                        
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Shibo Shibo no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
  **Forces:**
  L'utilisateur de ce Fruit peut essorer tout objet ou être vivant sous sa main, comme à la Tea Party où Smoothie propose du jus de girafe, de femme ou de roche volcanique. Le jus extrait peut d'ailleurs être bu par Smoothie elle-même ou n'importe quelle autre personne. L'utilisateur peut également essorer des parties de son propres corps, notamment pour se débarrasser d'un poison. Enfin, elle peut également augmenter sa taille de façon à devenir géante. Après avoir absorbé une grande quantité de jus, l'utilisateur peut relâcher ce jus en lames dévastatrices.
  **Faiblesses:**
  On ne connait pas de faiblesses particulières à ce Fruit du Démon autres que les faiblesse classiques à tous les Fruits du Démon.                                                                              
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Memo Memo no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  En atteignant la tête de sa cible, l'utilisateur peut extraire ses souvenirs sous la forme de bandes de film. En coupant les cadres avec des ciseaux, il peut supprimer cette partie de la mémoire de la cible, et en collant dans les cadres d'autres personnes, il peut ajouter de nouveaux souvenirs à la cible. Les cadres supprimés peuvent apparemment être gardés pendant de longues périodes, en effet, Pudding avait la mémoire d'un soldat emmagasiné. Cette altération de la mémoire peut être un outil puissant pour modifier l'esprit de la cible. L'extraction de mémoire semble être douloureuse pour la cible.
  Si une troisième personne est au courant de l'effacement de souvenirs et en parle avec la victime, la victime peut se rendre compte de la manipulation de ses souvenirs. Il faut apparemment à l'utilisateur une paire de ciseaux pour couper les souvenirs. Lorsque l'utilisateur réécrit les souvenirs de plusieurs personnes, il faut apparemment qu'elle le fasse une par une. Le fruit n'a pas d'autres faiblesses connues en dehors des faiblesses standard des Fruits du Démon.                                                                                    
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Hoya Hoya no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  En frottant son corps, l'utilisateur peut invoquer un génie (魔人, Majin) pour combattre avec lui. Le génie est très fort, même capable de dominer des pirates comme Sanji. Il utilise également une lance pour attaquer les ennemis. Il possède aussi la faculté de changer de taille. Il peut ainsi devenir aussi grand que le Thousand Sunny. L'anime le montre prenant une forme gazeuse pour éviter des attaques.
  Ce fruit possède plusieurs faiblesses. En effet, le génie ne peut s'éloigner de Daifuku que jusqu'à une distance maximale. Daifuku n'a ainsi pu utiliser son pouvoir que lorsque le navire de Smoothieait été suffisamment proche du Thousand Sunny. Ce fruit est aussi sensible aux faiblesses standards des fruits du démon.                                                                                          
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Netsu Netsu no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  L'utilisateur est capable de rendre n'importe quelle partie de son corps extrêmement chaude, jusqu'à émaner de la vapeur. Il peut également transférer sa chaleur sur des objets, notamment sur les armes des adversaires, les rendant trop chaudes pour être utilisées. En outre, les parties du corps que l'utilisateur chauffe semblent être plus résistantes contre les lames et les armes pointues, en effet, Oven a pu frapper son bras chaud contre l'épée de Pedro. Il peut également enflammer des personnes ou des objets à courte distance.
  Ce pouvoir n'a pas d'impact sur les ennemis qui possèdent une résistance à la chaleur. Le fruit n'a pas d'autres faiblesses connues en dehors des faiblesses standard d'un Fruit du Démon.                                                                                                
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Soru Soru no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
  **Forces:**
  Cela permet de vaincre aisément un ennemi en éliminant sa durée de vie. L'utilisateur peut, en créant des êtres formés de son âme, être "présent" dans plusieurs endroits à la fois. Big Mom peut extraire des morceaux d'âme d'un humain pour les injecter dans un objet ou un animal, lui donnant ainsi une partie de la conscience de l'utilisateur. Cette âme peut s'exprimer sous la forme d'espérance de vie, retirant des années de vie à la personne qui la perd.
  En injectant une partie d'âme dans un objet ou un animal, l'utilisateur peut leur donner une conscience basée sur celle de son ancien propriétaire. Ces nouveaux êtres humanoïdes sont appelés Homies. Le principal changement est l'apparition d'un visage au centre du Homie, sauf si c'est un animal. Si une Carte de vie est imprégnée de l'aura de l'utilisateur, la carte brillera et émettra une aura qui est visible des Homies et qui les forceront à obéir à la personne qui détient la carte de vie.
  L'utilisateur peut également créer des êtres humanoïdes noirs, des "Incarnations", qui peuvent absorber les âmes des gens pour récupérer notamment un droit de séjour sur Totto Land en échange de six mois de vie.
  **Faiblesses:**
  Les Homies créés par le pouvoir de ce Fruit, et ne venant pas de l'âme de Big Mom sont faibles face au pouvoir du Yomi Yomi no Mi, et peuvent s'évanouir si son utilisateur extériorise sa propre âme, comme lorsque Brook a combattu des Homies.
  Ce fruit est beaucoup moins efficace sur les personnes qui ne ressentent aucune peur à l'idée de mourir, cela a été vu sur Jinbe. Il souffre aussi des faiblesses standards aux autres Fruits du Démon.      
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Kuku Kuku no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  L'utilisateur est capable d'obtenir toutes sortes d'ingrédients simplement en transformant un objet naturel.
  Le fruit n'a pas de faiblesses connues en dehors des faiblesses standard d'un Fruit du Démon. Toutefois, la nourriture créée par l'utilisateur, bien que nourrissante, n'est pas agréable au goût.            
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Gocha Gocha no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
  **Forces:**
  L'utilisateur peut fusionner avec d'autres personnes, grandissant jusqu'à une taille de géant et augmentant ainsi leur capacité de combat. Apparemment ce fruit peut agir sur les objets également, puisque les faucilles que les décuplés utilisent habituellement est remplacée par une faucille géante lorsqu'ils fusionnent.
  **Faiblesses:**
  On ne connait pas de faiblesses particulières à ce Fruit du Démon autres que les faiblesse classiques à tous les Fruits du Démon.            
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Kobu Kobu no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  Ce fruit permet à l'utilisateur de rallier les gens pour combattre et éveiller leur potentiel de combat latent avec une seule vague de drapeau. Aucune faiblesse n'est connue pour le moment en dehors des faiblesses habituelles des Fruits du Démon.            
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Oshi Oshi no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et faiblesses:**
  **Forces:**
  Avec ce pouvoir, Morley peut se déplacer sous terre tout en poussant des mottes de terre sur les gens, avec apparemment la dureté d'origine et en écrasant les gens avec sa force. L'utilisateur peut changer la forme du sol comme il le souhaite, quelque soit la nature du sol (terre, terre molle, pierres, parties de rues...). Morley peut canaliser son pouvoir dans son trident pour l'aider à changer la forme du sol.
  Il peut également créer des tunnels dans le sol en repoussant le sol pour créer une cavité. La terre reste en place une fois sa forme changée, et a permis de créer le niveau 5.5 d'Impel Down, existant encore actuellement. C'est un atout lors de phases d'infiltration.                  
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Toki Toki no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  La principale force de ce Fruit est de permettre à l'utilisateur de transporter des personnes hors de situations périlleuses, comme lorsque Toki a envoyé Momonosuke et ses serviteurs 20 ans dans le futur pour échapper au château en flammes.
  Cependant, l'utilisateur ne peut voyager que vers le futur, il ne peut revenir dans le passé. Aucune faiblesse n'est connue pour le moment à part cela en dehors des faiblesses habituelles des Fruits du Démon.                        
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Juku Juku no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  La principale force de ce Fruit est de permettre à l'utilisatrice de faire mûrir n'importe quel objet inanimé, si besoin jusqu'à le faire pourrir. L'utilisatrice peut creuser un trou dans le sol en le touchant, ce qui fait le fait pourrir. Cela lui permet de créer un abri immédiat dans le cas d'une attaque en plongeant dans le sol.
  Aucune faiblesse n'est connue en dehors des faiblesses habituelles des Fruits du Démon. On ignore cependant si l'utilisatrice peut rentrer leur état initial aux objets qu'elle fait mûrir.                              
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Suke Suke no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses :**
  **Forces:**
  La capacité primaire du Suke Suke no Mi est de rendre l'utilisateur invisible. Cette capacité s'étend également à quoi que ce soit en contact direct avec l'utilisateur. En raison de cette capacité, l'utilisateur peut espionner des conversations sans être repéré (ainsi que le pouvoir de mater les filles) et lui permet également d'enlever les gens avec aucun risque d'être suivi. Il peut attaquer les ennemis par surprise et s'infiltrer dans des camps ennemis. Cela lui permet également de cacher des armes comme des bazookas, provoquant un effet de surprise, les munitions restant invisibles. Il peut même rendre des navires entiers invisibles afin de s'enfuir sans être repéré.
  **Faiblesses:**
  Le principal défaut de ce Fruit, c'est que la présence de l'utilisateur peut être révélée si le corps de l'utilisateur est recouvert par des substances telles que l'eau, le sel, le sang, etc... même s'il peut probablement rendre invisible cette tâche s'il se rend compte de sa présence. Toutefois, l'adversaire a encore une chance de les apercevoir. Une autre faiblesse est que si l'utilisateur s'approche de trop près d'un adversaire, il pourrait être frappé si l'adversaire frappe dans le vide et a un coup de chance. En outre, l'adversaire peut recourir à d'autres sens (ouïe, odorat, etc...) Les objets invisibles deviennent visibles instantanément, une fois qu'ils n'ont plus de contact avec l'utilisateur, si l'utilisateur n'est pas concentré dessus. Le pouvoir du Fruit s'estompe également pour un court instant si l'utilisateur est frappé puissamment (comme les coups de pied de Sanji). Cela va même jusqu'à rendre l'utilisateur visible complètement s'il est inconscient.
  A part cela, le Fruit possède les faiblesses propres à tous les Fruits du Démon.                                    
  `);
}
});

///===============================================================================================================================

bot.on('message', msg => {
if (msg.content === `.wiki Mochi Mochi no Mi`) {
  msg.channel.sendMessage(`Voici quelques informations a son sujet: **Forces et Faiblesses:**
  L'utilisateur a la possibilité de contrôler de grandes quantités de mochi ; le mochi est assez épais pour être utilisé comme une grosse arme contondante et est capable de piéger les gens, même les plus forts, en raison de son caractère collant, surtout s'il est habilité par le Haki de l'Armement. Son épaisseur et sa viscosité sont telles que les tirs de gros calibre sont complètement incapables de le percer.
  Bien que de type Paramecia, il a montré quelques effets d'une puissance réelle de Logia : l'utilisateur actuel a pu se transformer en mochi pour bloquer les balles ou se reformer après que son corps ait été endommagé par une attaque explosive, voire même coupé en deux par une attaque. Jinbe note ce fruit comme un "Paramecia spécial". Contrairement à un pouvoir de Logia, le mochi est une substance artificielle au lieu d'un élément ou d'une force de la nature.
  Comme avec tous les Fruits du Démon, celui-ci a le potentiel d'être "éveillé", ce qui permet à l'utilisateur de transformer le matériel inorganique autour de lui en mochi.
  Cependant, le mochi perd beaucoup de son caractère collant si une quantité suffisante de liquide lui est appliquée, permettant à un adversaire piégé de s'en libérer; cela a été vu pour la première fois lorsque Jinbe utilisa le Gyojin Karate pour tremper la jambe de Katakuri, libérant ainsi Luffy pris au piège. Par ailleurs, l'utilisateur est affecté par les faiblesses standard des Fruits du Démon.                                          
  `);
}
});








/// screen fdd wiki


bot.on('message', msg => {
  if (msg.content === '.wiki Moku Moku no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myg5qa`);
  }
});


bot.on('message', msg => {
  if (msg.content === '.wiki Gomu Gomu no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myg3wl`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Ushi Ushi no Mi modèle Bison') {
    msg.channel.sendMessage(`http://prntscr.com/myga9d`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Mera Mera no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mygcec`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Bara Bara no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mygf3m`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Hito Hito no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mygjw7`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Suna Suna no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myglpn`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Sube Sube no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mygo0p`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Tori Tori no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mygpd0`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Goro Goro no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mygryp`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Kilo Kilo no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myhwk4`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Mogu Mogu no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myhx3b`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Hie Hie no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myhymi`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Bomu Bomu no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myiouo`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Inu Inu no Mi modèle Chacal') {
    msg.channel.sendMessage(`http://prntscr.com/myiqoa`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Gasu Gasu no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myirl7`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Hana Hana no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myisch`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Uma Uma no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myit3n`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Numa Numa no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myiu28`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Doru Doru no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myiugx`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Neko Neko no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myrgy9`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Magu Magu no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myriln`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Baku Baku no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myrksj`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Ushi Ushi no Mi modèle Girafe') {
    msg.channel.sendMessage(`http://prntscr.com/myrlyw , http://prntscr.com/myrml5`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Pika Pika no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myrt4b`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Mane Mane no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/myrv1z`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Inu Inu no Mi modèle Loup') {
    msg.channel.sendMessage(`http://prntscr.com/myrznl`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Yami Yami no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz63hc`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Supa Supa no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz66l2`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Hebi Hebi no Mi modèle Anaconda') {
    msg.channel.sendMessage(`http://prntscr.com/mz68v9`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Yuki Yuki no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz6bgh`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Toge Toge no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz6c0p`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Hebi Hebi no Mi modèle Cobra Royal') {
    msg.channel.sendMessage(`http://prntscr.com/mz6dqe`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Toro Toro no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz6f0t`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Ori Ori no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz6g97`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Kame Kame no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz6h4g`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Pasa Pasa no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz6i1v`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Bane Bane no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz6yto`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Mushi Mushi no Mi modèle Guêpe') {
    msg.channel.sendMessage(`http://prntscr.com/mz700t`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Ame Ame no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz724q`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Ito Ito no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz73wp`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Mushi Mushi no Mi modèle Scarabée Rhinocéros') {
    msg.channel.sendMessage(`http://prntscr.com/mz763z`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Noro Noro no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz77jw`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Doa Doa no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz78mc`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Awa Awa no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz7b77`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Zo Zo no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz7crr`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Beri Beri no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz7der`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Sara Sara no Mi modèle Axolotl') {
    msg.channel.sendMessage(`http://prntscr.com/mz7ewt`);
  }
});

bot.on('message', msg => {
  if (msg.content === '.wiki Sabi Sabi no Mi') {
    msg.channel.sendMessage(`http://prntscr.com/mz7fwn`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Fruit d'Alpacacino`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7h3j`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Shari Shari no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7hvu`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Ryu Ryu no Mi modèle Allosaure`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7k3q`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Yomi Yomi no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7kyr`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Zo Zo no Mi modèle Mammouth`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7m3y`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Kage Kage no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7q7s`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Ryu Ryu no Mi modèle Spinosaure`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7tjb`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Horo Horo no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7vhw`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Ryu Ryu no Mi modèle Ptéranodon`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7w48`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Suke Suke no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7xee`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Minotaure`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7yqe`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Nikyu Nikyu no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7zk6`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Minorhinocéros`) {
    msg.channel.sendMessage(`http://prntscr.com/mz7zxz`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Ope Ope no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz81or`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Minozèbre`) {
    msg.channel.sendMessage(`http://prntscr.com/mz82i3`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Shiro Shiro no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz84m2`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Minokoala`) {
    msg.channel.sendMessage(`http://prntscr.com/mz85ba`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Wara Wara no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz86pf`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Minochihuahua`) {
    msg.channel.sendMessage(`http://prntscr.com/mz86yk`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Mero Mero no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz87sw`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Tori Tori no Mi modèle Phoenix`) {
    msg.channel.sendMessage(`http://prntscr.com/mz898j`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Doku Doku no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz8a72`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Hito Hito no Mi modèle Daibutsu`) {
    msg.channel.sendMessage(`http://prntscr.com/mz8av9`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Horu Horu no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz8bpq`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Fruit du Démon Artificiel`) {
    msg.channel.sendMessage(`http://prntscr.com/mz8cfm`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Choki Choki no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mz8cfm`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Fruit de Kaido`) {
    msg.channel.sendMessage(`http://prntscr.com/mzmyud`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Gura Gura no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mznufh`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Inu Inu no Mim modèle Kyubi no Kitsune`) {
    msg.channel.sendMessage(`http://prntscr.com/mznxgu`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Kira Kira no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mznytc`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Hebi Hebi no Mi modèle Yamata no Orochi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzo1f0`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Woshu Woshu no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzoaxf`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Inu Inu no Mi modèle Bake-danuki`) {
    msg.channel.sendMessage(`http://prntscr.com/mzobvl`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Fuwa Fuwa no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzod02`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Batto Batto no Mi modèle Vampire`) {
    msg.channel.sendMessage(`http://prntscr.com/mzoeca`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Mato Mato no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzogk9`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Fuku Fuku no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzoqur`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Buki Buki no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzoshg`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Batman`) {
    msg.channel.sendMessage(`http://prntscr.com/mzotw1`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Holdem`) {
    msg.channel.sendMessage(`http://prntscr.com/mzoues`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Bari Bari no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpfiu`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Speed`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpgnb`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Nui Nui no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzph7m`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Dobon`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpi73`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Giro Giro no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpjlq`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Ato Ato no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpkj5`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Alpagaman`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpkxj`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Jake Jake no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzplu3`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Babanuki`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpm9p`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Pamu Pamu no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpm9p`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Daifugo`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpngy`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Beta Beta no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpo7k`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Solitaire`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpp3i`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Hobi Hobi no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpq62`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Raki Raki no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpqvn`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Sui Sui no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzprot`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Ton Ton no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpsk2`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Ishi Ishi no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpttc`);
  }

});bot.on('message', msg => {
  if (msg.content === `.wiki Nagi Nagi no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpum8`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Chiyu Chiyu no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpvj1`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Soru Soru no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpw37`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Mira Mira no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpxik`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Pero Pero no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpy2w`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Bisu Bisu no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzpz2o`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Kuri Kuri no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzq0ro`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Buku Buku no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzq1fs`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Bata Bata no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzq230`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Shibo Shibo no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/mzq2rm`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Memo Memo no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n04vrj`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Hoya Hoya no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n04wt9`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Netsu Netsu no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n04xoy`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Soru Soru no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n04yx7`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Kuku Kuku no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n04zw4`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Gocha Gocha no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n0513u`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Kobu Kobu no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n053z3`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Oshi Oshi no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n055kh`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Toki Toki no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n056uv`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Juku Juku no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n05cr6`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Suke Suke no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n059j0`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wiki Mochi Mochi no Mi`) {
    msg.channel.sendMessage(`http://prntscr.com/n05ahu`);
  }
});

bot.on('message', msg => {
  if (msg.content === `.listwiki`) {
    msg.channel.sendMessage(`**Voici la liste des wiki (certaines catégories sont en cours) :**
    .wikifdd Pour toutes les informations sur les fruits du démons.
	.wikiarmes Pour toutes les informations sur les armes (épées, sabres, etc...)
	    -> Divisé en plusieurs sous catégories eux mêmes divisés en plusieurs catégories :
											-.wikiasabres
											-.wikiaarmesantiques
											-.wikiaarmesdivers											
	.wikilieux Pour en savoir + sur les lieux de notre Univers. [WIP !!!]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikilieux`) { 　
    msg.channel.sendMessage(`
	À fin de poursuivre sélectionnez un lieu en question :
	
	Pour East Blue :
	
	.wikia shellstown
	.wikia shimotsuki
	.wikia archipelorgao
	.wikia iledesanimauxrares
	.wikia baratie
	.wikia loguetown
	.wikia mirrorball
	.wikia tequilawolf
	.wikia oykot
	.wikia goa
	.wikia greyterminal
	.wikia foretdumillieu
	.wikia fuchsia
	.wikia montcorvo
	.wikia syrup
	.wikia arlongpark
	.wikia kokoyashi
	.wikia gosa
	
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikilieux`) { 　
    msg.channel.sendMessage(`
	Pour West Blue :
	.wikia illusia
	.wikia ohara
	.wikia toroa
	.wikia lascamp
	.wikia thrillerbark
	
	Pour North Blue :
	(En cours, ou rien du tout)
	
	Pour South Blue :
	.wikia bliss
	.wikia ilekarate
	.wikia saintreia
	.wikia torino
	.wikia baterilla
	
	Pour Red Line :
	.wikia reversemountain
	.wikia capdesjumeaux
	.wikia mariejoie
	.wikia iledeshommespoissons
	
	Pour Calm Belt :
	.wikia amazonlily
	.wikia impeldown
	.wikia rusukaina
	
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikilieux`) { 　
    msg.channel.sendMessage(`
	Pour le Paradis (soit la première moitié de Grand Line) :
	[WIP]
	
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikifdd`) {
    msg.channel.sendMessage(`**Voici la liste des wiki de FDD:**
    .wiki Moku Moku no Mi
    .wiki Gomu Gomu no Mi
    .wiki Ushi Ushi no Mi modèle Bison
    .wiki Mera Mera no Mi
    .wiki Bara Bara no Mi
    .wiki Hito Hito no Mi
    .wiki Suna Suna no Mi
    .wiki Sube Sube no Mi
    .wiki Tori Tori no Mi
    .wiki Goro Goro no Mi
    .wiki Kilo Kilo no Mi
    .wiki Mogu Mogu no Mi
    .wiki Hie Hie no Mi
    .wiki Bomu Bomu no Mi
    .wiki Inu Inu no Mi modèle Chacal
    .wiki Gasu Gasu no Mi
    .wiki Hana Hana no Mi
    .wiki Uma Uma no Mi
    .wiki Numa Numa no Mi
    .wiki Doru Doru no Mi
    .wiki Neko Neko no Mi
    .wiki Magu Magu no Mi
    .wiki Baku Baku no Mi
    .wiki Ushi Ushi no Mi modèle Girafe
    .wiki Pika Pika no Mi
    .wiki Mane Mane no Mi
    .wiki Inu Inu no Mi modèle Loup
    .wiki Yami Yami no Mi
    .wiki Supa Supa no Mi
    .wiki Hebi Hebi no Mi modèle Anaconda
    .wiki Yuki Yuki no Mi
    .wiki Toge Toge no Mi
    .wiki Hebi Hebi no Mi modèle Cobra Royal
    .wiki Toro Toro no Mi
    .wiki Ori Ori no Mi
    .wiki Kame Kame no Mi
    .wiki Pasa Pasa no Mi
    .wiki Bane Bane no Mi
    .wiki Mushi Mushi no Mi modèle Guêpe
    .wiki Ame Ame no Mi
    .wiki Ito Ito no Mi
    .wiki Mushi Mushi no Mi modèle Scarabée Rhinocéros
    .wiki Noro Noro no Mi
    .wiki Doa Doa no Mi
    .wiki Awa Awa no Mi
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikifdd`) { 　
    msg.channel.sendMessage(`
         .wiki Inu Inu no Mi modèle Bake-danuki
    .wiki Fuwa Fuwa no Mi
    .wiki Batto Batto no Mi modèle Vampire
    .wiki Mato Mato no Mi
    .wiki Fuku Fuku no Mi
    .wiki Buki Buki no Mi
    .wiki Batman
    .wiki Holdem
    .wiki Bari Bari no Mi
    .wiki Speed
    .wiki Nui Nui no Mi
    .wiki Dobon
    .wiki Giro Giro no Mi
    .wiki Ato Ato no Mi
    .wiki Alpagaman
    .wiki Jake Jake no Mi
    .wiki Babanuki
    .wiki Pamu Pamu no Mi
    .wiki Daifugo
    .wiki Beta Beta no Mi
    .wiki Solitaire
    .wiki Hobi Hobi no Mi
    .wiki Raki Raki no Mi
    .wiki Sui Sui no Mi
    .wiki Ton Ton no Mi
    .wiki Ishi Ishi no Mi
    .wiki Nagi Nagi no Mi
    .wiki Chiyu Chiyu no Mi
    .wiki Soru Soru no Mi
    .wiki Mira Mira no Mi
    .wiki Pero Pero no Mi
    .wiki Bisu Bisu no Mi
    .wiki Kuri Kuri no Mi
    .wiki Buku Buku no Mi
    .wiki Bata Bata no Mi
    .wiki Shibo Shibo no Mi
    .wiki Memo Memo no Mi
    .wiki Hoya Hoya no Mi
    .wiki Netsu Netsu no Mi
    .wiki Soru Soru no Mi
    .wiki Kuku Kuku no Mi
    .wiki Gocha Gocha no Mi
    .wiki Kobu Kobu no Mi
    .wiki Oshi Oshi no Mi
    .wiki Toki Toki no Mi
    .wiki Juku Juku no Mi
    .wiki Suke Suke no Mi
    .wiki Mochi Mochi no Mi
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikifdd`) { 　
    msg.channel.sendMessage(`
         .wiki Zo Zo no Mi
    .wiki Beri Beri no Mi
    .wiki Sara Sara no Mi modèle Axolotl
    .wiki Sabi Sabi no Mi
    .wiki Fruit d'Alpacacino
    .wiki Shari Shari no Mi
    .wiki Ryu Ryu no Mi modèle Allosaure
    .wiki Yomi Yomi no Mi
    .wiki Zo Zo no Mi modèle Mammouth
    .wiki Kage Kage no Mi
    .wiki Ryu Ryu no Mi modèle Spinosaure
    .wiki Horo Horo no Mi
    .wiki Ryu Ryu no Mi modèle Ptéranodon
    .wiki Suke Suke no Mi
    .wiki Minotaure
    .wiki Nikyu Nikyu no Mi
    .wiki Minorhinocéros
    .wiki Ope Ope no Mi
    .wiki Minozèbre
    .wiki Shiro Shiro no Mi
    .wiki Minokoala
    .wiki Wara Wara no Mi
    .wiki Minochihuahua
    .wiki Mero Mero no Mi
    .wiki Tori Tori no Mi modèle Phoenix
    .wiki Doku Doku no Mi
    .wiki Hito Hito no Mi modèle Daibutsu
    .wiki Horu Horu no Mi
    .wiki Fruit du Démon Artificiel
    .wiki Choki Choki no Mi
    .wiki Fruit de Kaido
    .wiki Gura Gura no Mi
    .wiki Inu Inu no Mim modèle Kyubi no Kitsune
    .wiki Kira Kira no Mi
    .wiki Hebi Hebi no Mi modèle Yamata no Orochi
    .wiki Woshu Woshu no Mi
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikiarmes`) { 　
    msg.channel.sendMessage(`
	À fin de poursuivre veuillez sélectionnez une catégorie en particulier, en fesant .wikia + la catégorie en questions :
    .wikiasabres (Tout les sabres, leurs grâdes et des informations diverses, parfait pour les sabreurs)
    .wikiaarmesantiques (Les armes antiques, à utiliser avec précaution ;) )
    .wikiaarmesdivers (Tout ce qui est hache, combinaison du Germa 66 et autres, en gros le reste.)
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikiasabres`) { 　
    msg.channel.sendMessage(`
	Vous avez sélectionnez la catégorie sabres, les Sabres (刀剣, Tōken) sont les armes les plus répandues dans le monde de One Piece. Aussi, ils sont divisés en 2 grandes sections : les Meito, sabres célèbres et de très bonne, voire excellente qualité, et les sabres non compris dans les Meito, des sabres un peu plus faibles (niveau qualité) et banaux, qui n'ont même pas de nom. Les Meito sont divisés en 3 catégories : 
	- Les 50 lames de qualité supérieure : Ryo Wazamono.
	- Les 21 grands sabres : Ô Wazamono.
	- Les 12 sabres de premier rang : Saijo Ô Wazamono.
	On reconnait les grands sabreurs à leur sabres, possédé un de ces sabres prouve que vous êtes voués à des grandes prouesses.
	(Il existe des sabres avec une forme original tel que le Kiribachi d'Arlong (cf. : .wikiaarlong)
	
	Il y a plusieurs types de sabres, très brièvement le katana, le plus répandu de tous est un type d'épée japonaise. Il est à un seul tranchant, la lame légèrement courbée qui a été utilisée par de nombreux samouraïs.
	Puis le Kogatana qui est est une très petite version d'un katana (signifiant littéralement "épée enfant" ou "petite épée"). Il ressemble plus à un petit couteau, et est généralement utilisé en renfort lorsqu'un samouraï se bat.
	Le Daïto est une catégorie de lame qui entre dans la même catégorie que les deux autres sortes de sabres... Pour être considéré comme un daito, l'épée doit avoir une lame plus longue que 2 shaku (environ 24 pouces ou 60 centimètres) dans une ligne droite.
	Et pour conclure le Nodachi qui est une grande épée maniée à deux mains. Comparé au Katana, Le nodachi est plus difficile à tenir vu son poids et sa taille. La taille du Nodachi varie entre 30-33 centimètres. Sa capacité de couper surpasse probablement celle d'un Katana, vu sa taille et son poid.
	
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikiasabres`) { 　
    msg.channel.sendMessage(`
	Voici la liste des commandes pour cette catégorie, nous avons préféré ne faire que les sabres les plus connus à fin d'éviter un surplus de ligne de codes :
	.wikia yoru
	.wikia shodaikitetsu
	.wikia wadoichimonji
	.wikia nidaikitetsu
	.wikia shuusui
	.wikia yamaoroshi
	.wikia shigure
	.wikia sandaikitetsu
	.wikia yubashiri
	.wikia kashu
	.wikia oto
	.wikia kogarashi
	.wikia durandal
	.wikia shirauo
	.wikia raiu
	.wikia kiribachi
	.wikia kikoku
	.wikia griffon
	.wikia funkfreed
	.wikia terrysword
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikiaarmesantiques`) { 　
    msg.channel.sendMessage(`
	Vous avez sélectionnez la catégorie armes antiques qui sont au nombre de trois, sont des armes capables de détruire le monde et dont le gouvernement et certains pirates cherchent à s'en emparer pour leurs propres fins. Leur nom fait référence à un dieu et à leur pouvoir (par exemple, le possesseur de Poséidon a le pouvoir de commander les Rois des Mers).
	
	Les armes antiques sont au nombre de trois : Pluton, Uranus et Poséidon. Le lieu de chaque arme est connu uniquement grâce aux Ponéglyphes, des stèles très anciennes créées pendant le blanc de 100 ans qui marque l'histoire mondiale. Ce qui indique qu'elles ont appartenu à l'origine à l'Ancien Royaume avant qu'il ne disparaisse.
	
	------
	
	Veuillez choisir une des armes antiques suivantes :
	.wikia pluton
	.wikia uranus
	.wikia poseidon
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikiaarmesdivers`) { 　
    msg.channel.sendMessage(`
	Vous avez sélectionnez la catégorie armes divers, c'est à tout dire tout ce qui n'a pas déjà était mentionné, elle est actuellement en travaux...
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia yoru`) { 　
    msg.channel.sendMessage(`
	Le Kokuto Yoru (黒刀 夜, Kokuto Yoru) est un sabre qui fait partie des Sabres les plus puissants au monde.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia shodaikitetsu`) { 　
    msg.channel.sendMessage(`
	Le Shodai Kitetsu (初代鬼徹, Shodai Kitetsu) est l'un des 12 Saijo Ô Wazamono. Il fait partie des sabres maudits créés par Kitetsu avec le Nidai Kitetsu et le Sandai Kitetsu.
	Shodai (初代) signifie littéralement "Première génération" car le Shodai Kitetsu est le premier sabre de la série des Kitetsu.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia wadoichimonji`) { 　
    msg.channel.sendMessage(`
	Le Wadô Ichimonji (和道一文字, Wadō Ichimonji) fait partie de la classe des 21 Ô Wazamono.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia nidaikitetsu`) { 　
    msg.channel.sendMessage(`
	Nidai Kitetsu (二代鬼徹, Nidai Kitetsu) est un sabre faisant partie des 21 sabres de la catégorie des Ô Wazamono. Il fait partie des sabres maudits créés par Kitetsu avec le Shodai Kitetsu et le Sandai Kitetsu.[2] Elle fut forgée par Kotetsu.
	二代 Nidai signifie "Deuxième génération" car le Nidai Kitetsu est le deuxième sabre de la série des Kitetsu.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia shodaikitetsu`) { 　
    msg.channel.sendMessage(`
	Le Shodai Kitetsu (初代鬼徹, Shodai Kitetsu) est l'un des 12 Saijo Ô Wazamono. Il fait partie des sabres maudits créés par Kitetsu avec le Nidai Kitetsu et le Sandai Kitetsu.
	Shodai (初代) signifie littéralement "Première génération" car le Shodai Kitetsu est le premier sabre de la série des Kitetsu.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia shuusui`) { 　
    msg.channel.sendMessage(`
	Shuusui, l'Eau Automnale (秋水, Shusui) est une des 21 Ô Wazamono à travers le monde. Une arme extrèmement difficile à manipuler et démoniaque...
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia shodaikitetsu`) { 　
    msg.channel.sendMessage(`
	Le Shodai Kitetsu (初代鬼徹, Shodai Kitetsu) est l'un des 12 Saijo Ô Wazamono. Il fait partie des sabres maudits créés par Kitetsu avec le Nidai Kitetsu et le Sandai Kitetsu.
	Shodai (初代) signifie littéralement "Première génération" car le Shodai Kitetsu est le premier sabre de la série des Kitetsu.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia yamaoroshi`) { 　
    msg.channel.sendMessage(`
	Yamaoroshi (山颪, Yamaoroshi) est un des 50 Ryo Wazamono.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia shodaikitetsu`) { 　
    msg.channel.sendMessage(`
	Le Shodai Kitetsu (初代鬼徹, Shodai Kitetsu) est l'un des 12 Saijo Ô Wazamono. Il fait partie des sabres maudits créés par Kitetsu avec le Nidai Kitetsu et le Sandai Kitetsu.
	Shodai (初代) signifie littéralement "Première génération" car le Shodai Kitetsu est le premier sabre de la série des Kitetsu.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia shigure`) { 　
    msg.channel.sendMessage(`
	Le Shigure (時雨, Shigure) est un katana faisant partie de la catégorie des Meito.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia sandaikitetsu`) { 　
    msg.channel.sendMessage(`
	Il fait partie des trois sabres maudits de la série des Kitetsu avec Shodai Kitetsu et Nidai Kitetsu, Sandai Kitetsu est une des 50 lames de qualités supérieures donc il appartient à la catégorie des Ryo Wazamono.
	三代 Sandai signifie "Troisième génération" car le Sandai Kitetsu est le troisième et dernier sabre de la série des Kitetsu.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia yubashiri`) { 　
    msg.channel.sendMessage(`
	Le Yubashiri (雪走, Yubashiri) est un sabre appartenant aux Ryo Wazamono, les 50 lames de qualité supérieures.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia kashu`) { 　
    msg.channel.sendMessage(`
	On ignore quelle est la puissance de ce sabre, puisqu'on ne l'a jamais vu utilisé lors d'un combat, mais il doit être assez puissant puisqu'il fait partie des 50 Ryo Wazamono.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia oto`) { 　
    msg.channel.sendMessage(`
	Oto (桜十, Ōtō) et Kogarashi (木枯し, Kōgarashi) sont deux épées utilisées en remplacement de jambes.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia kogarashi`) { 　
    msg.channel.sendMessage(`
	Oto (桜十, Ōtō) et Kogarashi (木枯し, Kōgarashi) sont deux épées utilisées en remplacement de jambes.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia durandal`) { 　
    msg.channel.sendMessage(`
	Durandal (デュランダル, Dyurandaru) est connu pour être l'un des Sabres les plus puissants du monde. Son grade est, pour le moment, encore inconnu.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia shirauo`) { 　
    msg.channel.sendMessage(`
	Shirauo est un Nodachi.À moins de mesurer 20 mètres de haut, cette épée est inutilisable.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia raiu`) { 　
    msg.channel.sendMessage(`
	Raiu (雷雨, Raiu)[2] est un Nodachi faisant partie des Meito. Son nom signifie "Orage".
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia kiribachi`) { 　
    msg.channel.sendMessage(`
	Kiribachi[1] ou Lance-Scie[1] en français, (キリバチ, Kiribachi), est une gigantesque épée.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia kikoku`) { 　
    msg.channel.sendMessage(`
	Kikoku (鬼哭, Kikoku) est le nom du sabre. C’est une lame maudite, mais elle ne fait pas partie des 83 lames de renom.
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia griffon`) { 　
    msg.channel.sendMessage(`
	Griffon est un sabre plus long que la moyenne, avec un long manche vert et une garde beige. Shanks le garde dans un étui bleu accroché à sa taille du côté droit.[
	[image]
    `);
  }
});

bot.on('message', msg => {
  if (msg.content === `.wikia funkfreed`) { 　
    msg.channel.sendMessage(`
	Funkreed (ファンクフリード, Fankufurīdo) est une épée ayant "mangé" le Zo Zo no Mi (grâce aux travaux du Docteur Vegapunk). C'est une épée éléphant.
	[image]
    `);
  }
});


bot.on('message', msg => {
  if (msg.content === `.wikia terrysword`) { 　
    msg.channel.sendMessage(`
	Terry Sword (テリーソード, Terī Sōdo) est l'épée de Dorry, c'est une épée géante confectionnée il y a au moins 100 ans.
	[image]
    `);
  }
});

const uneCommande = '.train '

bot.on('message', message => {
  if (message.content.startsWith(uneCommande)) {
    const str = message.content.substring(uneCommande.length)
    message.channel.sendMessage(str)
  }
});

bot.on('message', message => { 
  if (message.content === prefix + 'rollrichesse') {
      var over = Math.floor(Math.random() * 4)
      if ( over === 1) {
        message.reply('Tu es pauvre malheureusement mais tu as reussi a voler 200 berry pour commencer ton aventure !')
    }
    if ( over === 2) {
      message.reply('Tu commences avec 2000 berry')
    }
    if ( over === 3) {
      message.reply('Tu es riche !! et tu commences donc avec 5000 berry')
    }
  }
})


    let cpuLol;
    cpuStat.usagePercent(function(err, percent, seconds) {
        var interval = setInterval (function () {
		if (err) {
            return console.log(err);
        }
        const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const embedStats = new Discord.RichEmbed()
            
            .setTitle("**Stats du BOT**")
            .setColor("purple")
            .addField("• Memoire Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
            .addField("• ON depuis: ", `${duration}`, true)
            .addField("• Utilisateurs", `${bot.users.size.toLocaleString()}`, true)
            .addField("• Servers", `${bot.guilds.size.toLocaleString()}`, true)
            .addField("• Channels ", `${bot.channels.size.toLocaleString()}`, true)
            .addField("• Discord.js", `v${version}`, true)
            .addField("• Node", `${process.version}`, true)
            .addField("• CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
            .addField("• CPU usage", `\`${percent.toFixed(2)}%\``, true)
            .addField("• Arch", `\`${os.arch()}\``, true)
            .addField("• Platform", `\`\`${os.platform()}\`\``, true)
            .setThumbnail(bot.user.displayAvatarUrl)
        bot.channels.get("703914425039454290").send(embedStats);
    }, 180 * 1000); 
	});


bot.login(process.env.BOT_TOKEN);
