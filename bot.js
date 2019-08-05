//const request = require('request');

const Discord = require('discord.js');
const client = new Discord.Client();
const talkedRecently = new Set();
const channelMessaged = new Set();
const bizaamType = 'bizaam';
const bestPonyType = 'best-pony';
const assfartType = 'assfart';
const interjectType = 'interject';
const canniBestPonyType = 'canni-best-pony';
const galaconDate = Date.parse('01 aug 2020 09:00:00 GMT+2');

//const channelUploadID = GetChannelUploadID();

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
    if (msg_starts(msg,'boop')) {
        if(msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length > 0) {
            let users = msg.mentions.users.array();
            for(let i = 0; i < users.length; i++)
            {
                msg.channel.send("( ͡° ͜ʖ (\\  *BOOPS* " + '<@' + users[i].id + ">");
            }
        }
        msg.delete(0);//make sure the bot gets manage text permissions , otherwise it will fail silently
    }
    //i noticed there was a lot of interest in becomming a memer, sooo i thought lets automate!
    //the bot will need to have the rights to give/take meme rolls
    if (msg_contains(msg, 'i want to be a meme master')) {
        if (!msg.mentions.everyone && msg.isMentioned(client.user)) {
            let memeroll = msg.guild.roles.find(role => role.name === "Meme");
            if(msg.member.roles.some(r=>["Meme"].includes(r.name))) {
                msg.channel.send(`${msg.author} your already well on your way to become a Meme Master`);
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
    }
    if (msg_contains(msg, 'i really want to be a meme master')) {// create stuff to automaticly become a memer
        if (!msg.mentions.everyone && msg.isMentioned(client.user)) {
            let memeroll = msg.guild.roles.find(role => role.name === "Meme");
            if(msg.member.roles.some(r=>["Meme"].includes(r.name))) {
                msg.channel.send(`${msg.author} your already well on your way to become a Meme Master`);
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
    }
    //end of meme master control software


    // "msg_contains(msg, text)" is a shorter version of "msg.content.toLowerCase().includes(text)"
    if (msg_contains(msg, "bizaam")) {
        if (talkedRecently.has(msg.channel.id + bizaamType)) {
            sendCooldownMessage(msg, bizaamType);
        } else {
            msg.channel.send(`${getBizaamEmoji()} BIIZAAAAAMM!!!`).then(sentEmbed => {
                sentEmbed.react(getBizaamEmoji())
            });

            msg.react(getBizaamEmoji());
            talkedRecently.add(msg.channel.id + bizaamType);
            setTimeout(() => {
              talkedRecently.delete(msg.channel.id + bizaamType);
            }, 60000);
        }
    }
  
    if(msg.content.toLowerCase().includes("assfart"))
    {
        if (talkedRecently.has(msg.channel.id + assfartType)) {
            sendCooldownMessage(msg, assfartType);
        } else {
            msg.channel.send(`Shut up ${msg.author}, its Ausfahrt!`);
            setTimeout(() => {
              talkedRecently.delete(msg.channel.id + assfartType);
            }, 60000);
        }
    }    
    
    // "msg_starts(msg, text)" is a shorter version of "msg.content.toLowerCase().startsWith(text)"
    if(msg_starts(msg,"!when")){
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
            if (talkedRecently.has(msg.channel.id + bestPonyType)) {
                sendCooldownMessage(msg, bestPonyType);
            } else {
                msg.channel.send(msg.author + ` ${getBizaamEmoji()} I am, of course!`);
    
                talkedRecently.add(msg.channel.id + bestPonyType);
                setTimeout(() => {
                  talkedRecently.delete(msg.channel.id + bestPonyType);
                }, 60000);
            }
        } else if (msg_contains(msg, 'canni is best pony')) {
            if (talkedRecently.has(msg.channel.id + canniBestPonyType)) {
                sendCooldownMessage(msg, canniBestPonyType);
            } else {
                msg.channel.send(msg.author + ` I sure am!`);
    
                talkedRecently.add(msg.channel.id + canniBestPonyType);
                setTimeout(() => {
                  talkedRecently.delete(msg.channel.id + canniBestPonyType);
                }, 60000);
            }
        } else {
            if (talkedRecently.has(msg.channel.id + interjectType)) {
                // Don't set a CD message here. It'll feel more natural if Canni doesn't respond every time in case people spam the command.
            } else {
                msg.channel.send(msg.author + ` Nu-uh. I am best pony!`);
    
                talkedRecently.add(msg.channel.id + interjectType);
                setTimeout(() => {
                  talkedRecently.delete(msg.channel.id + interjectType);
                }, 60000);
            }
        }
    }

    if(msg_starts(msg,"hug")){
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
    if (bizaamEmoji === null) {
        bizaamEmoji = client.emojis.find(emoji => emoji.name === "bizaam");
        if (bizaamEmoji === null) {// added little code for when the bot is running ouside of galacon server
            bizaamEmoji = "😃";
        }
    }
    return bizaamEmoji;
}

function getHugEmoji()
{
    if(hugEmoji === null) {
        hugEmoji = client.emojis.find(emoji => emoji.name === "hug");
        if(hugEmoji === null) {// added little code for when the bot is running ouside of galacon server
                hugEmoji = "🤗";
        }
    }
    return hugEmoji;
}
/*
function GetChannelUploadID(channelName = "CanniSoda")
{
    request('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${channelName}&key=${auth.youtube}', function (error, response, body) {
        if(response.statusCode !== 200) {
            console.log("Received error ${response.statusCode} with message \"${body.error.message}\"");
            return null;
        }
    });
    console.log("Received id ${body.items[0].contentDetails.relatedPlaylists.uploads}");
    return body.items[0].contentDetails.relatedPlaylists.uploads;
}

function getVideoList()
{
    if(channelUploadID === null)
        return {};
    request('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${channelUploadID}&key=${auth.youtube}', function (error, response, body) {
        if(response.statusCode !== 200) {
            console.log("Received error ${response.statusCode} with message \"${body.error.message}\"");
            return {};
        }
        let videoData = JSON.parse(body);
        return videoData;
    });
}
*/

// "msg_contains(msg, text)" is a shorter version of "msg.content.toLowerCase().includes(text)"
function msg_contains(msg, text)
{
    if(msg.content.toLowerCase().includes(text)) {
        return true;
    } else {
        return false;
    }
}

// "msg_starts(msg, text)" is a shorter version of "msg.content.toLowerCase().startsWith(text)"
function msg_starts(msg, text)
{
    if(msg.content.toLowerCase().startsWith(text)) {
        return true;
    } else {
        return false;
    }
}


client.login(auth.token);
