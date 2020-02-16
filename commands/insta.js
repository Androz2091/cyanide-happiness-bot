const Command = require("../structures/Command.js"),
    Discord = require("discord.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "insta",
            enabled: true,
            aliases: [],
            clientPermissions: [],
            permLevel: "Utilisateur",
            cooldown: 1000
        });
    }

    async run(message, args, data) {
        const profile = await this.client.insta.getProfile(this.client.config.insta);
        const embed = new Discord.MessageEmbed()
        .setAuthor("Cyanide & Happiness VF", profile.pic)
        .setTitle("Ouvrir sur Instagram")
        .setURL(profile.link)
        .addField("👥 Abonné(e)s", profile.followers)
        .addField("📰 Posts", profile.posts)
        .setFooter(data.footer)
        .setColor(data.color);
        message.channel.send(embed);
    }
}