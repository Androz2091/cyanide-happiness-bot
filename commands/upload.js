const Command = require("../structures/Command.js");
const { writeFile } = require("fs").promises;
const cachedFiles = [];
const { readdirSync, readFileSync, createWriteStream } = require("fs");
const posts = readdirSync("./assets/posts");
posts.forEach((post) => {
    const fileContent = readFileSync("./assets/posts/"+post);
    cachedFiles.push(fileContent);
});
let last = posts.map((e) => e.split('.').shift()).reverse()[0];
const request = require("request");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "upload",
            enabled: true,
            aliases: [],
            clientPermissions: [],
            permLevel: "Développeur",
            cooldown: 1000
        });
    }

    async run(message, args) {
        const attachments = message.attachments.array().map((a) => a.url);
        message.channel.send(":baby_chick: | Upload de "+attachments.length+" posts en cours...");
        await this.client.functions.asyncForEach(attachments, async (attachment) => {
            await request(attachment).pipe(createWriteStream(`./assets/posts/${parseInt(last)+1}.jpg`));
        });
        message.success("Tâche terminée !");
    }
}