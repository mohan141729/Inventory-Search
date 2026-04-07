const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Load inventory data
const inventoryPath = path.join(__dirname, 'data', 'inventory.json');
let inventory = [];

try {
  const data = fs.readFileSync(inventoryPath, 'utf8');
  inventory = JSON.parse(data);
} catch (err) {
  console.error("Error reading inventory data:", err);
}

app.get('/search', (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;

  let results = inventory;

  // 1. Search by product name (case-insensitive)
  if (q && q.trim() !== '') {
    const searchString = q.toLowerCase();
    results = results.filter(item => 
      item.productName.toLowerCase().includes(searchString)
    );
  }

  // 2. Filter by category
  if (category && category !== '') {
    results = results.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 3. Filter by price range
  const min = minPrice ? Number(minPrice) : null;
  const max = maxPrice ? Number(maxPrice) : null;

  if (min !== null && max !== null && min > max) {
    return res.status(400).json({ message: 'Invalid price range' });
  }

  if (min !== null) {
      results = results.filter(item => item.price >= min);
  }
  if (max !== null) {
      results = results.filter(item => item.price <= max);
  }

  res.json(results);
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
