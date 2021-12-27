module.exports = (app, msg) => {
    if(msg.author.bot) return;
    if(!msg.content.startsWith(app.prefix)) return;
    var argumenty = msg.content.slice(app.prefix.length).trim().split(/ +/g);
    var polecenie = argumenty.shift().toLowerCase();
    var comd = app.commands[polecenie];
    if(!comd) return;
    comd.run(app, msg, argumenty);
};