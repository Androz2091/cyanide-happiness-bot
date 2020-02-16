const Discord = require("discord.js");
const cooldowns = {};
const permissions = require("../assets/json/permissions.json");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        const data = {
            color: this.client.config.color,
            footer: this.client.config.footer
        };

        // If the message author is a bot
        if (message.author.bot || !message.guild) {
            return;
        }

        // If the member on a guild is invisible or not cached, fetch them.
        if (!message.member) {
            await message.guild.fetchMember(message.author.id);
        }

        // Checks if the bot was mentioned, with no message after it, returns the prefix.
        if (message.content.match(`<@${this.client.user.id}>`)) {
            return message.channel.send(
                "Bonjour, " +
                    message.author +
                    " ! Obtiens la liste des commandes grâce à `" +
                    data.guildSettings.prefix +
                    "help` !"
            );
        }

        // If the message does not start with the prefix, cancel
        if (!message.content.startsWith(this.client.config.prefix)) {
            return;
        }

        // If the message content is "/pay @Androz 10", the args will be : [ "pay", "@Androz", "10" ]
        const args = message.content
            .slice(this.client.config.prefix.length)
            .trim()
            .split(/ +/g);
        // The command will be : "pay" and the args : [ "@Androz", "10" ]
        const command = args.shift().toLowerCase();

        // Gets the command
        const cmd =
            this.client.commands.get(command) ||
            this.client.commands.get(this.client.aliases.get(command));

        // If no command found, return;
        if (!cmd) return;
        else message.cmd = cmd;

        /* Client permissions */
        const neededPermissions = [];
        cmd.conf.clientPermissions.forEach(permission => {
            if (
                !message.channel
                    .permissionsFor(message.guild.me)
                    .has(permission)
            ) {
                neededPermissions.push(permission);
            }
        });
        if (neededPermissions.length > 0) {
            return message.channel.send(
                `__**${
                    this.client.config.emotes.error
                } Permissions manquantes**__\n\nJ'ai besoin des permissions suivantes pour le bon fonctionnement de cette commande : ${neededPermissions
                    .map(p => permissions[p])
                    .join(", ")}`
            );
        }

        /* Command disabled */
        if (!cmd.conf.enabled) {
            return message.error(
                "Cette commande est actuellement désactivée !"
            );
        }

        /* User permissions */
        const permLevel = await this.client.getLevel(message);
        if (permLevel < this.client.levelCache[cmd.conf.permLevel]) {
            return message.error(
                "Cette commande nécessite le niveau de permission : `" +
                    cmd.conf.permLevel +
                    "` !"
            );
        }

        let time = cooldowns[`${message.author.id}${cmd.help.name}`] || 0;
        if (time > Date.now()) {
            return message.error(
                "Vous devez attendre encore **" +
                    Math.ceil((time - Date.now()) / 1000) +
                    "** seconde(s) avant de pouvoir de nouveau effectuer cette commande !"
            );
        } else {
            cooldowns[`${message.author.id}${cmd.help.name}`] =
                Date.now() - cmd.conf.cooldown;
        }

        this.client.logger.log(
            `${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`,
            "cmd"
        );

        // If the command exists, **AND** the user has permission, run it.
        cmd.run(message, args, data);
    }
};