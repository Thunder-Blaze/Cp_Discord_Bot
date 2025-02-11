import { SlashCommandBuilder } from '@discordjs/builders'
import { getEntryByPlatformMemID } from '../database/fetchData'
import { deleteEntry } from '../database/deleteData'

export default {
    data: new SlashCommandBuilder()
        .setName('cfunverify')
        .setDescription(
            'Un-Verifies your CodeForces account and removes the CodeForces role'
        ),
    async execute(interaction) {
        await interaction.deferReply()
        const user = await getEntryByPlatformMemID(interaction.user.id.id);
        if (user) {
            if (deleteEntry(interaction.user.id.id)) {
                if (member.roles.cache.some(role => role.name === user.role)) {
                    await member.roles.remove(member.roles.cache.find(role => role.name === user.role))
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
