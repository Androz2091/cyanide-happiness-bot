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
        message.channel.send(":crown: **Fondateurs**\r\n\r\n`"+this.client.config.prefix+"upload`: Transfert de nouvelles publications vers le serveur.\r\n`"+this.client.config.prefix+"post`: Poste de nouvelles publications.\r\n\r\n:man_detective: **D\u00E9veloppeur**\r\n\r\n`"+this.client.config.prefix+"eval`: Ex\u00E9cute du code javascript.\r\n\r\n:baby_chick: **Utilisateurs**\r\n\r\n`"+this.client.config.prefix+"random`: Affiche une publication al\u00E9atoire.\r\n`"+this.client.config.prefix+"insta`: Affiche des informations sur le compte Instagram de Cyanide and Happiness VF.");
    }
}

module.exports = Help;