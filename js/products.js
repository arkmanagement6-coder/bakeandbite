import Store from './store.js';
import { renderHeader, renderFooter } from './components/common.js';

let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    category: 'All',
    price: 'all',
    eggless: false,
    flavor: 'All'
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('header-root').appendChild(renderHeader());
    document.getElementById('footer-root').appendChild(renderFooter());

    allProducts = Store.getActiveProducts();
    
    // Check URL for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) currentFilters.category = catParam;

    initFilters();
    applyFilters();

    // Event Listeners
    document.getElementById('sort-by').addEventListener('change', () => applyFilters());
    document.getElementById('eggless-filter').addEventListener('change', (e) => {
        currentFilters.eggless = e.target.checked;
        applyFilters();
    });
});

function initFilters() {
    const categories = Store.getCategories();
    const catContainer = document.getElementById('category-filters');
    
    catContainer.innerHTML = `
        <div class="filter-item"><input type="radio" name="category" value="All" ${currentFilters.category === 'All' ? 'checked' : ''}> <span>All Categories</span></div>
        ${categories.map(cat => `
            <div class="filter-item"><input type="radio" name="category" value="${cat.name}" ${currentFilters.category === cat.name ? 'checked' : ''}> <span>${cat.name}</span></div>
        `).join('')}
    `;

    const flavors = [...new Set(allProducts.map(p => p.flavor))];
    const flavorContainer = document.getElementById('flavor-filters');
    flavorContainer.innerHTML = `
        <div class="filter-item"><input type="radio" name="flavor" value="All" checked> <span>All Flavors</span></div>
        ${flavors.map(f => `
            <div class="filter-item"><input type="radio" name="flavor" value="${f}"> <span>${f}</span></div>
        `).join('')}
    `;

    // Listen for radio changes
    document.querySelectorAll('input[name="category"]').forEach(input => {
        input.addEventListener('change', (e) => {
            currentFilters.category = e.target.value;
            applyFilters();
        });
    });

    document.querySelectorAll('input[name="price"]').forEach(input => {
        input.addEventListener('change', (e) => {
            currentFilters.price = e.target.value;
            applyFilters();
        });
    });

    document.querySelectorAll('input[name="flavor"]').forEach(input => {
        input.addEventListener('change', (e) => {
            currentFilters.flavor = e.target.value;
            applyFilters();
        });
    });
}

function applyFilters() {
    filteredProducts = allProducts.filter(p => {
        const catMatch = currentFilters.category === 'All' || p.category === currentFilters.category;
        const flavorMatch = currentFilters.flavor === 'All' || p.flavor === currentFilters.flavor;
        const egglessMatch = !currentFilters.eggless || p.eggless === true;
        
        let priceMatch = true;
        if (currentFilters.price === '0-500') priceMatch = p.discountPrice <= 500;
        else if (currentFilters.price === '500-1000') priceMatch = p.discountPrice > 500 && p.discountPrice <= 1000;
        else if (currentFilters.price === '1000+') priceMatch = p.discountPrice > 1000;

        return catMatch && flavorMatch && egglessMatch && priceMatch;
    });

    // Apply Sorting
    const sortBy = document.getElementById('sort-by').value;
    if (sortBy === 'low-high') filteredProducts.sort((a, b) => a.discountPrice - b.discountPrice);
    else if (sortBy === 'high-low') filteredProducts.sort((a, b) => b.discountPrice - a.discountPrice);
    else if (sortBy === 'popular') filteredProducts.sort((a, b) => b.rating - a.rating);

    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('products-list-grid');
    const noResults = document.getElementById('no-products');
    const countText = document.getElementById('product-count');

    countText.innerText = `Showing ${filteredProducts.length} products`;

    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    grid.innerHTML = filteredProducts.map(product => `
        <div class="glass-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="position: relative; height: 220px;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                ${product.eggless ? `
                    <div style="position: absolute; bottom: 10px; right: 10px; width: 24px; height: 24px; border: 2px solid #2E7D32; padding: 2px; background: white; border-radius: 4px;">
                        <div style="width: 100%; height: 100%; background: #2E7D32; border-radius: 50%;"></div>
                    </div>
                ` : ''}
            </div>
            <div style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
                <h3 style="font-size: 1.1rem; margin-bottom: 8px; font-family: var(--font-sans); font-weight: 700;">${product.name}</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px;">${product.category} • ${product.flavor}</p>
                
                <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 20px;">
                    <span style="font-size: 1.2rem; font-weight: 700; color: var(--primary);">₹${product.discountPrice}</span>
                    ${product.discountPrice < product.price ? `
                        <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.85rem;">₹${product.price}</span>
                    ` : ''}
                </div>

                <div style="display: flex; gap: 8px; margin-top: auto;">
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}" style="flex: 1; padding: 8px; font-size: 0.85rem;">Add to Cart</button>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-outline" style="padding: 8px; font-size: 0.85rem;">Details</a>
                </div>
            </div>
        </div>
    `).join('');

    // Re-attach add to cart events
    grid.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const product = Store.getProductById(id);
            Store.addToCart(product, 1);
            btn.innerText = 'Added!';
            btn.style.backgroundColor = 'var(--success)';
            setTimeout(() => {
                btn.innerText = 'Add to Cart';
                btn.style.backgroundColor = 'var(--primary)';
            }, 1000);
        });
    });
}
