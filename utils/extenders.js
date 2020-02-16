const { Message } = require("discord.js");

module.exports = client => {
    Message.prototype.error = async function(content) {
        return await this.channel.send(
            `${client.config.emotes.error} | ${content}`
        );
    };

    Message.prototype.success = async function(content) {
        return await this.channel.send(
            `${client.config.emotes.success} | ${content}`
        );
    };

    Array.prototype.removeDuplicates = function() {
        return this.filter((a, b) => this.indexOf(a) === b);
    };
};