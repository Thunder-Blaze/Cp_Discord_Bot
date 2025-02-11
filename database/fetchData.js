const { executeQuery } = require('../database/database');

async function getEntryByPlatformMemID(platform, memId) {
    try {
        const user = await executeQuery(`SELECT * FROM users WHERE id = ? AND platform = ?`, [platform, memId]);
        return user[0] || null; // Return the first user if found, otherwise null
    } catch (err) {
        console.error('Error fetching user:', err);
        return null;
    }
}

export { getEntryByPlatformMemID };