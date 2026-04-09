import fetch from 'node-fetch'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getEntryByPlatformMemID } from '../database/fetchData.js'

export default {
    data: new SlashCommandBuilder()
        .setName('ccuserpfp') // Command name
        .setDescription('Fetches PFP for the given CodeChef username')
        .addStringOption((option) =>
            option
                .setName('id')
                .setDescription('CodeChef Username')
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply()
        // Get the handle input from the user
        let handle = interaction.options.getString('id') // Get username if provided
        const userId = interaction.user.id // Discord User ID

        // If no ID is provided, fetch associated username from the database
        if (!handle) {
            const row = await getEntryByPlatformMemID('codechef', userId)

            if (row) {
                handle = row.username
            } else {
                return await interaction.editReply(
                    'No associated CodeChef username found for this user.'
                )
            }
        }

        if (handle[0] == '<') {
            handle = handle.slice(2).slice(0, -1)
            const row = await getEntryByPlatformMemID('codechef', handle)

            if (row) {
                handle = row.username
            } else {
                return await interaction.editReply(
                    'No associated CodeChef username found for this user.'
                )
            }
        }

        // Make the API request to get CodeChef user data
        const apiUrl = `https://codechef-api.vercel.app/handle/${handle}`
        try {
            const response = await fetch(apiUrl)
            const data = await response.json()

            // Check if the API returned a valid response
            if (!data || data.error) {
                return await interaction.editReply(
                    `Could not find data for handle: \`${handle}\`. Please check the handle and try again.`
                )
            }

            if (!data.profile)
                return await interaction.editReply(
                    `Could not find PFP for handle: \`${handle}\`.`
                )

            // Extract useful data from the response
            const { profile } = data
            const pfpUrl =
                profile ||
                'https://i.pinimg.com/originals/69/40/7f/69407fe3a7697fa29e1b3b6e96ca22de.jpg' // Use a default pfp if none is provided

            // Send the embed as a reply
            await interaction.editReply({
                content: 'Here is the PFP for the given CodeChef username:',
                files: [pfpUrl],
            })
        } catch (error) {
            console.error(error)
            await interaction.editReply(
                'There was an error while fetching the PFP from CodeChef.'
            )
        }
    },
}
