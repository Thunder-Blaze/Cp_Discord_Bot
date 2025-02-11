// import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders'

export default {
    data: new SlashCommandBuilder()
        .setName('ccusergraph') // Command name
        .setDescription('Prints the Graph for the given CodeChef username')
        .addStringOption((option) =>
            option
                .setName('id')
                .setDescription('CodeChef Username')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply()
        // Get the handle input from the user
        const handle = interaction.options.getString('id')

        // Make the API request to get CodeChef user data
        const graphUrl = `https://codechef-api.vercel.app/rating/${handle}`

        await interaction.editReply({
            content: 'Here is the PFP for the given CodeChef username:',
            files: [graphUrl],
        })
    },
}
