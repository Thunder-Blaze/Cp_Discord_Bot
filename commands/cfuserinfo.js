import fetch from 'node-fetch'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getEntryByPlatformMemID } from '../database/fetchData.js'

export default {
    data: new SlashCommandBuilder()
        .setName('cfuserinfo') // Command name
        .setDescription('Prints info for the given CodeForces username')
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
        const repliedUser = interaction.options.getUser('message_reference') // If command is used as a reply

        // If no ID is provided, fetch associated username from the database
        if (!handle) {
            let targetId = repliedUser ? repliedUser.id : userId // Check if replying to a user, else use the command sender
            const row = await getEntryByPlatformMemID('codeforces', targetId)

            if (row) {
                handle = row.username
            } else {
                return await interaction.editReply('No associated CodeForces username found for this user.')
            }
        }

        // Make the API request to get CodeForces user data
        const apiUrl = `https://codeforces.com/api/user.info?handles=${handle}`
        try {
            const response = await fetch(apiUrl)
            let data = await response.json()

            // Check if the API returned a valid response
            if (!data || data.error) {
                return await interaction.editReply(
                    `Could not find data for handle: \`${handle}\`. Please check the handle and try again.`
                )
            }

            data = data.result[0]

            // Extract useful data from the response
            const {
                firstName,
                lastName,
                rating,
                maxRating,
                rank,
                maxRank,
                titlePhoto,
            } = data
            const name = firstName + ' ' + lastName
            const pfpUrl =
                titlePhoto ||
                'https://i.pinimg.com/originals/69/40/7f/69407fe3a7697fa29e1b3b6e96ca22de.jpg' // Use a default pfp if none is provided

            let solvedProblems = 0
            let contestsGiven = 0

            try {
                const tempApiUrl = `https://codeforces.com/api/user.status?handle=${handle}`
                const tempResponse = await fetch(tempApiUrl)
                let tempData = await tempResponse.json()
                solvedProblems = tempData.result.filter(
                    (submission) => submission.verdict === 'OK'
                ).length
            } catch (error) {
                console.log(error)
            }

            try {
                const tempApiUrl = `https://codeforces.com/api/user.rating?handle=${handle}`
                const tempResponse = await fetch(tempApiUrl)
                let tempData = await tempResponse.json()
                contestsGiven = tempData.result.length
            } catch (error) {
                console.log(error)
            }

            // Create the embed to send as a reply
            const embed = {
                color: 0x0099ff, // Embed color
                title: `CodeForces Stats for ${handle}`,
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
                        value: (rating || 0).toString() + ' (' + (rank || "Unrated") + ')', // Rating is usually a number
                        inline: false,
                    },
                    {
                        name: 'Max Rating',
                        value: (maxRating || 0).toString() + ' (' + (maxRank|| "Unrated") + ')', // Rating is usually a number
                        inline: false,
                    },
                    {
                        name: 'Problems Solved',
                        value: solvedProblems.toString(), // Rating is usually a number
                        inline: false,
                    },
                    {
                        name: 'Contests Given',
                        value: contestsGiven.toString(), // Rating is usually a number
                        inline: false,
                    },
                ],
                footer: {
                    text: 'Data fetched from CodeForces API',
                },
            }

            // Send the embed as a reply
            await interaction.editReply({ embeds: [embed] })
        } catch (error) {
            console.error(error)
            await interaction.editReply(
                'There was an error while fetching the data from CodeForces. Please try again later.'
            )
        }
    },
}
