const Command = require("../structures/Command.js"),
Pagination = require("discord-paginationembed"),
Discord = require("discord.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "last",
            enabled: true,
            aliases: [],
            clientPermissions: [],
            permLevel: "Utilisateur",
            cooldown: 1000
        });
    }

    async run(message, args, data) {
        const { lastPosts } = await this.client.insta.getProfile(this.client.config.insta);
        const lastPostShortCode = lastPosts[0].shortcode;
        const lastPost = await this.client.insta.getPost(lastPostShortCode);
        const embeds = [];

        lastPost.contents.forEach((item) => {
            const embed = new Discord.MessageEmbed()
            .setImage(item.url);
            embeds.push(embed);
        });

        let pagination = new Pagination.Embeds()
        .setArray(embeds)
        .setAuthorizedUsers([message.author.id])
        .setChannel(message.channel)
        .setPageIndicator(false)
        .setColor("#FF0000")
        .setTitle("Ouvrir sur Instagram")
        .setURL(lastPost.link)
        .addField("❤️ Likes", lastPost.likes)
        .addField("💬 Commentaires", lastPosts[0].comments);

        pagination.build();
    }
}