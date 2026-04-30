import Store from './store.js';
import { renderHeader, renderFooter } from './components/common.js';

let currentProduct = null;
let currentQty = 1;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('header-root').appendChild(renderHeader());
    document.getElementById('footer-root').appendChild(renderFooter());

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        window.location.href = 'products.html';
        return;
    }

    currentProduct = Store.getProductById(id);
    if (!currentProduct) {
        window.location.href = 'products.html';
        return;
    }

    renderProductDetails();
    setupEventListeners();
});

function renderProductDetails() {
    document.title = `${currentProduct.name} | Bake & Bite`;
    document.getElementById('main-image').src = currentProduct.image;
    document.getElementById('product-cat').innerText = currentProduct.category;
    document.getElementById('product-name').innerText = currentProduct.name;
    document.getElementById('product-rating').innerText = currentProduct.rating;
    document.getElementById('product-price').innerText = `₹${currentProduct.discountPrice}`;
    document.getElementById('product-desc').innerText = currentProduct.description;
    
    if (currentProduct.discountPrice < currentProduct.price) {
        document.getElementById('product-old-price').innerText = `₹${currentProduct.price}`;
    }

    // Set default delivery date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('delivery-date').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('delivery-date').min = new Date().toISOString().split('T')[0];
}

function setupEventListeners() {
    document.getElementById('qty-plus').addEventListener('click', () => {
        currentQty++;
        document.getElementById('qty-val').innerText = currentQty;
    });

    document.getElementById('qty-minus').addEventListener('click', () => {
        if (currentQty > 1) {
            currentQty--;
            document.getElementById('qty-val').innerText = currentQty;
        }
    });

    document.getElementById('btn-add-to-cart').addEventListener('click', () => {
        const options = getSelectionOptions();
        Store.addToCart(currentProduct, currentQty, options);
        alert('Added to cart successfully!');
    });

    document.getElementById('btn-buy-now').addEventListener('click', () => {
        const options = getSelectionOptions();
        Store.clearCart();
        Store.addToCart(currentProduct, currentQty, options);
        window.location.href = 'cart.html';
    });
}

function getSelectionOptions() {
    return {
        weight: document.querySelector('input[name="weight"]:checked').value,
        eggless: document.getElementById('is-eggless').checked,
        deliveryDate: document.getElementById('delivery-date').value,
        timeSlot: document.getElementById('time-slot').value,
        cakeMessage: document.getElementById('cake-message').value
    };
}
