const express = require('express');

require('./db/connection'); 
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/supplier', supplierRoutes);
app.use('/inventory', inventoryRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
