import { db } from './database.js';

function deleteEntry(memId, platform) {
    const query = `DELETE FROM users WHERE memid=? AND platform=?)`;
    db.run(query, [memId, platform], function(err) {
        if (err) {
            console.error('Error deleting Entry:', err.message);
            return true;
        } else {
            console.log(`Entry deleted`);
            return false;
        }
    });
}

const deleteAllEntries = () => {
    const query = `DELETE FROM users`;
    db.run(query, [], function(err) {
        if (err) {
            console.error('Error deleting users:', err.message);
        } else {
            console.log(`Suceessfully deleted all users`);
        }
    });
}

const deleteTable = () => {
    const query = `DROP TABLE users`;
    db.run(query, [], function(err) {
        if (err) {
            console.error('Error deleting table users:', err.message);
        } else {
            console.log(`Suceessfully deleted table users`);
        }
    });
}

export { deleteAllEntries, deleteTable, deleteEntry };