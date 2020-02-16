module.exports = [
    {
        level: 0,
        name: "Utilisateur",
        check: () => true
    },
    {
        level: 1,
        name: "Modérateur",
        check: message =>
            message.guild
                ? message.member.hasPermission("MANAGE_MESSAGES")
                : false
    },
    {
        level: 2,
        name: "Administrateur",
        check: message =>
            message.guild
                ? message.member.hasPermission("ADMINISTRATOR")
                : false
    },
    {
        level: 3,
        name: "Développeur",
        check: message =>
            message.client.config.developers.includes(message.author.id)
    },
    {
        level: 4,
        name: "Fondateurs",
        check: message =>
            message.client.config.owners.includes(message.author.id)
    }
];