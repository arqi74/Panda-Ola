const hello = ["Oczywiście, proszę bardzo :3 <:coffee:503563195718565890>"];
exports.run = (client, message, args) => {
	message.reply(
		hello[ Math.floor(Math.random()*hello.length) ]
	);
}