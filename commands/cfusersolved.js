import fetch from 'node-fetch'
import { SlashCommandBuilder } from '@discordjs/builders'
import { ActionRowBuilder, ButtonBuilder } from 'discord.js'
import { getEntryByPlatformMemID } from '../database/fetchData.js'

export default {
    data: new SlashCommandBuilder()
        .setName('cfusersolved')
        .setDescription(
            'Prints detailed info for the given CodeForces username'
        )
        .addStringOption((option) =>
            option
                .setName('id')
                .setDescription('CodeForces Username')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply()
        let handle = interaction.options.getString('id') // Get username if provided
        const userId = interaction.user.id // Discord User ID
        
        // If no ID is provided, fetch associated username from the database
        if (!handle) {
            const row = await getEntryByPlatformMemID('codeforces', userId)

            if (row) {
                handle = row.username
            } else {
                return await interaction.editReply('No associated Codeforces username found for this user.')
            }
        }

        if (handle[0]=='<'){
            handle = handle.slice(2).slice(0,-1);
            const row = await getEntryByPlatformMemID('codeforces', handle)

            if (row) {
                handle = row.username
            } else {
                return await interaction.editReply('No associated Codeforces username found for this user.')
            }
        }

        try {
            // Fetch user info
            const userResponse = await fetch(
                `https://codeforces.com/api/user.info?handles=${handle}`
            )
            const userData = await userResponse.json()
            if (!userData || userData.status !== 'OK') {
                return await interaction.editReply(
                    `Could not find data for handle: \`${handle}\`.`
                )
            }
            const user = userData.result[0]

            // Fetch user submissions
            const submissionsResponse = await fetch(
                `https://codeforces.com/api/user.status?handle=${handle}`
            )
            const submissionsData = await submissionsResponse.json()
            if (!submissionsData || submissionsData.status !== 'OK') {
                return await interaction.editReply(
                    `Could not fetch submissions for: \`${handle}\`.`
                )
            }

            let solvedProblems = new Set()
            let difficultyCount = {}
            let topicCount = {}

            submissionsData.result.forEach((submission) => {
                if (submission.verdict === 'OK') {
                    const problemId = `${submission.problem.contestId}-${submission.problem.index}`
                    solvedProblems.add(problemId)

                    // Count problems by difficulty
                    if (submission.problem.rating) {
                        difficultyCount[submission.problem.rating] =
                            (difficultyCount[submission.problem.rating] || 0) +
                            1
                    }

                    // Count problems by topic
                    if (submission.problem.tags) {
                        submission.problem.tags.forEach((tag) => {
                            topicCount[tag] = (topicCount[tag] || 0) + 1
                        })
                    }
                }
            })

            const difficultyFields = Object.entries(difficultyCount)
                .sort((a, b) => a[0] - b[0])
                .map(([difficulty, count]) => ({
                    name: `Difficulty ${difficulty}`,
                    value: count.toString(),
                    inline: false,
                }))

            const topicFields = Object.entries(topicCount)
                .sort((a, b) => b[1] - a[1])
                .map(([topic, count]) => ({
                    name: topic,
                    value: count.toString(),
                    inline: true,
                }))

            const baseEmbed = {
                color: 0x0099ff,
                thumbnail: { url: user.titlePhoto },
                footer: { text: 'Data fetched from CodeForces API' },
            }

            let currentPage = 0
            const embeds = [
                {
                    title: `CodeForces Difficulty Wise Stats for ${handle}`,
                    ...baseEmbed,
                    fields: difficultyFields,
                },
                {
                    title: `CodeForces Topic Wise Stats for ${handle}`,
                    ...baseEmbed,
                    fields: topicFields,
                },
            ]

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('⬅️ Prev')
                    .setStyle('Primary'),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next ➡️')
                    .setStyle('Primary')
            )

            const message = await interaction.editReply({
                embeds: [embeds[currentPage]],
                components: [buttons],
            })

            const filter = (i) =>
                ['prev', 'next'].includes(i.customId) &&
                i.user.id === interaction.user.id
            const collector = message.createMessageComponentCollector({
                filter,
                time: 60000,
            })

            collector.on('collect', async (i) => {
                if (i.customId === 'prev') {
                    currentPage =
                        (currentPage - 1 + embeds.length) % embeds.length
                } else {
                    currentPage = (currentPage + 1) % embeds.length
                }
                await i.update({
                    embeds: [embeds[currentPage]],
                    components: [buttons],
                })
            })

            collector.on('end', async () => {
                await message.edit({ components: [] })
            })
        } catch (error) {
            console.error(error)
            await interaction.editReply(
                'Error fetching data from CodeForces. Please try again later.'
            )
        }
    },
}
