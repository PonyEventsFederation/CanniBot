const Discord = require('discord.js');
const client = new Discord.Client();
const talkedRecently = new Set();
const auth = require('auth');

const galaconDate = Date.parse('01 aug 2020 09:00:00 GMT+2');

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
        client.user.setActivity(`Time to Galacon, hype! ${days} days, ${hrs}:${minutes} left!`, { type: 'LISTENING' });
    }, 10000); // Every 10s?
});

client.on('message', msg => {
    const bizaamEmoji = client.emojis.find(emoji => emoji.name === "bizaam");

    if(msg.author.bot)
        return;
    if (msg.content.startsWith('boop')) {
        if(msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length > 0) {
            let users = msg.mentions.users.array();
            for(let i = 0; i < users.length; i++)
            {
                msg.channel.send("( ͡° ͜ʖ (\\  *BOOPS* " + '<@' + users[i].id + ">");
            }

            console.log("Got here!")
        }
    }

    if(msg.content.toLowerCase().includes("bizaam"))
    {
        if (talkedRecently.has(msg.author.id)) {
            //msg.channel.send("Wait 1 minute before getting typing this again. - " + msg.author);
        } else {
            msg.channel.send(`${bizaamEmoji} BIIZAAAAAMM!!!`);
            msg.react(`${bizaamEmoji}`);
            talkedRecently.add(msg.author.id);
            setTimeout(() => {
              talkedRecently.delete(msg.author.id);
            }, 60000);
        }
    }

    if(msg.content.startsWith("!when")){
        msg.channel.send(`${bizaamEmoji} Next Galacon is from august 1st to august 2nd 2020! Hype!!!`)
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
    //console.log(msg);
});

client.login(auth.token);