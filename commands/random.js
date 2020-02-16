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
        const embed = new Discord.MessageEmbed()
        .setAuthor("Cyanide & Happiness VF", this.client.user.displayAvatarURL())
        .setTitle("Ouvrir sur Instagram")
        .setURL(this.client.instaLink)
        .setDescription("🎲 Post aléatoire")
        .attachFiles([`./assets/posts/${post}`])
        .setImage(`attachment://${post}`)
        .setFooter(data.footer)
        .setColor(data.color);
        message.channel.send(embed);
    }
}