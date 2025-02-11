import puppeteer from 'puppeteer';
import { SlashCommandBuilder } from '@discordjs/builders';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    data: new SlashCommandBuilder()
        .setName('ccverify')
        .setDescription('Verifies your CodeChef account and assigns the CodeChef role')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('CodeChef Username')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const handle = interaction.options.getString('id');
        const profileUrl = `https://www.codechef.com/users/${handle}`;
        
        interaction.editReply(`Submit a Compilation Error within 1 minute on CodeChef...`);
        await delay(60000);

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(profileUrl, { waitUntil: 'networkidle2' });
            let stars;

            await page.waitForSelector('.rating-star', { timeout: 10000 });
            await page.waitForSelector('tbody tr', { timeout: 10000 });

            stars = await page.evaluate(() => {
                console.log("well")
                const starElement = document.querySelector('.rating-star');
                return starElement ? starElement.innerText.trim() : 'UnRated';
            });

            const submissions = await page.evaluate(() => {
                let rows = document.querySelectorAll('.dataTable tbody tr');
                let results = [];
                let cols = rows[0].querySelectorAll('td');
                if (cols.length > 3) {
                    let verdict = cols[2].innerHTML.trim().includes('compilation error') ? true : false;
                    let timestamp = cols[0].innerHTML.trim();
                    timestamp = (timestamp.includes('sec') || timestamp.includes('1 min') || timestamp.includes('2 min')) ? true : false;
                    results.push({ verdict, timestamp });
                }
                return results;
            });

            console.log(submissions)
            
            if (submissions[0].verdict == true && submissions[0].timestamp == true) {
                await interaction.editReply(`Successfully verified CodeChef account \`${handle}\``);
            } else {
                return await interaction.editReply(`Failed to verify CodeChef account \`${handle}\``);
            }

            let roleName = stars;
            const role = interaction.guild.roles.cache.find(role => role.name === roleName);
            if (!role) {
                await interaction.guild.roles.create({ name: roleName });
            }

            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member) {
                return await interaction.editReply(`Could not find the member in the server. Please try again.`);
            }

            if (member.roles.cache.has(role.id)) {
                return await interaction.editReply(`You already have the \`CodeChef Verified\` role.`);
            }

            await member.roles.add(role);
            return await interaction.editReply(`Successfully verified CodeChef account \`${handle}\` and assigned the \`${roleName}\` role.`);
        } catch (error) {
            console.error(error);
            return await interaction.editReply(`An error occurred while verifying the CodeChef account. Please try again.`);
        }
    },
};
