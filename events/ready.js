import { db } from '../database/database.js'
import { registerCommands } from '../deploy-commands.js'

export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot is online as ${client.user.tag}`)
        // Log the IDs of all guilds the bot is in
        let guildIds = []
        client.guilds.cache.forEach((guild) => {
            console.log(`Bot is in guild: ${guild.name} (${guild.id})`)
            guildIds.push(guild.id)
        })

        // Optionally, register commands for all guilds the bot is in
        client.guilds.cache.forEach((guild) => {
            registerCommands(guild.id)
        })
        // Optional: You can check the database or perform actions
        // Example: Create a table if it doesn't exist
        db.run(
            'CREATE TABLE IF NOT EXISTS users (\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            memid TEXT,\
            username TEXT,\
            platform TEXT,\
            rating TEXT,\
            tag TEXT,\
            UNIQUE (username, platform))',
            (err) => {
                if (err) {
                    console.error('Error creating table:', err.message)
                } else {
                    console.log('Table "users" checked/created.')
                }
            }
        )
    },
}
