const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('auth');


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
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
        const bizaamEmoji = client.emojis.find(emoji => emoji.name === "bizaam");
        msg.channel.send(`${bizaamEmoji} BIIZAAAAAMM!!!`);
    }

    if(msg.content.startsWith("!when")){
        const bizaamEmoji = client.emojis.find(emoji => emoji.name === "bizaam");
        msg.channel.send(`${bizaamEmoji} Next Galacon is from august 1st to august 2nd 2020! Hype!!!`)
        let now = Date.now();
        let galacon = Date.parse('01 aug 2020 09:00:00 GMT+2');
        let diff =  galacon - now;
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