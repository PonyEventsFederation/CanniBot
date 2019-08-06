const https = require('https');

const Discord = require('discord.js');
const client = new Discord.Client();
const talkedRecently = new Set();
const channelMessaged = new Set();
const userBlocked = new Set();
const bizaamType = 'bizaam';
const bestPonyType = 'best-pony';
const assfartType = 'assfart';
const fantaType = 'cocacola';
const interjectType = 'interject';
const canniBestPonyType = 'canni-best-pony';
const bizaamBestPonyType = 'bizaam-best-pony';
const assFartBestPonyType = 'assfart-best-pony';
const canniworstPonyType = 'canny-worst-pony';
const galaconDate = Date.parse('01 aug 2020 09:00:00 GMT+2');

const auth = require('./auth.json');

var channelUploadID = GetChannelUploadID();

var messaged = false;
var bizaamEmoji = null;
var hugEmoji = null;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(() => {
        let now = Date.now();
        let diff =  galaconDate - now;
        var seconds = parseInt(diff) / 1000;
        let days = Math.floor(seconds / (3600 * 24));
        seconds -= days*3600*24;
        let hrs = Math.floor(seconds / 3600);
        seconds -= hrs * 3600;
        let minutes = Math.floor(seconds / 60);
        if(minutes < 10) { // Lazyness is real
            client.user.setActivity(`Time to Galacon: ${days} days, ${hrs}:0${minutes} left! Hype!`, { type: 'PLAYING' });
        }
        else {
            client.user.setActivity(`Time to Galacon: ${days} days, ${hrs}:${minutes} left! Hype!`, { type: 'PLAYING' });
        }
    }, 10000); // Every 10s?
});

client.on('message', msg => {

    if (msg.author.bot) {
        return;
    }

    if (userBlocked.has(msg.author.id)) {
        return;
    }

    if (msg_starts(msg,'boop')) {
        if(msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length > 0) {
            let users = msg.mentions.users.array();
            for(let i = 0; i < users.length; i++)
            {
                msg.channel.send(msg.author + " ( ͡° ͜ʖ (\\  *BOOPS* " + '<@' + users[i].id + ">");
            }
            msg.delete(0);//make sure the bot gets manage text permissions , otherwise it will fail silently-Merte
        }
    }

    if (msg_contains(msg, "fanta ")) {//Fanta jokes! -merte
        if (controlTalkedRecently(msg, fantaType)) {
            let rndm = randomIntFromInterval(1, 8);
            switch (rndm) {
                case 1:
                    msg.channel.send(`There's no wrong way to Fanta size`);
                break;
                case 2:
                    msg.channel.send(`Is this real life, is this just Fanta sea?`);
                break;
                case 3:
                    msg.channel.send(`I had a dream I was drowning in an ocean of orange soda\nThank god it was only a Fanta sea`);
                break;
                case 4:
                    msg.channel.send(`When I drink alcohol people call me an alcoholic but when I drink Fanta...\nNobody calls me or texts me guys I'm lonely`);
                break;
                case 5:
                    msg.channel.send(`Soaking a twig in coke is nice, but soaking a twig in fanta...\nFanta stick.`);
                break;
                case 6:
                    msg.channel.send(`Whats so funny about fanta`);
                break;
                case 7:
                    msg.channel.send(`fanta is Cannibot fuel`);
                break;
                case 8:
                    msg.channel.send(`Perry doesn't like Fanta jokes...`);
                break;
                
            }
        }
    }
    //i noticed there was a lot of interest in becomming a memer, sooo i thought lets automate!-Merte
    //the bot will need to have the rights to give/take meme rolls
    if (msg_contains(msg, 'i want to be a meme master')) {
        try {
            if (!msg.mentions.everyone && msg.isMentioned(client.user)) {
                let memeroll = msg.guild.roles.find(role => role.name === "Meme");
                if (msg.member.roles.some(r => ["Meme"].includes(r.name))) {
                    msg.channel.send(`${msg.author} You're already well on the way to become a Meme Master`);
                }
                else {
                    msg.channel.send(`${msg.author}
                so you want to be a Meme Master huh?
                You better know there are hidden dangers waiting for you there
                And there is not much i can do to help you...
                Neither can the rest of the support crew
                ARRRG there be pirates ahead!
                If you really want to be a Meme Master, mention me with "i REALLY want to be a Meme Master
                and i will try to find a way to let you in!
                this message will selfdestruct in 10 seconds`).then(message => message.delete(15000));
                    msg.delete(10);
                }
            }
        }catch (e) {
            msg.channel.send(`${msg.author} Sorry, something went wrong with my circuits`)
        }
    }
    if (msg_contains(msg, 'i really want to be a meme master')) {// create stuff to automaticly become a memer
        try {
            if (!msg.mentions.everyone && msg.isMentioned(client.user)) {
                let memeroll = msg.guild.roles.find(role => role.name === "Meme");
                if (msg.member.roles.some(r => ["Meme"].includes(r.name))) {
                    msg.channel.send(`${msg.author} You're already well on the way to become a Meme Master`);
                }
                else {
                    msg.channel.send(`${msg.author} You have sealed your destiny!
                I will use my special powers to open the gateway between here and the memes.
                Behold the horrors, greater then what lives in the Everfree forest...
                BEHOLD! Bronies in the wild!!!
                ${getBizaamEmoji()} BIIZAAAAAMM!!!
                This message will selfdestruct in 10 seconds`).then(message => message.delete(15000));
                    msg.member.addRole(memeroll).catch(console.error);
                    msg.delete(10);
                }
            }
        }catch (e) {
            msg.channel.send(`${msg.author} Sorry, something went wrong with my circuits`)
        }
    }


    if (msg_contains(msg, "bizaam") && (!msg_contains(msg, 'is best pony'))) {
        if (controlTalkedRecently(msg, bizaamType)) {
            msg.channel.send(`${getBizaamEmoji()} BIIZAAAAAMM!!!`).then(sentEmbed => {
                sentEmbed.react(getBizaamEmoji())
            });

            msg.react(getBizaamEmoji());
        }
    }

    if (msg_contains(msg, "assfart") && !msg_contains(msg, 'assfart is best pony')) {
        if (controlTalkedRecently(msg, assfartType)) {
            msg.channel.send(`Shut up ${msg.author}, its Ausfahrt!`);
        }
    }

    if (msg_starts(msg,"!when")) {
        msg.channel.send(`${getBizaamEmoji()} Next Galacon is from august 1st to august 2nd 2020! Hype!!!`)
        let now = Date.now();
        let diff =  galaconDate - now;
        var seconds = parseInt(diff) / 1000;
        let days = Math.floor(seconds / (3600 * 24));
        seconds -= days*3600*24;
        let hrs = Math.floor(seconds / 3600);
        seconds -= hrs * 3600;
        let minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        msg.channel.send(`${days} days, ${hrs} hours, ${minutes} minutes and ${Math.floor(seconds)} seconds left! IT TAKES FOREVERHHH`);
    }

    if (msg_contains(msg, ' is best pony')) {
        if (msg_contains(msg, 'who is best pony')) {
            if (controlTalkedRecently(msg, bestPonyType)) {
                msg.channel.send(msg.author + ` ${getBizaamEmoji()} I am, of course!`);
            }
        } else if (msg_contains(msg, 'canni is best pony') || msg_contains(msg, 'canni soda is best pony')) {
            if (controlTalkedRecently(msg, canniBestPonyType)) {
                msg.channel.send(msg.author + ` I sure am!`);
            }
        } else if (msg_contains(msg, 'bizaam is best pony') || msg_contains(msg, `${getBizaamEmoji()} is best pony`)) {
            if (controlTalkedRecently(msg, bizaamBestPonyType, false)) { // Don't send CD message here. It's not required.
                msg.channel.send(msg.author + ` A bizaam isn't a pony, silly...`);
            }
        } else if (msg_contains(msg, 'assfart is best pony')) {
            if (controlTalkedRecently(msg, assFartBestPonyType, false)) { // Don't send CD message here. It's not required.
                msg.channel.send(msg.author + ` Rude!`);
            }
        }else {
            if (controlTalkedRecently(msg, interjectType, false)) { // Don't set a CD message here. It'll feel more natural if Canni doesn't respond every time in case people spam the command.
                msg.channel.send(msg.author + ` Nu-uh. I am best pony!`);
            }
        }
    }

    if (msg_contains(msg, ' is worst pony')) {
        if (msg_contains(msg, 'canni is worst pony') || msg_contains(msg, 'canni soda is worst pony')) {
            if (controlTalkedRecently(msg, canniworstPonyType)) {
                msg.channel.send(msg.author + ` Why are you so mean to me?`);
            }
        }
    }

    if (msg_starts(msg,"hug")) {
        if (msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length > 0) {
            let user = msg.mentions.users.array()[0];
            msg.channel.send(`Hey <@${user.id}>! ${msg.author} hugged you ${getHugEmoji()}`)
        }
    }
});

function sendCooldownMessage(msg, type) {
    if (type == canniworstPonyType) {
        var cooldownMessage = `${msg.author} Fine, I'm not talking to you anymore for a while.`;
        blockUser(msg, 300000);
    } else {
        var cooldownMessage = `Hello ${msg.author}! My creator added a 1 minute cooldown to prevent my circuits from overheating. \nPlease let me rest for a moment!`;
    }

    if (channelMessaged.has(msg.channel.id + type)) {
        // Do nothing. We don't want to spam everyone all the time.
    } else {
        msg.channel.send(cooldownMessage)

        messaged = true;
        channelMessaged.add(msg.channel.id + type);
        setTimeout(() => {
            channelMessaged.delete(msg.channel.id + type);
        }, 60000);
    }
}

// "controlTalkedRecently" simplifies the antispam check. Sends the cooldown message as default. Retruns true when message can be send.
function controlTalkedRecently(msg, type, cooldownmessage = true, cooldowntime = 60000) {
    if (talkedRecently.has(msg.channel.id + type)) {
        if (cooldownmessage) {
            sendCooldownMessage(msg, type);
        }
        return false;
    } else {
        talkedRecently.add(msg.channel.id + type);
                setTimeout(() => {
                  talkedRecently.delete(msg.channel.id + type);
                }, cooldowntime);
        return true;
    }
}

// Temporarily block a user after they've been mean to Canni.
function blockUser(msg, timeout) {
    userBlocked.add(msg.author.id);
    setTimeout(() => {
        userBlocked.delete(msg.author.id);
    }, timeout);
}

function getBizaamEmoji() {
    if (bizaamEmoji === null) {
        bizaamEmoji = client.emojis.find(emoji => emoji.name === "bizaam");
        if (bizaamEmoji === null) {// added little code for when the bot is running ouside of galacon server
            bizaamEmoji = "😃";
        }
    }
    return bizaamEmoji;
}

function getHugEmoji() {
    if(hugEmoji === null) {
        hugEmoji = client.emojis.find(emoji => emoji.name === "hug");
        if(hugEmoji === null) {// added little code for when the bot is running ouside of galacon server
                hugEmoji = "🤗";
        }
    }
    return hugEmoji;
}

function GetChannelUploadID(channelName = "CanniSoda")
{
    let data = undefined;
    let properties = new Object();
    properties.defaultPort = 443;
    properties.host = "www.googleapis.com";
    properties.method = "GET";
    properties.path = `/youtube/v3/channels?part=contentDetails&forUsername=${channelName}&key=${auth.youtube}`;
    properties.protocol = "https:"
    https.get(properties, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {rawData += chunk;});
        res.on('end', () => {
            let videoData = JSON.parse(rawData);
            if(res.statusCode !== 200) {
                //console.log(`Received error ${res.statusCode}, reason \"${data.error.errors[0].reason}\" and message \"${data.error.errors[0].message}\"`);
            }
            else {
                channelUploadID = videoData.items[0].contentDetails.relatedPlaylists.uploads;
            }
        });
    });
}

/*function getVideoList()
{
    if(channelUploadID === null)
        return {};
    https.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${channelUploadID}&key=${auth.youtube}', (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {rawData += chunk;});
        res.on('end', () => {
            let data = JSON.parse(rawData);
            if(res.statusCode !== 200) {
                console.log(`Received error ${res.statusCode} with message \"${data.error.message}\"`);
                return {};
            }
            return data;
        });
    });
    return {};
}*/


// "msg_contains(msg, text)" is a shorter version of "msg.content.toLowerCase().includes(text)"
function msg_contains(msg, text) {
    if(msg.content.toLowerCase().includes(text)) {
        return true;
    } else {
        return false;
    }
}

// "msg_starts(msg, text)" is a shorter version of "msg.content.toLowerCase().startsWith(text)"
function msg_starts(msg, text) {
    if(msg.content.toLowerCase().startsWith(text)) {
        return true;
    } else {
        return false;
    }
}
function randomIntFromInterval(min, max) { //random number generator with min-max -merte
  return Math.floor(Math.random() * (max - min + 1) + min);
}

client.login(auth.token);