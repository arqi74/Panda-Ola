const hello = ["No jasne, że tak :*"];
exports.run = (client, message, args) => {
	message.reply(
		hello[ Math.floor(Math.random()*hello.length) ]
	);
}