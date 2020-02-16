const Discord = require("discord.js");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run() {
        const client = this.client;

        // Logs some informations using the logger file
        client.logger.log(
            `Loading a total of ${client.commands.size} command(s).`,
            "log"
        );
        client.logger.log(
            `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`,
            "ready"
        );

        client.user.setActivity(client.config.status);
    }
};