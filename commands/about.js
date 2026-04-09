export default {
    data: {
        name: 'about',
        description: 'About the bot!',
    },
    async execute(interaction) {
        await interaction.reply(
            "I'm a bot that can helf you find info on Competetive Coding Profiles !"
        )
    },
}
