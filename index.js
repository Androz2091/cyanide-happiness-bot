// Load up the discord.js library
const { Client, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const readdir = promisify(fs.readdir);

const InstaClient = require("@kaki87/ig-scraper");
const config = require("./config.js");

// Creates new class
class CyanideAndHapinessBot extends Client {
    constructor(options) {
        super(options);
        this.config = config; // Load the config file
        this.commands = new Collection(); // Creates new commands collection
        this.aliases = new Collection(); // Creates new command aliases collection
        this.wait = promisify(setTimeout); // client.wait(1000) - Wait 1 second
        this.functions = require("./utils/functions")(this); // Load the functions file
        this.logger = require("./utils/logger");
        this.permLevels = require("./utils/permissions");
        this.insta = new InstaClient();
        this.instaLink = "https://www.instagram.com/cyanidehappinessvf2";
        require("./utils/extenders")(this);
    }

    // This function is used to load a command and add it to the collection
    loadCommand(commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(
                this
            );
            this.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }

    // This function is used to unload a command (you need to load them again)
    async unloadCommand(commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
            command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
            command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) {
            return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        }
        if (command.shutdown) {
            await command.shutdown(this);
        }
        delete require.cache[
            require.resolve(`${commandPath}${path.sep}${commandName}.js`)
        ];
        return false;
    }

    getLevel(message) {
        let permlvl = 0;
        const permOrder = this.permLevels
            .slice(0)
            .sort((p, c) => (p.level < c.level ? 1 : -1));
        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (message.guild && currentLevel.guildOnly) {
                continue;
            }
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    }
}

// Create new client
const client = new CyanideAndHapinessBot({
    disabledEvents: ["TYPING_START"]
});

const init = async () => {
    // Search for all commands
    const commands = await readdir("./commands/");
    commands
        .filter(cmd => cmd.split(".").pop() === "js")
        .forEach(cmd => {
            const response = client.loadCommand("./commands/", cmd);
            if (response) {
                client.logger.log(response, "error");
            }
        });

    // Then we load events, which will include our message and ready event.
    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });

    client.login(client.config.token); // Log in to the discord api

    // Gets commands permission
    client.levelCache = {};
    for (let i = 0; i < client.permLevels.length; i++) {
        const thisLevel = client.permLevels[parseInt(i, 10)];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
};

init();

// if there are errors, log them
client
    .on("disconnect", () =>
        client.logger.log("Bot is disconnecting...", "warn")
    )
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
    .on("error", e => client.logger.log(e, "error"))
    .on("warn", info => client.logger.log(info, "log"));

// if there is an unhandledRejection, log them
process.on("unhandledRejection", err => {
    console.error(err);
});