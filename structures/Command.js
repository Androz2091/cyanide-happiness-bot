const { MessageEmbed } = require("discord.js");

module.exports = class Command {
    constructor(
        client,
        {
            name = null,
            enabled = true,
            aliases = new Array(),
            clientPermissions = new Array(),
            permLevel = "Yepco",
            cooldown = 5000
        }
    ) {
        this.client = client;
        this.conf = {
            enabled,
            aliases,
            permLevel,
            clientPermissions,
            cooldown
        };
        this.help = {
            name
        };
    }
};