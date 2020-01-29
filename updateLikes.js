module.exports = async (channel, InstaClient, log) => {
    // Fetch les 10 derniers messages du salon
    let messages = await channel.fetchMessages({ limit: 10 });
    messages
        // Garde seulement les messages du bot
        .filter(m => m.author.id === channel.client.user.id)
        // Les trie par date
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .forEach(async message => {
            // Parse le message pour obtenir le shortcode dans le lien
            let shortcode = message.content.match(
                /(https:\/\/www\.instagram\.com\/p\/)([\w]{11})/
            )[2];
            // Récupère le post mis à jour
            let post = await InstaClient.getPost(shortcode);
            // Mets à jour le nombre de likes
            let oldLikeCount = message.content.split(": ").pop();
            let updatedMessage = message.content.replace(
                oldLikeCount,
                `**${post.likes}**`
            );
            // Edite le message
            message.edit(updatedMessage);
            log.info(`[!] Message #${message.id} updated.`);
        });
};
