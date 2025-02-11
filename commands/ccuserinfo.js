import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('ccuserinfo')  // Command name
        .setDescription('Prints info for the given CodeChef username')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('CodeChef Username')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        // Get the handle input from the user
        const handle = interaction.options.getString('id');
        
        // Make the API request to get CodeChef user data
        const apiUrl = `https://codechef-api.vercel.app/handle/${handle}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // Check if the API returned a valid response
            if (!data || data.error) {
                return await interaction.editReply(`Could not find data for handle: \`${handle}\`. Please check the handle and try again.`);
            }

            // Extract useful data from the response
            const { name, currentRating, highestRating, stars, globalRank, profile } = data;
            const contests = data.ratingData.length || 0;
            const pfpUrl = profile || 'https://i.pinimg.com/originals/69/40/7f/69407fe3a7697fa29e1b3b6e96ca22de.jpg'; // Use a default pfp if none is provided

            // Create the embed to send as a reply
            const embed = {
                color: 0x0099ff, // Embed color
                title: `CodeChef Stats for ${handle}`,
                thumbnail: {
                    url: pfpUrl, // Set the profile picture as thumbnail
                },
                fields: [
                    {
                        name: 'Name',
                        value: name, // Rating is usually a number
                        inline: false,
                    },
                    {
                        name: 'Current Rating',
                        value: currentRating.toString(), // Rating is usually a number
                        inline: false,
                    },
                    {
                        name: 'Highest Rating',
                        value: highestRating.toString(), // Rating is usually a number
                        inline: false,
                    },
                    {
                        name: 'Stars',
                        value: stars.toString(), // Stars is usually a number
                        inline: false,
                    },
                    {
                        name: 'Contests Given',
                        value: contests.toString(), // Global rank is usually a number
                        inline: false,
                    },
                    {
                        name: 'Global Rank',
                        value: globalRank.toString(), // Global rank is usually a number
                        inline: false,
                    },
                ],
                footer: {
                    text: 'Data fetched from CodeChef API',
                },
            };

            // Send the embed as a reply
            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('There was an error while fetching the data from CodeChef. Please try again later.');
        }
    },
};
