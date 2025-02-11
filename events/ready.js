import { db } from '../database/database.js'

export default {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot is online as ${client.user.tag}`);
        
        // Optional: You can check the database or perform actions
        // Example: Create a table if it doesn't exist
        db.run(
            'CREATE TABLE IF NOT EXISTS users (\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            memid TEXT,\
            username TEXT,\
            platform TEXT,\
            rating INTEGER,\
            tag TEXT,\
            UNIQUE (username, platform))'
            , (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                } else {
                    console.log('Table "users" checked/created.');
                }
            }
        );
    },
}
