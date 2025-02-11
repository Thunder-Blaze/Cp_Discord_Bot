import fetch from 'node-fetch'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getEntryByPlatformMemID } from '../database/fetchData.js'

export default {
    data: new SlashCommandBuilder()
        .setName('cfuserpfp') // Command name
        .setDescription('Fetches PFP for the given CodeForces username')
        .addStringOption((option) =>
            option
                .setName('id')
                .setDescription('CodeForces Username')
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply()
        // Get the handle input from the user
        let handle = interaction.options.getString('id') // Get username if provided
        const userId = interaction.user.id // Discord User ID
        
        if (handle[0]=='@'){
            handle = handle.slice(1);
            const members = await interaction.guild.members.fetch();
            const member = members.find(m => m.user.username === handle);
            if (member) {
                repliedUser = member.user.id;
            } else {
                return await interaction.editReply('No associated Codeforces username found for this user.');
            }
            const row = await getEntryByPlatformMemID('codeforces', userId)

            if (row) {
                handle = row.username
            } else {
                return await interaction.editReply('No associated Codeforces username found for this user.')
            }
        }

        // If no ID is provided, fetch associated username from the database
        if (!handle) {
            const row = await getEntryByPlatformMemID('codeforces', userId)

            if (row) {
                handle = row.username
            } else {
                return await interaction.editReply('No associated Codeforces username found for this user.')
            }
        }

        // Make the API request to get Codeforces user data
        const apiUrl = `https://codeforces.com/api/user.info?handles=${handle}`
        try {
            const response = await fetch(apiUrl)
            let data = await response.json()

            // Check if the API returned a valid response
            if (!data || data.error || !data.result) {
                return await interaction.editReply(
                    `Could not find data for handle: \`${handle}\`. Please check the handle and try again.`
                )
            }

            data = data.result[0]

            if (!data.titlePhoto)
                return await interaction.editReply(
                    `Could not find PFP for handle: \`${handle}\`.`
                )

            const { titlePhoto } = data
            // Send the embed as a reply
            await interaction.editReply({
                content: 'Here is the PFP for the given CodeForces username:',
                files: [titlePhoto],
            })
        } catch (error) {
            console.error(error)
            await interaction.editReply(
                'There was an error while fetching the PFP from CodeForces.'
            )
        }
    },
}
