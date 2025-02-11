import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('cfuserpfp')  // Command name
        .setDescription('Fetches PFP for the given CodeForces username')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('CodeForces Username')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Get the handle input from the user
        const handle = interaction.options.getString('id');
        
        // Make the API request to get CodeChef user data
        const apiUrl = `https://codeforces.com/api/user.info?handles=${handle}`;
        try {
            const response = await fetch(apiUrl);
            let data = await response.json();
            
            // Check if the API returned a valid response
            if (!data || data.error || !data.result) {
                return await interaction.reply(`Could not find data for handle: \`${handle}\`. Please check the handle and try again.`);
            }

            data = data.result[0];

            if (!data.titlePhoto) return await interaction.reply(`Could not find PFP for handle: \`${handle}\`.`);
            
            const { titlePhoto } = data;
            // Send the embed as a reply
            await interaction.reply({ 
                content: 'Here is the PFP for the given CodeForces username:',
                files: [titlePhoto],
             });

        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error while fetching the PFP from CodeChef.');
        }
    },
};
