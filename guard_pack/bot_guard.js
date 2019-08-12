const fs = require('fs');
const auth = require('./auth.json');
const data = require('./data.json');
const bot_data = require('./bot_ids.json');

const Discord = require('discord.js');
const client = new Discord.Client();

var canni_id = bot_data["canni_id"];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    if (msg.author.bot) {
        if (msg.isMemberMentioned(client.user) && msg.author.id === canni_id) {
            if (msg.author.id === canni_id) {
                if (msg_contains(msg,"boops")){
                    setTimeout(() => {
                        msg.channel.send(dparse("ans_boop_guard",[msg.author]));
                    }, 2000);
                }
            }
        }
    }
});

function msg_contains(msg, text) {
    return msg.content.toLowerCase().includes(text);
}

function dparse(str) {
    var raw = data[str];
    var args = [].slice.call(arguments, 1), i = 0;
    try {
        return raw.replace(/%s/g, () => args[0][i++])
    }
    catch (error) {
        return raw.replace(/%s/g, () => args[i++])
    }
}

client.login(auth.guard_token);