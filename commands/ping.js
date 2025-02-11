export default {
    data: {
        name: 'ping',
        description: 'Ping the bot!',
    },
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
