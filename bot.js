const rp = require('request-promise');
const fs = require('fs');
const auth = require('./auth.json');
const data = require('./data.json');
const bot_data = require('./bot_ids.json');

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
const fantaBestPonyType = 'fanta-best-pony';
const canniworstPonyType = 'canny-worst-pony';
const loveCanniType = 'love-canni';
const boopguard = 'boop-guard';
const galaconDate = Date.parse('01 aug 2020 09:00:00 GMT+2');

var channelUploadID = undefined;
var channelUploadList = undefined;
var bizaamEmoji = null;
var hugEmoji = null;
var loveEmoji = null;
var errorEmoji = null;
var shyEmoji = null;
var ids = require('./ids.json');
var dev_ids = ids[0];
var dev_master_ids = ids[1];
var guard_id = bot_data["guard_id"];
var write_to_file = false;

// Try setting the write_to_file variable from the config.json file
// If it is not present, or something else is wrong with it, we'll stick to the default value (false)
try {
    const config = require('./config.json');
    write_to_file = config.write_to_file;
} catch (ex) {
    console.log('Unable to read config. Write to file set to false');
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(() => {
        let now = Date.now();
        let diff = galaconDate - now;
        var seconds = parseInt(diff) / 1000;
        let days = Math.floor(seconds / (3600 * 24));
        seconds -= days * 3600 * 24;
        let hrs = Math.floor(seconds / 3600);
        seconds -= hrs * 3600;
        let minutes = Math.floor(seconds / 60);
        if (minutes < 10) { // Lazyness is real
            client.user.setActivity(`Time to Galacon: ${days} days, ${hrs}:0${minutes} left! Hype!`, { type: 'PLAYING' });
        }
        else {
            client.user.setActivity(`Time to Galacon: ${days} days, ${hrs}:${minutes} left! Hype!`, { type: 'PLAYING' });
        }
    }, 10000); // Every 10s?
    setInterval(() => {
        updateChannel();
    }, 3600000);
});

client.on('message', msg => {
    var messageSent = false;

    if (msg.author.bot) {
        if (msg.isMemberMentioned(client.user)) {
            if (msg.author.id === guard_id){
                if (msg_contains(msg,"hey, don´t boop me.")) {
                    setTimeout(() => {
                        msg.channel.send(dparse("ans_boop_guard_response", [msg.author]));
                    }, 2000);
                }
                messageSent = true;
                return;
            }
        }
        return;
    }

    if (msg.isMemberMentioned(client.user)) {
        if (msg_contains(msg, 'i\'m sorry') || msg_contains(msg, 'i am sorry')) {
            if (userBlocked.has(msg.author.id)) {
                msg.channel.send(dparse("ans_forgive", [msg.author, getLoveEmoji()]));
                if (talkedRecently.has(msg.author.id)) {
                    talkedRecently.delete(msg.author.id);
                }
                if (channelMessaged.has(msg.author.id)) {
                    channelMessaged.delete(msg.author.id);
                }
                unblockUser(msg);
                messageSent = true;
            }
            return;
        }

        // Nothing past this check should be executed when Canni is cross with someone.
        if (userBlocked.has(msg.author.id)) {
            return;
        }

        if (msg_contains(msg, "debug author id")){
            msg.channel.send(dparse("ans_debug_author_id", [msg.author.id])).then(message => {message.delete(8000); msg.delete(8000);});
            return;
        }

        if (msg_contains(msg, 'i love you')) {
            if (controlTalkedRecently(msg, loveCanniType)) {
                msg.channel.send(dparse("ans_love", [msg.author, getLoveEmoji()]));
                messageSent = true;
            }
            return;
        }

        if (msg_contains(msg, 'when is galacon')) {
            nextGalacon(msg);
            return;
        }

        var user;
        if (auth_dev_master(msg)) {
            if (msg_contains(msg, "add dev")) {
                if (msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length === 2) {
                    user = msg.mentions.users.array().find(x => x.id !== client.user.id);
                    id_add(user.id);
                    msg.channel.send(dparse("ans_add_dev", [user]));
                    messageSent = true;
                }
            }

            if (msg_contains(msg, "remove dev")) {
                if (msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length === 2) {
                    user = msg.mentions.users.array().find(x => x.id !== client.user.id);
                    id_remove(user.id);
                    msg.channel.send(dparse("ans_remove_dev", [user]));
                    messageSent = true;
                }
            }
        }

        if (auth_dev(msg) || auth_dev_master(msg)) {
            var users = "";
            if (msg_contains(msg,"status report")) {
                msg.channel.send(dparse("ans_status_report", [msg.guild.memberCount]));
                messageSent = true;
            }

            if (msg_contains(msg,"list devs")){
                dev_ids.forEach(item => users += msg.guild.members.find(m => m.id === item) +"\n");
                msg.channel.send(dparse("ans_list_dev", [users]));
                messageSent = true;
            }

            if (msg_contains(msg,"list master devs")) {
                dev_master_ids.forEach(item => users += msg.guild.members.find(m => m.id === item) +"\n");
                msg.channel.send(dparse("ans_list_master_devs", [users]));
                messageSent = true;
            }

            if (msg_contains(msg, "member id")) {
                msg.delete();
                if (msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length === 2) {
                    user = msg.mentions.users.array().find(x => x.id !== client.user.id);
                    msg.channel.send(dparse("ans_member_id", [user.username,user.id])).then(message => {message.delete(8000);});
                    messageSent = true;
                }
            }
            if (msg_contains(msg, "channel id")) {
                msg.delete();
                msg.channel.send(dparse("ans_channel_id", [msg.channel.id])).then(message => {message.delete(8000)});
                messageSent = true;
            }
        }
    }

    if (userBlocked.has(msg.author.id)) {
        return;
    }

    if (msg_starts(msg, 'boop')) {
        if (msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length > 0) {
            let users = msg.mentions.users.array();
            if (users[0].id === guard_id) {
                if (controlTalkedRecently(msg, boopguard, false,300000)) {
                    msg.channel.send(dparse("ans_boop", [users[0]]));
                } else {
                    msg.channel.send(dparse("ans_boop_guard_cooldown"))
                }
                messageSent = true;
            } else {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].id == client.user.id) {
                        msg.channel.send(dparse("ans_self_boop", [msg.author, getShyEmoji()]));
                        continue;
                    }

                    msg.channel.send(dparse("ans_boop", [users[i]]));
                    messageSent = true;
                }
            }
        }

        return;
    }

    if (msg_starts(msg, "hug")) {
        if (msg.mentions !== null && !msg.mentions.everyone && msg.mentions.users.array().length > 0) {
            let user = msg.mentions.users.array()[0];
            if (!userBlocked.has(user.id)) {
                if (user.id == client.user.id) {
                    msg.channel.send(dparse("ans_self_hug", [msg.author, getHugEmoji()]));
                    return;
                }

                msg.channel.send(dparse("ans_hug", [user.id, msg.author, getHugEmoji()]));
                messageSent = true;
            }
        }

        return;
    }

    // Random Fanta jokes.
    if (msg_contains_word(msg, "fanta") && (!msg_contains(msg, 'is best pony'))) {
        if (controlTalkedRecently(msg, fantaType)) {
            let rndm = randomIntFromInterval(0, data["ans_fanta_list"].length - 1);
            msg.channel.send(parse(data["ans_fanta_list"][rndm]));
            messageSent = true;
        }

        return;
    }

    if (msg_contains(msg, "bizaam") && (!msg_contains(msg, 'is best pony'))) {
        if (controlTalkedRecently(msg, bizaamType)) {
            msg.channel.send(dparse("ans_bizaam", [getBizaamEmoji()])).then(sentEmbed => {
                sentEmbed.react(getBizaamEmoji())
            });
            messageSent = true;
        }

        return;
    }

    if (msg_contains(msg, "assfart") && !msg_contains(msg, 'assfart is best pony')) {
        if (controlTalkedRecently(msg, assfartType)) {
            msg.channel.send(dparse("ans_assfart", [msg.author]));
            messageSent = true;
        }

        return;
    }

    if (msg_starts(msg, "!when")) {
        nextGalacon(msg);
        return;
    }

    if (msg_starts(msg, '!help')) {
        msg.author.send(dparse("ans_help", [msg.author]));
        messageSent = true;
        return;
    }

    if (msg_contains(msg, ' is best pony')) {
        if (msg_contains(msg, 'who is best pony')) {
            if (controlTalkedRecently(msg, bestPonyType)) {
                msg.channel.send(dparse("ans_best_pony1", [msg.author, getBizaamEmoji()]));
                messageSent = true;
            }
        } else if (msg_contains(msg, 'canni is best pony') || msg_contains(msg, 'canni soda is best pony')) {
            if (controlTalkedRecently(msg, canniBestPonyType)) {
                msg.channel.send(dparse("ans_best_pony2", [msg.author]));
                messageSent = true;
            }
        } else if (msg_contains(msg, 'bizaam is best pony') || msg_contains(msg, `${getBizaamEmoji()} is best pony`)) {
            if (controlTalkedRecently(msg, bizaamBestPonyType, false)) { // Don't send CD message here. It's not required.
                msg.channel.send(dparse("ans_best_pony3", [msg.author]));
                messageSent = true;
            }
        } else if (msg_contains(msg, 'assfart is best pony')) {
            if (controlTalkedRecently(msg, assFartBestPonyType, false)) { // Don't send CD message here. It's not required.
                msg.channel.send(dparse("ans_best_pony4", [msg.author]));
                messageSent = true;
            }
        } else if (msg_contains(msg, 'fanta is best pony')) {
            if (controlTalkedRecently(msg, fantaBestPonyType, false)) {
                msg.channel.send(dparse("ans_best_pony5", [msg.author]));
                messageSent = true;
            }
        } else {
            if (controlTalkedRecently(msg, interjectType, false)) { // Don't set a CD message here. It'll feel more natural if Canni doesn't respond every time in case people spam the command.
                msg.channel.send(dparse("ans_best_pony_default", [msg.author]));
                messageSent = true;
            }
        }
    }

    if (msg_contains(msg, ' is worst pony')) {
        if (msg_contains(msg, 'canni is worst pony') || msg_contains(msg, 'canni soda is worst pony')) {
            if (controlTalkedRecently(msg, canniworstPonyType, true, 60000, 'individual')) {
                msg.channel.send(dparse("ans_worst_pony1", [msg.author]));
                messageSent = true;
            }
        }
    }

    if (!messageSent) {
        if (msg.isMemberMentioned(client.user)) {
            msg.channel.send(dparse("ans_still_learning", [getShyEmoji()]));
        } else {
            let rnd = randomIntFromInterval(0, 200);
            if (rnd === 10) {
                msg.channel.send(`Boop ${msg.author}! I'm bored!`)
            }
        }
    }
});

function nextGalacon(msg) {
    msg.channel.send(dparse("ans_next_gala1", [getBizaamEmoji()]));
    let now = Date.now();
    let diff = galaconDate - now;
    var seconds = parseInt(diff) / 1000;
    let days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    let hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    msg.channel.send(dparse("ans_next_gala2", [days, hrs, minutes, Math.floor(seconds)]));
    messageSent = true;
}

function sendCooldownMessage(msg, type, cooldownTarget) {
    var cooldownMessage;
    switch (type) {
        case canniworstPonyType:
            cooldownMessage = dparse("ans_cooldown_worst", [msg.author]);
            cooldownTarget = msg.author.id;
            blockUser(msg, 300000);
            break;
        case loveCanniType:
            cooldownMessage = dparse("ans_cooldown_love", [getErrorEmoji()]);
            break;
        default:
            cooldownMessage = dparse("ans_cooldown_default", [msg.author, getErrorEmoji()]);
    }

    if (channelMessaged.has(cooldownTarget)) {
        // Do nothing. We don't want to spam everyone all the time.
    } else {
        msg.channel.send(cooldownMessage);

        channelMessaged.add(cooldownTarget);
        setTimeout(() => {
            channelMessaged.delete(cooldownTarget);
        }, 60000);

    }
}

//not implemented...
function noPermission(msg) {
    msg.channel.send(dparse("ans_no_permisson",[msg.author]))
}

// "controlTalkedRecently" simplifies the antispam check. Sends the cooldown message as default. Retruns true when message can be send.
function controlTalkedRecently(msg, type, cooldownmessage = true, cooldowntime = 60000, target = 'channel') {
    var cooldownTarget;
    switch (target) {
        case 'channel':
            cooldownTarget = msg.channel.id + type;
            break;
        case 'individual':
            cooldownTarget = msg.author.id;
            break;
    }

    if (talkedRecently.has(cooldownTarget)) {
        if (cooldownmessage) {
            sendCooldownMessage(msg, type, cooldownTarget);
        }
        return false;
    } else {
        talkedRecently.add(cooldownTarget);
        setTimeout(() => {
            talkedRecently.delete(cooldownTarget);
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

// Manually unblock a user.
function unblockUser(msg) {
    userBlocked.delete(msg.author.id);
}

function getBizaamEmoji() {
    if (bizaamEmoji === null) {
        bizaamEmoji = client.emojis.find(emoji => emoji.name.toLowerCase() === "bizaam");

        // Generic code for when Galacon specific emoji are unavailable.
        if (bizaamEmoji === null) {
            bizaamEmoji = "😃";
        }
    }

    return bizaamEmoji;
}

function getHugEmoji() {
    if (hugEmoji === null) {
        hugEmoji = client.emojis.find(emoji => emoji.name.toLowerCase() === "hug");

        // Generic code for when Galacon specific emoji are unavailable.
        if (hugEmoji === null) {
            hugEmoji = "🤗";
        }
    }

    return hugEmoji;
}

function getShyEmoji() {
    if (shyEmoji === null) {
        shyEmoji = client.emojis.find(emoji => emoji.name.toLowerCase() === "shy");

        // Generic code for when Galacon specific emoji are unavailable.
        if (shyEmoji === null) {
            shyEmoji = "😳";
        }
    }
    return shyEmoji;
}

function getLoveEmoji() {
    if (loveEmoji === null) {
        loveEmoji = client.emojis.find(emoji => emoji.name.toLowerCase() === "love");

        // Generic code for when Galacon specific emoji are unavailable.
        if (loveEmoji === null) {
            loveEmoji = "🤗";
        }
    }

    return loveEmoji;
}

function getErrorEmoji() {
    if (errorEmoji === null) {
        errorEmoji = client.emojis.find(emoji => emoji.name.toLowerCase() === "error");

        // Generic code for when Galacon specific emoji are unavailable.
        if (errorEmoji === null) {
            errorEmoji = "😫";
        }
    }

    return errorEmoji;
}

async function updateChannel() {
    channelUploadList = [];
    let token = "";
    while (token !== undefined) {
        const uploads = await getChannelUploadList(token);
        if (!uploads) {
            break;
        }
        for (let i = 0; i < uploads.body.items.length; i++)
            channelUploadList.push(uploads.body.items[i]);
        token = uploads.body.nextPageToken;
    }
}

async function getChannelUploadID(channelName = "CanniSoda") {
    let options = {
        uri: "https://www.googleapis.com/youtube/v3/channels",
        qs: {
            part: "contentDetails",
            forUsername: channelName,
            key: auth.youtube
        },
        resolveWithFullResponse: true,
        json: true
    }
    try {
        let response = await rp(options);
        return Promise.resolve(response);
    }
    catch (error) {
        return Promise.reject(error)
    }
}

async function getChannelUploadList(pageToken = "") {
    if (channelUploadID === undefined) {
        let body = await getChannelUploadID();
        channelUploadID = body.body.items[0].contentDetails.relatedPlaylists.uploads;
    }
    let options = {
        uri: "https://www.googleapis.com/youtube/v3/playlistItems",
        qs: {
            part: "snippet",
            playlistId: channelUploadID,
            key: auth.youtube,
            maxResults: 50
        },
        resolveWithFullResponse: true,
        json: true
    }
    if (pageToken !== "")
        options.qs.pageToken = pageToken;
    try {
        let response = await rp(options);
        return Promise.resolve(response);
    }
    catch (error) {
        return Promise.reject(error)
    }
}


// "msg_contains(msg, text)" is a shorter version of "msg.content.toLowerCase().includes(text)"
function msg_contains(msg, text) {
    return msg.content.toLowerCase().includes(text);
}

// "msg_starts(msg, text)" is a shorter version of "msg.content.toLowerCase().startsWith(text)"
function msg_starts(msg, text) {
    return msg.content.toLowerCase().startsWith(text);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function msg_contains_word(msg, word) {
    let content = msg.content.toLowerCase();
    content = content.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");
    let wrd = word.toLowerCase();
    let wrdArray = content.split(" ");
    for (var i = 0; i < wrdArray.length; i++) {
        if (wrd === wrdArray[i])
            return true;
    }
    return false;
}

function msg_starts_mentioned(msg, text) {
    var content = msg.content.toLowerCase().split(">")[1];
    if (content[0] === " ") {
        if (content[1] === " ") {
            return content.substring(2).startsWith(text);
        }
        return content.substring(1).startsWith(text);
    }
    return content.startsWith(text);


    //return .startsWith(text);
}


//parses variables into strings from data. After string argument a list element with the variables is required.
function dparse(str) {
    var raw = data[str];
    var args = [].slice.call(arguments, 1), i = 0;
    try {
        return raw.replace(/%s/g, () => args[0][i++])
    }
    catch (error) {
        return raw.replace(/%s/g, () => args[i++]);
    }
}

function parse(str) {
    var args = [].slice.call(arguments, 1), i = 0;
    try {
        return str.replace(/%s/g, () => args[0][i++])
    }
    catch (error) {
        return str.replace(/%s/g, () => args[i++])
    }
}

function auth_dev(msg) {
    return dev_ids.includes(msg.author.id);
}

function auth_dev_master(msg) {
    return dev_master_ids.includes(msg.author.id);
}

//with nodemon bot will restart after ids.json is rewritten
function id_add(id) {
    if (!dev_ids.includes(id)) {
        dev_ids.push(id);
        ids = [dev_ids, dev_master_ids];
        if (write_to_file) {
            fs.writeFile('ids.json', JSON.stringify(ids), function(err) {
            if (err) throw err;
            });
        }
        return true;
    }
    return false;
}

function id_remove(id) {
    if (dev_ids.includes(id)) {
        dev_ids = dev_ids.filter(item => item !== id);
        ids = [dev_ids, dev_master_ids];
        if (write_to_file) {
            fs.writeFile('ids.json', JSON.stringify(ids), function(err) {
                if (err) throw err;
            });
        }
        return true;
    }
    return false;
}

client.login(auth.token);