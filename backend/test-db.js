const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to database successfully');
});

// Test if users table exists and has data
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (err) {
        console.error('Error checking users table:', err.message);
        return;
    }
    
    if (!row) {
        console.log('Users table does not exist. Creating it...');
        createUsersTable();
    } else {
        console.log('Users table exists. Checking for users...');
        checkUsers();
    }
});

function createUsersTable() {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        name TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
            return;
        }
        console.log('Users table created successfully');
        insertDefaultUsers();
    });
}

function insertDefaultUsers() {
    const salt = bcrypt.genSaltSync(10);
    const adminPass = bcrypt.hashSync('password123', salt);
    const empPass = bcrypt.hashSync('password123', salt);
    
    const insertUser = `INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)`;
    
    db.run(insertUser, ['admin', adminPass, 'admin', 'Admin User'], (err) => {
        if (err) console.error('Error inserting admin user:', err.message);
        else console.log('Admin user created successfully');
    });
    
    db.run(insertUser, ['employee', empPass, 'employee', 'Employee User'], (err) => {
        if (err) console.error('Error inserting employee user:', err.message);
        else console.log('Employee user created successfully');
        
        // Close database after all operations
        setTimeout(() => {
            db.close((err) => {
                if (err) console.error('Error closing database:', err.message);
                else console.log('Database connection closed');
            });
        }, 1000);
    });
}

function checkUsers() {
    db.all("SELECT username, role, name FROM users", (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return;
        }
        
        console.log('Existing users:');
        rows.forEach(user => {
            console.log(`- ${user.username} (${user.role}): ${user.name}`);
        });
        
        if (rows.length === 0) {
            console.log('No users found. Inserting default users...');
            insertDefaultUsers();
        } else {
            db.close((err) => {
                if (err) console.error('Error closing database:', err.message);
                else console.log('Database connection closed');
            });
        }
    });
}
