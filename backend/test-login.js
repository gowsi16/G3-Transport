const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        return;
    }
    console.log('Connected to SQLite database');
    
    // Create users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
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
        
        // Check if users exist
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (err) {
                console.error('Error checking users:', err.message);
                return;
            }
            
            if (row.count === 0) {
                console.log('No users found. Creating default users...');
                const salt = bcrypt.genSaltSync(10);
                const adminPass = bcrypt.hashSync('password123', salt);
                const empPass = bcrypt.hashSync('password123', salt);
                
                const insertUser = `INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)`;
                
                db.run(insertUser, ['admin', adminPass, 'admin', 'Admin User'], (err) => {
                    if (err) console.error('Error creating admin:', err.message);
                    else console.log('Admin user created');
                });
                
                db.run(insertUser, ['employee', empPass, 'employee', 'Employee User'], (err) => {
                    if (err) console.error('Error creating employee:', err.message);
                    else console.log('Employee user created');
                });
            } else {
                console.log(`Found ${row.count} existing users`);
            }
        });
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Database error' });
        }
        
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        const passwordMatch = bcrypt.compareSync(password, user.password);
        console.log('Password match:', passwordMatch);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        
        console.log('Login successful for:', username);
        res.json({ 
            username: user.username, 
            name: user.name, 
            role: user.role 
        });
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
    console.log('Try logging in with:');
    console.log('Username: admin, Password: password123');
    console.log('Username: employee, Password: password123');
});
