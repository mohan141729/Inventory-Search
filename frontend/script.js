document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const errorMessage = document.getElementById('error-message');
    const resultsTable = document.getElementById('results-table');
    const resultsBody = document.getElementById('results-body');
    const emptyState = document.getElementById('empty-state');
    const resultCount = document.getElementById('result-count');

    // Use Render URL in production, or localhost during development
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocal ? 'http://localhost:3000/search' : 'https://YOUR_RENDER_BACKEND_URL.onrender.com/search';

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide previous errors
        errorMessage.classList.add('hidden');
        
        const q = document.getElementById('q').value.trim();
        const category = document.getElementById('category').value;
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;

        // Build query string
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (category) params.append('category', category);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);

        try {
            const response = await fetch(`${API_URL}?${params.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error fetching data');
            }

            displayResults(data);
        } catch (error) {
            showError(error.message);
        }
    });

    function displayResults(data) {
        // Clear previous results
        resultsBody.innerHTML = '';
        
        // Update count badge
        resultCount.textContent = `${data.length} item${data.length !== 1 ? 's' : ''} found`;

        if (data.length === 0) {
            resultsTable.classList.add('hidden');
            emptyState.innerHTML = '<p>No results found for your search criteria.</p>';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        resultsTable.classList.remove('hidden');

        data.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><strong>${item.productName}</strong></td>
                <td><span class="category-tag">${item.category}</span></td>
                <td class="price">$${item.price.toFixed(2)}</td>
                <td>${item.supplier}</td>
            `;
            
            resultsBody.appendChild(row);
        });
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
        resultsTable.classList.add('hidden');
        emptyState.classList.add('hidden');
        resultCount.textContent = '0 items found';
    }
});
