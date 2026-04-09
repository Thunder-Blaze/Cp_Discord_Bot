export default {
    data: {
        name: 'hello',
        description: 'Say hello!',
    },
    async execute(interaction) {
        await interaction.reply('Hello! How can I help you today?')
    },
}
