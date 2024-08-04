const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./railway.db');

// Create tables
db.serialize(() => {
    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'user')) NOT NULL
        )
    `);

    // Create trains table
    db.run(`
        CREATE TABLE IF NOT EXISTS trains (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            train_name TEXT NOT NULL,
            source TEXT NOT NULL,
            destination TEXT NOT NULL,
            seat_capacity INTEGER NOT NULL,
            available_seats INTEGER NOT NULL,
            arrival_time_at_source TEXT NOT NULL,
            arrival_time_at_destination TEXT NOT NULL
        )
    `);

    // Create bookings table
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            train_id INTEGER NOT NULL,
            no_of_seats INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (train_id) REFERENCES trains(id)
        )
    `);
});

db.close(err => {
    if (err) {
        console.error('Error closing database connection:', err.message);
    }
});
