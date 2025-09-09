const bcrypt = require('bcryptjs');
const db = require('../config/db');

const login = (req, res) => {
    console.log('Login attempt received:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
        console.log('Missing username or password');
        return res.status(400).json({ message: 'Username and password required' });
    }
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Database error' });
        }
        
        console.log('User lookup result:', user ? 'Found' : 'Not found');
        
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const passwordMatch = bcrypt.compareSync(password, user.password);
        console.log('Password comparison result:', passwordMatch);
        
        if (!passwordMatch) {
            console.log('Password mismatch for user:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        console.log('Login successful for user:', username);
        res.json({ 
            username: user.username, 
            name: user.name, 
            role: user.role 
        });
    });
};

module.exports = {
    login
};