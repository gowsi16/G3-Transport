const db = require('../config/db');

const getAllTrips = (req, res) => {
    db.all('SELECT * FROM trips ORDER BY date DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Parse JSON strings back to objects
        const trips = rows.map(trip => ({
            ...trip,
            incomeItems: JSON.parse(trip.incomeItems || '[]'),
            expenseItems: JSON.parse(trip.expenseItems || '[]')
        }));
        
        res.json(trips);
    });
};

const createTrip = (req, res) => {
    const { id, date, vehicle_no, driverName, from_city, to_city, revenue, incomeItems, expenseItems, notes } = req.body;
    const total_expense = expenseItems.reduce((sum, item) => sum + item.amount, 0);
    const profit = revenue - total_expense;

    const sql = `INSERT INTO trips (id, date, vehicle_no, driverName, from_city, to_city, revenue, total_expense, profit, incomeItems, expenseItems, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [id, date, vehicle_no, driverName, from_city, to_city, revenue, total_expense, profit, JSON.stringify(incomeItems), JSON.stringify(expenseItems), notes];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ message: 'Trip created successfully', id: this.lastID });
    });
};

const deleteTrip = (req, res) => {
    db.run('DELETE FROM trips WHERE id = ?', req.params.id, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Trip deleted', changes: this.changes });
    });
};

module.exports = {
    getAllTrips,
    createTrip,
    deleteTrip
};