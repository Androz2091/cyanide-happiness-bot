const Command = require("../structures/Command.js"),
    Discord = require("discord.js");

class Help extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            enabled: true,
            aliases: ["aide"],
            clientPermissions: [],
            permLevel: "Utilisateur",
            cooldown: 1000
        });
    }

    async run(message, args, data) {
        message.error("Not available yet.");
    }
}

module.exports = Help;