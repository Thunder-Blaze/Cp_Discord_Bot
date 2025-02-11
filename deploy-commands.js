import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
// import { clientId, guildId, token } from './config/config.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Ping the bot!'),
    new SlashCommandBuilder().setName('hello').setDescription('Say hello!'),
    new SlashCommandBuilder().setName('ccuserinfo').setDescription('Prints info for the given CodeChef username')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('CodeChef Username')
                .setRequired(true)
        ),
    new SlashCommandBuilder().setName('ccuserpfp').setDescription('Fetches PFP for the given CodeChef username')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('CodeChef Username')
                .setRequired(true)
        ),
    new SlashCommandBuilder().setName('cfuserinfo').setDescription('Prints info for the given CodeForces username')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('CodeForces Username')
                .setRequired(true)
        ),
    new SlashCommandBuilder().setName('cfuserpfp').setDescription('Fetches PFP for the given CodeForces username')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('CodeForces Username')
                .setRequired(true)
        ),
    new SlashCommandBuilder().setName('cfverify').setDescription('Verifies your CodeForces account and assigns the CodeForces role')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('CodeForces Username')
                .setRequired(true)
        ),
]
.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
