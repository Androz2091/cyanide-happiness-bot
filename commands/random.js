const Command = require("../structures/Command.js");
const Discord = require("discord.js");
const { readdirSync } = require("fs");
const posts = readdirSync("./assets/posts");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "random",
            enabled: true,
            aliases: [],
            clientPermissions: [],
            permLevel: "Utilisateur",
            cooldown: 1000
        });
    }

    async run(message, args, data) {
        const post = posts[Math.floor(Math.random() * posts.length)];
        const attachment = new Discord.MessageAttachment(`./assets/posts/${post}`, `random.${post.split(".")[1]}`);
        message.channel.send(attachment);
    }
}