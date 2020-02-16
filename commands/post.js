const Command = require("../structures/Command.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "post",
            enabled: true,
            aliases: [],
            clientPermissions: [],
            permLevel: "Fondateurs",
            cooldown: 1000
        });
    }

    async run(message, args) {
        const { lastPosts } = await this.client.insta.getProfile(this.client.config.insta);
        const numberOfPosts = args[0];
        if(!numberOfPosts || isNaN(numberOfPosts)) return message.error("Vous devez indiquer un nombre de posts!");
        const posts = lastPosts.splice(0, parseInt(numberOfPosts)).reverse();
        const channel = message.guild.channels.cache.get(this.client.config.postChannel);
        message.channel.send(":baby_chick: | Annonce des posts en cours...");
        await this.client.functions.asyncForEach(posts, async (post) => {
            const fetchedPost = await this.client.insta.getPost(post.shortcode);
            channel.send(this.client.config.postFormat.replace("{link}", fetchedPost.link));
        });
        message.success("Tâche terminée !");
    }
}