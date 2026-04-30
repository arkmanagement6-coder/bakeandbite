import Store from './store.js';
import { renderHeader, renderFooter } from './components/common.js';

let appliedCoupon = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('header-root').appendChild(renderHeader());
    document.getElementById('footer-root').appendChild(renderFooter());

    renderCart();

    document.getElementById('apply-coupon').addEventListener('click', handleCoupon);
});

function renderCart() {
    const cart = Store.getCart();
    const body = document.getElementById('cart-items-body');
    const emptyDiv = document.getElementById('empty-cart');
    const contentDiv = document.getElementById('cart-content');

    if (cart.length === 0) {
        body.parentElement.style.display = 'none';
        emptyDiv.style.display = 'block';
        contentDiv.style.flexDirection = 'column';
        return;
    }

    body.innerHTML = cart.map((item, index) => `
        <tr>
            <td>
                <div class="flex" style="gap: 15px;">
                    <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm);">
                    <div>
                        <h4 style="font-family: var(--font-sans); margin-bottom: 5px;">${item.name}</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">
                            ${item.options.weight} • ${item.options.eggless ? 'Eggless' : 'With Egg'}<br>
                            Delivery: ${item.options.deliveryDate} (${item.options.timeSlot})
                        </p>
                    </div>
                </div>
            </td>
            <td>₹${item.discountPrice}</td>
            <td>
                <div class="qty-control">
                    <button class="cart-qty-minus" data-index="${index}">-</button>
                    <span style="padding: 0 10px;">${item.quantity}</span>
                    <button class="cart-qty-plus" data-index="${index}">+</button>
                </div>
            </td>
            <td style="font-weight: 700;">₹${item.discountPrice * item.quantity}</td>
            <td>
                <button class="remove-item" data-index="${index}" style="background: transparent; border: none; color: var(--error); cursor: pointer;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        </tr>
    `).join('');

    setupCartEvents();
    calculateTotal();
}

function setupCartEvents() {
    document.querySelectorAll('.cart-qty-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = btn.getAttribute('data-index');
            const cart = Store.getCart();
            Store.updateCartQuantity(index, cart[index].quantity + 1);
            renderCart();
        });
    });

    document.querySelectorAll('.cart-qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = btn.getAttribute('data-index');
            const cart = Store.getCart();
            Store.updateCartQuantity(index, cart[index].quantity - 1);
            renderCart();
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = btn.getAttribute('data-index');
            Store.removeFromCart(index);
            renderCart();
        });
    });
}

function calculateTotal() {
    const cart = Store.getCart();
    const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const delivery = subtotal > 1000 || subtotal === 0 ? 0 : 50;
    
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percentage') {
            discount = Math.round(subtotal * (appliedCoupon.value / 100));
        } else {
            discount = appliedCoupon.value;
        }
    }

    document.getElementById('summary-subtotal').innerText = `₹${subtotal}`;
    document.getElementById('summary-tax').innerText = `₹${tax}`;
    document.getElementById('summary-delivery').innerText = delivery === 0 ? 'FREE' : `₹${delivery}`;
    
    if (discount > 0) {
        document.getElementById('discount-row').style.display = 'flex';
        document.getElementById('summary-discount').innerText = `-₹${discount}`;
    } else {
        document.getElementById('discount-row').style.display = 'none';
    }

    document.getElementById('summary-total').innerText = `₹${subtotal + tax + delivery - discount}`;
}

function handleCoupon() {
    const code = document.getElementById('coupon-code').value.trim().toUpperCase();
    const msg = document.getElementById('coupon-msg');
    const coupons = Store.get('COUPONS');
    const subtotal = Store.getCart().reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);

    const coupon = coupons.find(c => c.code === code && c.active);

    if (!coupon) {
        msg.innerText = 'Invalid coupon code';
        msg.style.color = 'var(--error)';
        appliedCoupon = null;
    } else if (subtotal < coupon.minOrder) {
        msg.innerText = `Minimum order amount ₹${coupon.minOrder} required`;
        msg.style.color = 'var(--error)';
        appliedCoupon = null;
    } else {
        msg.innerText = 'Coupon applied successfully!';
        msg.style.color = 'var(--success)';
        appliedCoupon = coupon;
    }
    calculateTotal();
}
