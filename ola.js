const Discord = require('discord.js');
const express = require('express');
const fs = require('fs');
const app = new Discord.Client();


const webapp = express(); 
webapp.use(require('body-parser').json({
    extended: true
}));

app.commands = [];
app.prefix = "O!";
app.channelIDLog = "503316999582121995";
app.serwerID = "301829179845115905";
const humanPrefixes =  ["Ola", "Oluś", "Olcia", "Pandzia"];
const prefix = "O!";


fs.readdir("./commands/", (err, files)=>{
    if(err) return console.error(err);
	files.forEach(file=>{
        if(!file.endsWith(".js")) return;
		let props = require('./commands/'+file);
		let commandName = file.split(".")[0];
		app.commands[commandName] =  props;
	});
});

fs.readdir("./events/", (err, files)=>{
    if(err) return console.error(err);
	files.forEach(file=>{
        if(!file.endsWith(".js")) return;
		let props = require('./events/'+file);
		let eventName = file.split(".")[0];
        app.on(eventName, props.bind(null, app));
    });
});

/**
 * 
 * @param {string} text 
 * @returns {string} text bez polskich ogonków
 */
function replacePolishDiacritics(text){
	var from = ['ą','ć','ę','ł','ń','ó','ś','ź','ż'];
	var to   = ['a','c','e','l','n','o','s','z','z'];
	for(var i = 0 ; i < from.length ; ++i){
		text = text.replace(from[i], to[i]);
	}   
	return text;
}

/**
 * Sprawdza czy tekst zawiera prefix ludzki np. "Martyno"
 * @param {string} text tekst do sprawdzenia
 */
function hasHumanPrefix( text ){
	for(var i = 0 ; i < humanPrefixes.length ; ++i )
		if(text.startsWith(humanPrefixes[i]+" ")) return true;
	
	return false;
}

/**
 * @param {Discord.Message} message 
 */
function proccesHumanCommand(message){
	var text = replacePolishDiacritics(message.content.toLowerCase());
	var cmd = (
		(text.indexOf("ktora")!==-1 || text.indexOf("jaka")!==-1 || text.indexOf("ktory")!==-1 || text.indexOf("jaki")!==-1 || text.indexOf("podaj")!==-1) 
		&&
		(text.indexOf("godzina")!==-1 || text.indexOf("czas")!==-1 || text.indexOf("dzisiaj")!==-1 || text.indexOf("godzine")!==-1)
	);
	if(cmd){
		app.commands["czas"].run(app,message);
		return;
    }
	cmd = (
		(text.indexOf("czy")!==-1)
		&&
        (text.indexOf("subol")!==-1 || text.indexOf("arwi")!==-1)
        &&
        (text.indexOf("to")!==-1 || text.indexOf("jest")!==-1)
        &&
        (text.indexOf("gejem")!==-1 || text.indexOf("pedałem")!==-1 || text.indexOf("homo")!==-1)
	);
	if(cmd){
		app.commands["gey"].run(app,message);
		return;
	}
		
	cmd = (
		(text.indexOf("zrobisz")!==-1)
		&&
		(text.indexOf("mi")!==-1)
		&&
		(text.indexOf("kawe")!==-1 || text.indexOf("kawcie"))
	);
	if(cmd) {
		app.commands["kawa"].run(app,message);
		return;
	}

	cmd = (
		(text.indexOf("kto")!==-1)
		&&
		(text.indexOf("jest")!==-1)
		&&
		(text.indexOf("najslodszym"))
		&&
		(text.indexOf("kotkiem")!==-1 || text.indexOf("kociakiem"))
	);
	if(cmd) {
		app.commands["ari"].run(app,message);
		return;
	}
}

app.on('message', (message)=>{
	if(message.author.bot) return;
	if(message.content.indexOf(prefix)!==0){
		if(hasHumanPrefix(message.content)){
			proccesHumanCommand(message);
		}
	}else{
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		const cmd = app.commands[command];
		if(!cmd) return;
		cmd.run(app, message, args);
	}
});

app.on("ready", () => {
    console.log("Ready: "+app.user.id);

    webapp.listen(7777, () => {
        console.log("Web started on: 7777");
    });    
});

webapp.get('/channels', (req, res) => {
    var channelsodp = [];
    app.guilds.get(app.serwerID).channels.forEach(channel => {
        if(channel.type != "text") return;
        channelsodp.push({
            name: channel.name,
            id: channel.id
        });
    });
    res.send(JSON.stringify(channelsodp));
});

webapp.post('/posts', (req, res) => {
    var dane = req.body;
    app.guilds.get(app.serwerID).channels.get(dane.channel).send(dane.text);
});

webapp.use(express.static("public"));

app.login(require('./token.json').token);