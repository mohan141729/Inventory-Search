# Zeerostock Inventory Search

This is a full-stack inventory search application that allows buyers to search surplus inventory across multiple suppliers. It includes a Node.js + Express backend and a clean, responsive HTML/CSS/JS vanilla frontend.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   The backend API will run at `http://localhost:3000`.

### 2. Frontend Setup
The frontend uses standard web technologies. You can open `frontend/index.html` directly in your browser or serve it using any simple local server (like the VS Code Live Server extension).

## Search Logic Explanation

The application implements an efficient in-memory filtering pipeline exposed via the `GET /search` endpoint. When a search request is triggered:

1. **Query Parsing**: The server parses `q` (product name), `category`, `minPrice`, and `maxPrice` from the query string parameters.
2. **Text Search (`q`)**: If a product name query exists, the system compares it against the inventory items using a case-insensitive substring match (`toLowerCase().includes()`). 
3. **Category Filtering**: A strict, case-insensitive match is performed against the product category.
4. **Price Range Filtering**: 
   - It validates that the minimum price is not greater than the maximum price to avoid illogical states and responds with a `400 Bad Request` if invalid.
   - It iterates through the results returning products only within the provided bounds.
5. **Chaining**: All filters evaluate concurrently. If an item fails any active condition, it is excluded. If no constraints are passed, the API gracefully scales back to returning the entire dataset.

## Performance Improvements for Large Datasets

While the current implementation works excellently for small chunks of data, an in-memory sequential array scan approaches O(N) efficiency per filter, which would scale poorly if we scaled to millions of products.

**Architectural Addition: Database Indexing with full-text search**
To handle hundreds of thousands of concurrent requests filtering massive supplier lists, we should migrate the dataset from an in-memory array to a relational database like PostgreSQL, or a specialized search engine like ElasticSearch. 

- **By utilizing DB Indexes (e.g., B-Tree index on `price` and `category`)**, the filtering step wouldn't lock the entire array but would query specific blocks rapidly achieving O(log N) lookup performance. 
- **Full-Text search indices** on product names inside PostgreSQL handles case-insensitive substring matching far faster than manually scanning arrays in JS runtimes. 
- **Pagination**: Incorporating `limit` and `offset` logic at the database layer ensures memory stays predictable because the server would handle only 20-50 documents per query rather than reading everything upfront.
