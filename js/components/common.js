import Store from '../store.js';

export function renderHeader() {
    const header = document.createElement('header');
    const cart = Store.getCart();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const user = Store.getCurrentUser();

    header.innerHTML = `
        <div class="container nav-container">
            <a href="index.html" class="logo">Bake & Bite</a>
            
            <nav class="nav-links">
                <a href="index.html">Home</a>
                <a href="products.html">Products</a>
                <a href="about.html">About Us</a>
                <a href="custom-order.html">Custom Cakes</a>
                <a href="contact.html">Contact</a>
            </nav>

            <div class="nav-icons">
                <div class="search-trigger">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <a href="account.html" class="user-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </a>
                <a href="cart.html" class="cart-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <span class="cart-count" id="cart-count-badge">${cartCount}</span>
                </a>
                <div class="mobile-menu-toggle" style="display: none;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </div>
            </div>
        </div>
    `;

    // Listen for cart updates
    window.addEventListener('cart-updated', () => {
        const newCart = Store.getCart();
        const newCount = newCart.reduce((acc, item) => acc + item.quantity, 0);
        const badge = document.getElementById('cart-count-badge');
        if (badge) badge.innerText = newCount;
    });

    return header;
}

export function renderFooter() {
    const footer = document.createElement('footer');
    footer.style.backgroundColor = 'var(--primary)';
    footer.style.color = 'white';
    footer.style.padding = '60px 0 20px';
    footer.style.marginTop = '80px';

    footer.innerHTML = `
        <div class="container">
            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px;">
                <div>
                    <h3 style="color: white; margin-bottom: 20px;">Bake & Bite</h3>
                    <p style="opacity: 0.8; font-size: 0.9rem;">Freshly baked happiness delivered to your doorstep. We use only the finest ingredients for our cakes and pastries.</p>
                </div>
                <div>
                    <h4 style="color: white; margin-bottom: 20px;">Quick Links</h4>
                    <ul style="opacity: 0.8; font-size: 0.9rem;">
                        <li style="margin-bottom: 10px;"><a href="index.html">Home</a></li>
                        <li style="margin-bottom: 10px;"><a href="products.html">Our Products</a></li>
                        <li style="margin-bottom: 10px;"><a href="custom-order.html">Custom Cakes</a></li>
                        <li style="margin-bottom: 10px;"><a href="about.html">About Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: white; margin-bottom: 20px;">Policies</h4>
                    <ul style="opacity: 0.8; font-size: 0.9rem;">
                        <li style="margin-bottom: 10px;"><a href="privacy.html">Privacy Policy</a></li>
                        <li style="margin-bottom: 10px;"><a href="terms.html">Terms & Conditions</a></li>
                        <li style="margin-bottom: 10px;"><a href="refund.html">Refund Policy</a></li>
                        <li style="margin-bottom: 10px;"><a href="shipping.html">Shipping Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: white; margin-bottom: 20px;">Contact Us</h4>
                    <ul style="opacity: 0.8; font-size: 0.9rem;">
                        <li style="margin-bottom: 10px;">Email: hello@bakeandbite.com</li>
                        <li style="margin-bottom: 10px;">Phone: +91 8821885577</li>
                        <li style="margin-bottom: 10px;">Address: 123 Bakery Lane, Sweet City</li>
                    </ul>
                </div>
            </div>
            <div style="text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); opacity: 0.6; font-size: 0.8rem;">
                &copy; 2026 Bake & Bite. All rights reserved.
            </div>
        </div>
    `;

    return footer;
}
