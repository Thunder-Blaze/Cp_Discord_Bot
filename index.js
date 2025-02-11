import { Client, GatewayIntentBits } from 'discord.js' // Updated import
// import { token } from './config/config.json' assert { type: 'json' };
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

// Updated intents to use GatewayIntentBits from discord.js v14+
const client = new Client({
    intents: [GatewayIntentBits.Guilds], // Use GatewayIntentBits instead of Intents.FLAGS
})

// Load commands
client.commands = new Map()
const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'))
for (const file of commandFiles) {
    import(`./commands/${file}`).then((commandModule) => {
        const command = commandModule.default
        client.commands.set(command.data.name, command)
    })
}

// Load events
const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'))
for (const file of eventFiles) {
    import(`./events/${file}`).then((eventModule) => {
        const event = eventModule.default
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    })
}

client.login(process.env.BOT_TOKEN)
