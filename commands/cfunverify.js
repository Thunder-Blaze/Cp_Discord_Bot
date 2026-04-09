import { SlashCommandBuilder } from '@discordjs/builders'
import { getEntryByPlatformMemID } from '../database/fetchData.js'
import { deleteEntry } from '../database/deleteData.js'

export default {
    data: new SlashCommandBuilder()
        .setName('cfunverify')
        .setDescription(
            'Un-Verifies your CodeForces account and removes the CodeForces role'
        ),
    async execute(interaction) {
        await interaction.deferReply()
        const user = await getEntryByPlatformMemID(
            'codeforces',
            interaction.user.id
        )
        const member = interaction.guild.members.cache.get(interaction.user.id)
        if (user) {
            if (deleteEntry(interaction.user.id, 'codeforces')) {
                if (member.roles.cache.some((role) => role.name === user.tag)) {
                    await member.roles.remove(
                        member.roles.cache.find(
                            (role) => role.name === user.tag
                        )
                    )
                }
                await interaction.editReply({
                    content: 'Un-verified your CodeForces account',
                })
            } else
                await interaction.editReply({
                    content: 'Failed to un-verify your CodeForces account',
                })
        } else {
            await interaction.editReply({
                content: 'You are not verified as a CodeForces user',
            })
        }
    },
}
