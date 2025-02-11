import sqlite3 from 'sqlite3'

sqlite3.verbose();

const db = new sqlite3.Database("./data/mydatabase.db", (err) => {
    if (err) {
        console.error('Could not connect to SQLite database:', err.message);
        process.exit(1); // Exit process if connection fails
    }
    console.log('Connected to the SQLite database.');
});

// Function to execute a simple query (you can use it throughout the bot)
const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export { db, executeQuery };
