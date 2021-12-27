const hello = ["Tak :3", "Oczwiście", "Nuum :*"];
exports.run = (client, message, args) => {
	message.reply(
		hello[ Math.floor(Math.random()*hello.length) ]
	);
}