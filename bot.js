const Discord = require('discord.js');
const client = new Discord.Client();
const talkedRecently = new Set();
const channelMessaged = new Set();
const bizaamType = 'bizaam';
const bestPonyType = 'best-pony';
const interjectType = 'interject';
const galaconDate = Date.parse('01 aug 2020 09:00:00 GMT+2');

const auth = require('./auth.json');

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

    if(msg.author.bot)
        return;
    if (msg.content.toLowerCase().startsWith('boop')) {
        if(msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length > 0) {
            let users = msg.mentions.users.array();
            for(let i = 0; i < users.length; i++)
            {
                msg.channel.send("( ͡° ͜ʖ (\\  *BOOPS* " + '<@' + users[i].id + ">");
            }
        }
    }

    if(msg.content.toLowerCase().includes("bizaam"))
    {
        if (talkedRecently.has(msg.channel.id + bizaamType)) {
            sendCooldownMessage(msg, bizaamType);
        } else {
            msg.channel.send(`${getBizaamEmoji()} BIIZAAAAAMM!!!`);
            msg.react(getBizaamEmoji());
            talkedRecently.add(msg.channel.id + bizaamType);
            setTimeout(() => {
              talkedRecently.delete(msg.channel.id + bizaamType);
            }, 60000);
        }
    }

    if(msg.content.startsWith("!when")){
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

    if (msg.content.toLowerCase().includes(' is best pony')) {
        if (msg.content.toLowerCase().includes('who is best pony')){
            if (talkedRecently.has(msg.channel.id + bestPonyType)) {
                sendCooldownMessage(msg, bestPonyType);
            } else {
                msg.channel.send(msg.author + ` ${getBizaamEmoji()} I am, of course!`);

                talkedRecently.add(msg.channel.id + bestPonyType);
                setTimeout(() => {
                  talkedRecently.delete(msg.channel.id + bestPonyType);
                }, 60000);
            }
        } else if (msg.content.toLowerCase().includes('canni is best pony')) {
              if (talkedRecently.has(msg.channel.id + bestPonyType)) {
                sendCooldownMessage(msg, bestPonyType);
            } else {
                msg.channel.send(msg.author + ` ${getBizaamEmoji()} Of course I am!`);

                talkedRecently.add(msg.channel.id + bestPonyType);
                setTimeout(() => {
                  talkedRecently.delete(msg.channel.id + bestPonyType);
                }, 60000);
            }
        } else {
            if (talkedRecently.has(msg.channel.id + interjectType)) {
                sendCooldownMessage(msg, interjectType);
            } else {
                msg.channel.send(msg.author + ` Nu-uh. I am best pony!`);

                talkedRecently.add(msg.channel.id + interjectType);
                setTimeout(() => {
                  talkedRecently.delete(msg.channel.id + interjectType);
                }, 60000);
            }
        }
    }

    if(msg.content.toLowerCase().startsWith("hug")){
        if(msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length > 0) {
            let user = msg.mentions.users.array()[0];
            msg.channel.send(`Hey <@${user.id}>! ${msg.author} hugged you ${getHugEmoji()}`)
        }
    }
});

function sendCooldownMessage(msg, type) {
    if (channelMessaged.has(msg.channel.id + type)) {
        // Do nothing. We don't want to spam everyone all the time.
    } else {
        msg.channel.send(`Hello ${msg.author}! My creator added a 1 minute cooldown to prevent my circuits from overheating. \nPlease let me rest for a moment!`)

        messaged = true;
        channelMessaged.add(msg.channel.id + type);
        setTimeout(() => {
            channelMessaged.delete(msg.channel.id + type);
        }, 60000);
    }
}

function getBizaamEmoji() {
    if (bizaamEmoji === null)
        bizaamEmoji = client.emojis.find(emoji => emoji.name === "bizaam");
    return bizaamEmoji;
}

function getHugEmoji()
{
    if(hugEmoji === null)
        hugEmoji = client.emojis.find(emoji => emoji.name === "hug");
    return hugEmoji;
}

function msg_contains(msg, text)
{
    if(msg.content.toLowerCase().includes(text)) {
        return True;
    } else {
        return False;
    }
}

client.login(auth.token);
