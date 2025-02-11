const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database (it will create the database file if it doesn't exist)
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create a table if it doesn't exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, rating INTEGER, tag TEXT)');

  // Insert data into the table
  const stmt = db.prepare('INSERT INTO users (name, age) VALUES (?, ?)');
  stmt.run('Alice', 30, 'newbie');
  stmt.run('Bob', 25, 'newbie');
  stmt.finalize();

  // Query data from the table
  db.each('SELECT id, name, age FROM users', (err, row) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`User: ${row.name}, Age: ${row.age}`);
    }
  });
});

// Close the database connection when done
db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err);
  } else {
    console.log('Database connection closed.');
  }
});