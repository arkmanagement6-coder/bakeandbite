import Store from './store.js';
import { renderHeader, renderFooter } from './components/common.js';

document.addEventListener('DOMContentLoaded', () => {
    // Render Common Components
    document.getElementById('header-root').appendChild(renderHeader());
    document.getElementById('footer-root').appendChild(renderFooter());

    renderCategories();
    renderBestSellers();
    renderReviews();
});

function renderCategories() {
    const categories = Store.getCategories();
    const grid = document.getElementById('category-grid');
    
    grid.innerHTML = categories.map(cat => `
        <a href="products.html?category=${cat.name}" class="glass-card" style="text-align: center; padding: 20px; transition: transform 0.3s ease;">
            <div style="width: 100%; aspect-ratio: 1; border-radius: 50%; overflow: hidden; margin-bottom: 15px; border: 4px solid white; box-shadow: var(--shadow-sm);">
                <img src="${cat.image}" alt="${cat.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h4 style="font-family: var(--font-sans); font-size: 1rem;">${cat.name}</h4>
        </a>
    `).join('');

    // Add hover effect
    grid.querySelectorAll('a').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });
}

function renderBestSellers() {
    const products = Store.getActiveProducts().slice(0, 4);
    const grid = document.getElementById('best-sellers-grid');
    
    grid.innerHTML = products.map(product => `
        <div class="glass-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
            <div style="position: relative; height: 250px;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                ${product.discountPrice < product.price ? `
                    <span style="position: absolute; top: 15px; left: 15px; background: var(--accent); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">SALE</span>
                ` : ''}
            </div>
            <div style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="font-size: 0.8rem; color: var(--accent); font-weight: 600; text-transform: uppercase;">${product.category}</span>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span style="font-size: 0.85rem; font-weight: 600;">${product.rating}</span>
                    </div>
                </div>
                <h3 style="font-size: 1.2rem; margin-bottom: 10px; font-family: var(--font-sans); font-weight: 700;">${product.name}</h3>
                <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 20px;">
                    <span style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">₹${product.discountPrice}</span>
                    ${product.discountPrice < product.price ? `
                        <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.9rem;">₹${product.price}</span>
                    ` : ''}
                </div>
                <div style="display: flex; gap: 10px; margin-top: auto;">
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}" style="flex: 1; padding: 10px; font-size: 0.9rem;">Add to Cart</button>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-outline" style="padding: 10px; font-size: 0.9rem;">Details</a>
                </div>
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const product = Store.getProductById(id);
            Store.addToCart(product, 1);
            
            // Visual Feedback
            const originalText = btn.innerText;
            btn.innerText = 'Added!';
            btn.style.backgroundColor = 'var(--success)';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = 'var(--primary)';
            }, 1500);
        });
    });
}

function renderReviews() {
    const reviews = Store.get('REVIEWS').filter(r => r.approved).slice(0, 3);
    const grid = document.getElementById('reviews-grid');
    
    grid.innerHTML = reviews.map(review => `
        <div class="glass-card" style="padding: 30px;">
            <div style="display: flex; gap: 2px; margin-bottom: 15px;">
                ${Array(5).fill(0).map((_, i) => `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${i < review.rating ? '#FFD700' : 'none'}" stroke="#FFD700" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                `).join('')}
            </div>
            <p style="font-style: italic; margin-bottom: 20px; color: var(--text-main);">"${review.comment}"</p>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">${review.userName.charAt(0)}</div>
                <span style="font-weight: 700; font-size: 0.9rem;">${review.userName}</span>
            </div>
        </div>
    `).join('');
}
