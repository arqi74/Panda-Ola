const Discord = require("discord.js");
module.exports = (app, msg) => {
    if(msg.author.bot) return;
    var embed = new Discord.RichEmbed()
        .setTitle("Usunięta wiadomość")
        .setColor(0xa30e79)
        .setDescription("")
        .addField("Autor", "<@"+msg.author.id+">")
        .addField("Kanał", msg.channel)
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setTimestamp(msg.createdAt);

    if(msg.attachments.size > 0) {
        embed.setImage(msg.attachments.array()[0].proxyURL);
    }

    if(msg.content && msg.content.length > 0) 
        embed.addField("Treść", msg.content);

    app.channels.get(app.channelIDLog).send(embed);
};