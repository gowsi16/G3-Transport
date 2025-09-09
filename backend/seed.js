const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');

const dbPath = './database.sqlite';

// Delete existing database file to start fresh
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database for seeding.');
    }
});

const tripsData = [
  {
    "id": "BILL-001", "date": "2024-05-13", "driverName": "Karthik", "from_city": "Chennai", "to_city": "Bengaluru", "vehicle_no": "AP29AY4288", "revenue": 45827,
    "incomeItems": JSON.stringify([{ "description": "Chennai - Bengaluru", "amount": 29649 }, { "description": "Bengaluru - Chennai", "amount": 16178 }]),
    "expenseItems": JSON.stringify([
      { "description": "Pooja Expense", "amount": 149 }, { "description": "Salem Commission", "amount": 2420 }, { "description": "Unloading Charges", "amount": 5413 },
      { "description": "Police Charge", "amount": 285 }, { "description": "Parking Fee", "amount": 767 }, { "description": "Tarpaulin Rent", "amount": 591 },
      { "description": "Driver Batta", "amount": 7668 }, { "description": "Toll Charges", "amount": 1789 }, { "description": "Fuel", "amount": 18192 },
      { "description": "Other Expense", "amount": 427 }
    ]),
    "notes": "Auto-generated trip data."
  },
  {
    "id": "BILL-100", "date": "2025-07-01", "driverName": "Suresh", "from_city": "Hyderabad", "to_city": "Pune", "vehicle_no": "TS23AY3341", "revenue": 38680,
    "incomeItems": JSON.stringify([{ "description": "Hyderabad - Pune", "amount": 20875 }, { "description": "Pune - Hyderabad", "amount": 17805 }]),
    "expenseItems": JSON.stringify([
      { "description": "Pooja Expense", "amount": 109 }, { "description": "Salem Commission", "amount": 1422 }, { "description": "Unloading Charges", "amount": 8387 },
      { "description": "Police Charge", "amount": 415 }, { "description": "Parking Fee", "amount": 141 }, { "description": "Driver Batta", "amount": 6828 },
      { "description": "Toll Charges", "amount": 2519 }, { "description": "Fuel", "amount": 13919 }, { "description": "Other Expense", "amount": 531 }
    ]),
    "notes": "Auto-generated trip data."
  }
];

db.serialize(() => {
    // Create Users table
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        name TEXT
    )`, (err) => {
        if (err) console.error("Error creating users table", err.message);
        else {
            console.log("Users table created.");
            const salt = bcrypt.genSaltSync(10);
            const adminPass = bcrypt.hashSync('password123', salt);
            const empPass = bcrypt.hashSync('password123', salt);
            const insertUser = `INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)`;
            db.run(insertUser, ['admin', adminPass, 'admin', 'Admin User'], (err) => {
                if (err) console.error("Error inserting admin user:", err.message);
                else console.log("Admin user created successfully.");
            });
            db.run(insertUser, ['employee', empPass, 'employee', 'Employee User'], (err) => {
                if (err) console.error("Error inserting employee user:", err.message);
                else console.log("Employee user created successfully.");
            });
        }
    });

    // Create Trips table
    db.run(`CREATE TABLE trips (
        id TEXT PRIMARY KEY,
        date TEXT,
        vehicle_no TEXT,
        driverName TEXT,
        from_city TEXT,
        to_city TEXT,
        revenue REAL,
        total_expense REAL,
        profit REAL,
        incomeItems TEXT,
        expenseItems TEXT,
        notes TEXT
    )`, (err) => {
        if (err) console.error("Error creating trips table", err.message);
        else {
            console.log("Trips table created.");
            const insertTrip = `INSERT INTO trips (id, date, vehicle_no, driverName, from_city, to_city, revenue, total_expense, profit, incomeItems, expenseItems, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            tripsData.forEach(trip => {
                const total_expense = JSON.parse(trip.expenseItems).reduce((sum, item) => sum + item.amount, 0);
                const profit = trip.revenue - total_expense;
                db.run(insertTrip, [trip.id, trip.date, trip.vehicle_no, trip.driverName, trip.from_city, trip.to_city, trip.revenue, total_expense, profit, trip.incomeItems, trip.expenseItems, trip.notes]);
            });
            console.log(`${tripsData.length} sample trips inserted.`);
        }
    });

    db.close((err) => {
        if (err) console.error('Error closing database', err.message);
        else console.log('Database connection closed.');
    });
});