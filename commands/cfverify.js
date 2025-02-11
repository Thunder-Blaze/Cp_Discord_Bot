import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    data: new SlashCommandBuilder()
        .setName('cfverify')  // Command name
        .setDescription('Verifies your CodeForces account and assigns the CodeForces role')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('CodeForces Username')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Get the handle input from the user
        const handle = interaction.options.getString('id');
        const apiUrl = `https://codeforces.com/api/user.status?handle=${handle}`;
        
        const currTime = Date.now()/1000;
        interaction.reply(`Submit a Compilation Error within 1 minute...`);
        await delay(60000);

        // const validRoles = ['newbie', 'pupil', 'specialist', 'expert', 'candidate master', 'master', 'international master', 'grandmaster', 'international grandmaster', 'legendary grandmaster'];

        try {
            const response = await fetch(apiUrl);
            let data = await response.json();
            
            // Check if the API returned a valid response
            if (!data || data.error || !data.result) {
                return await interaction.editReply(`Could not find data for handle: \`${handle}\`. Please check the handle and try again.`);
            }

            data = data.result;
            const submissions = data.filter((submission) => submission.verdict === 'COMPILATION_ERROR');
            console.log(submissions[0])
            if (submissions.length > 0 && (submissions[0].creationTimeSeconds - currTime <= 60000) && (submissions[0].creationTimeSeconds - currTime >= 0)) {
                await interaction.editReply(`Successfully verified CodeForces account \`${handle}\``);
            } else {
                return await interaction.editReply(`Failed to verify CodeForces account \`${handle}\``);
            }

            let roleName = '';

            try {
                const tempApiUrl = `https://codeforces.com/api/user.info?handles=${handle}`;
                const tempResponse = await fetch(tempApiUrl);
                let tempData = await tempResponse.json();
                roleName = tempData.result[0].rank.toLowerCase();
            } catch (error) {
                return await interaction.editReply(`An error occurred while verifying the CodeForces account. Please try again.`);
            }

            const role = interaction.guild.roles.cache.find(role => role.name === roleName);
            if (!role) {
                await interaction.guild.roles.create({
                    name: roleName,
                    // color: 'BLUE',
                });
            }

            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member) {
                return await interaction.editReply(`Could not find the member in the server. Please try again.`);
            }

            if (member.roles.cache.has(role.id)) {
                return await interaction.editReply(`You already have the \`CodeForces\` role.`);
            }

            await member.roles.add(role);
            return await interaction.editReply(`Successfully verified CodeForces account \`${handle}\` and assigned the \`${roleName}\` role.`);

        } catch (error) {
            console.error(error);
            return await interaction.editReply(`An error occurred while verifying the CodeForces account. Please try again.`);
        }
    },
};
