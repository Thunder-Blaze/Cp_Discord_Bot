import { db } from './database.js';

function insertEntry(memId, userName, platform, rating, tag) {
    const query = `INSERT INTO users (memid, username, platform, rating, tag) VALUES (?, ?)`;
    db.run(query, [memId, userName, platform, rating, tag], function(err) {
        if (err) {
            console.error('Error inserting user:', err.message);
        } else {
            console.log(`User inserted with ${platform} username: ${userId}`);
        }
    });
}

export { insertEntry };