const db = require('../db/connection');

exports.createInventory = async (req, res) => {
    try {
        const { supplier_id, product_name, quantity, price } = req.body;

        if (!supplier_id || !product_name || quantity === undefined || price === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (quantity < 0) {
            return res.status(400).json({ message: 'Quantity must be 0 or more' });
        }

        if (price <= 0) {
            return res.status(400).json({ message: 'Price must be greater than 0' });
        }

        const supplier = await db.get('SELECT * FROM suppliers WHERE id = ?', [supplier_id]);
        if (!supplier) {
            return res.status(400).json({ message: 'Invalid supplier_id' });
        }

        const sql = 'INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)';
        const result = await db.run(sql, [supplier_id, product_name, quantity, price]);

        res.status(201).json({ id: result.lastID, supplier_id, product_name, quantity, price });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getInventory = async (req, res) => {
    try {
        const sql = `
            SELECT
              s.id as supplier_id,
              s.name,
              SUM(i.quantity * i.price) AS total_inventory_value
            FROM suppliers s
            JOIN inventory i ON s.id = i.supplier_id
            GROUP BY s.id, s.name
            ORDER BY total_inventory_value DESC;
        `;
        
        const results = await db.all(sql);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
