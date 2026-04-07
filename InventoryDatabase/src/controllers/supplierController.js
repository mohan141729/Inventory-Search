const db = require('../db/connection');

exports.createSupplier = async (req, res) => {
    try {
        const { name, city } = req.body;

        if (!name || !city) {
            return res.status(400).json({ message: 'Name and city are required' });
        }

        const sql = 'INSERT INTO suppliers (name, city) VALUES (?, ?)';
        const result = await db.run(sql, [name, city]);

        res.status(201).json({ id: result.lastID, name, city });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
