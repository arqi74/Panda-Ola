const hello = ["Oczywiście że Arisu :3"];
exports.run = (client, message, args) => {
	message.reply(
		hello[ Math.floor(Math.random()*hello.length) ]
	);
}