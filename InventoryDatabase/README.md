# Inventory Database API

This is a backend service for managing an Inventory Database, built with Node.js, Express, and SQLite. 
It supports multiple suppliers and tracks their surplus stock inventory while enforcing valid rules.

## Setup Instructions

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start the server:
   \`\`\`bash
   node src/server.js
   \`\`\`
   The server runs on http://localhost:3000

## API Endpoints

### Suppliers
- **POST /supplier**
  - Payload: \`{ "name": "Supplier A", "city": "New York" }\`

### Inventory
- **POST /inventory**
  - Payload: \`{ "supplier_id": 1, "product_name": "Widgets", "quantity": 100, "price": 5.50 }\`
  - Validations:
    - \`supplier_id\` must exist.
    - \`quantity\` must be >= 0.
    - \`price\` must be > 0.
- **GET /inventory**
  - Returns all inventory grouped by supplier, sorted by total inventory value (descending).

---

## Technical Document

### Database Schema Explanation

The application uses an SQLite relational database consisting of two tables:
1. **Suppliers Tables**
   - \`id\`: INTEGER (Primary Key, Auto Increment)
   - \`name\`: TEXT 
   - \`city\`: TEXT 

2. **Inventory Table**
   - \`id\`: INTEGER (Primary Key, Auto Increment)
   - \`supplier_id\`: INTEGER (Foreign Key mapping to \`Suppliers(id)\`)
   - \`product_name\`: TEXT 
   - \`quantity\`: INTEGER (CHECK constraint >= 0)
   - \`price\`: REAL (CHECK constraint > 0)

There is a **One-to-Many** relationship between `Suppliers` and `Inventory`. One supplier can have many inventory items, and this relationship is enforced via the \`supplier_id\` Foreign Key with \`ON DELETE CASCADE\`.

### Why SQL vs NoSQL?

**I chose SQL (SQLite)** for this assignment because the requirements strictly describe structured relational entities ("One supplier → many inventory items") along with rigid data constraints (\`Quantity >= 0\`, \`Price > 0\`, and strict relationships).
Furthermore, the required query ("Return: All inventory grouped by supplier, sorted by total inventory value") is inherently cross-tabular and requires computing aggregated sorts out of numerical joins. SQL joins and constraints handle these aggregations out of the box much simpler than MongoDB typically would.

### Indexing or Optimization Suggestion

**Optimization Suggestion:** Add an index on the \`supplier_id\` column in the \`Inventory\` table. 
\`\`\`sql
CREATE INDEX idx_inventory_supplier_id ON Inventory(supplier_id);
\`\`\`
**Why:** The `GET /inventory` query involves a \`JOIN\` between the \`Suppliers\` and \`Inventory\` tables. Although a primary key automatically forms an index for \`Suppliers(id)\`, filtering/joining on \`Inventory(supplier_id)\` will cause sequential table scans on the inventory items natively. Defining a Foreign Key does not automatically create an index on the referencing table in SQLite. Thus, creating this index will optimize performance and dramatically reduce lookup times for the JOIN operation as the inventory scale grows.
