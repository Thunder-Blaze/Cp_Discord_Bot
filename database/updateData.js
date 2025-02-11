const { executeQuery } = require('../database/database');

async function updateEntryByPlatformMemID(username, rating, tag, platform, memId) {
    try {
        await executeQuery(`UPDATE users SET username = ? AND rating = ? AND tag = ? WHERE platform = ? AND memid = ?`, [username, rating, tag, platform, memId]);
    } catch (err) {
        console.error('Error fetching user:', err);
    }
}

export { updateEntryByPlatformMemID };