import sqlite3 from 'sqlite3'
sqlite3.verbose()

// Create a new SQLite database (it will create the database file if it doesn't exist)
const db = new sqlite3.Database('../data/mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err)
    } else {
        console.log('Connected to SQLite database.')
    }
})

// Create a table if it doesn't exist
db.serialize(() => {
    db.run(
        'CREATE TABLE IF NOT EXISTS users (\
    id INTEGER PRIMARY KEY,\
    username TEXT,\
    platform TEXT,\
    rating INTEGER,\
    tag TEXT,\
    UNIQUE (username, platform))'
    )

    // Insert data into the table
    // const stmt = db.prepare(
    //     'INSERT INTO users (username, platform, rating, tag) VALUES (?, ?, ?, ?)'
    // )
    // stmt.run('Alice', 'codechef', 30, 'newbie')
    // stmt.run('Bob', 'codeforces', 25, '1 star')
    // stmt.finalize()

    // Query data from the table
    db.each('SELECT id, username, rating, platform FROM users', (err, row) => {
        if (err) {
            console.error(err)
        } else {
            console.log(
                `User: ${row.username}, Rating: ${row.rating}, Platform: ${row.platform}`
            )
        }
    })
})

// Close the database connection when done
db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err)
    } else {
        console.log('Database connection closed.')
    }
})
