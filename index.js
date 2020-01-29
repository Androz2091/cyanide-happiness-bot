const log = require("simple-node-logger").createSimpleLogger("bot.log");
log.info("[!] Starting...");

const updateLikes = require("./updateLikes");

// Récupération des données de la config
const {
    INSTA_USERNAME, // Pseudo du compte à observer
    BOT_TOKEN, // Token du bot discord
    POSTS_CHANNEL, // Channel dans lequel il faut poster les nouveaux posts
    MESSAGE, // Message formaté pour les nouveaux posts

    INSTA_INTERVAL, // L'interval en ms pour check les nouveaux posts
    MESSAGE_UPDATE_INTERVAL, // L'interval de temps pour mettre à jour les likes
    FORCE_PUSH_START, // Si le message pour le dernier post doit être envoyé au démarrage
    LOG_LEVEL // Le niveau de log
} = require("./config.json");
//log.setLevel(LOG_LEVEL);

// Initialisation du client Instagram
const Insta = require("@kaki87/ig-scraper");
const InstaClient = new Insta();

// Le dernier post (cache)
let lastPost = null;

// Initialisation du client Discord
const Discord = require("discord.js");
const client = new Discord.Client();

// Connexion à Discord
client.login(BOT_TOKEN);

client.on("ready", async () => {
    log.info("[!] Ready. Logged as " + client.user.tag + ".");

    // Récupération du dernier post
    let user = await InstaClient.getProfile(INSTA_USERNAME);
    lastPost = user.lastPosts[0].shortcode;
    log.info(`Last post found: ${lastPost}`);

    // Salon des posts
    let postsChannel = client.channels.get(POSTS_CHANNEL);
    log.info(`[!] Posts will be sent in # ${postsChannel.name}`);

    log.info(`[!] Starting like updates.`);
    updateLikes(postsChannel, InstaClient, log);
    // Toutes les heures, mise à jour du compteur de likes sur chaque message
    setInterval(
        updateLikes,
        MESSAGE_UPDATE_INTERVAL,
        postsChannel,
        InstaClient,
        log
    );

    // Envoi d'un post
    const sendPost = async shortcode => {
        let post = await InstaClient.getPost(shortcode);
        postsChannel.send(
            MESSAGE
                // Lien du post
                .replace("{{link}}", post.link)
                // Message du post
                .replace("{{caption}}", post.caption)
                // Nombre de likes
                .replace("{{likeCount}}", post.likes)
        );
    };

    // Si aucun message n'est encore envoyé, envoi du dernier post
    let messages = await postsChannel.fetchMessages();
    if (
        FORCE_PUSH_START ||
        messages.size === 0 ||
        process.argv.includes("--push-last")
    )
        sendPost(lastPost);

    // Pour les prochains posts
    setInterval(() => {
        InstaClient.getProfile(INSTA_USERNAME)
            .then(profile => {
                // Si le dernier post n'est pas le même que celui en cache
                if (profile.lastPosts[0].shortcode !== lastPost) {
                    lastPost = profile.lastPosts[0].shortcode;
                    sendPost(lastPost);
                    log.info(`New post found: ${lastPost}`);
                } else {
                    log.log("No new post found.");
                }
            })
            .catch((error) => {
                log.log(`Cannot fetch ${INSTA_USERNAME}.`);
                log.log(error);
            });
    }, INSTA_INTERVAL);
});
