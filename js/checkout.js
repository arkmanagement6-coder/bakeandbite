import Store from './store.js';
import { renderHeader, renderFooter } from './components/common.js';

let orderTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('header-root').appendChild(renderHeader());
    document.getElementById('footer-root').appendChild(renderFooter());

    const cart = Store.getCart();
    if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
    }

    renderSummary();
    setupCheckout();
});

function renderSummary() {
    const cart = Store.getCart();
    const container = document.getElementById('checkout-summary-items');
    
    const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const delivery = subtotal > 1000 ? 0 : 50;
    orderTotal = subtotal + tax + delivery;

    container.innerHTML = cart.map(item => `
        <div class="flex justify-between" style="margin-bottom: 10px; font-size: 0.9rem;">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.discountPrice * item.quantity}</span>
        </div>
    `).join('');

    document.getElementById('final-total').innerText = `₹${orderTotal}`;
    document.getElementById('payment-amount').innerText = orderTotal;
}

function setupCheckout() {
    // Payment option selection
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('active'));
            opt.classList.add('active');
            opt.querySelector('input').checked = true;
        });
    });

    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const method = document.querySelector('.payment-option.active').getAttribute('data-method');
        
        if (method === 'Online') {
            document.getElementById('razorpay-modal').style.display = 'flex';
        } else {
            completeOrder('COD');
        }
    });

    document.getElementById('simulate-success').addEventListener('click', () => {
        completeOrder('Paid Online');
    });

    document.getElementById('simulate-fail').addEventListener('click', () => {
        document.getElementById('razorpay-modal').style.display = 'none';
        alert('Payment cancelled by user.');
    });
}

function completeOrder(paymentStatus) {
    const cart = Store.getCart();
    const customer = {
        name: document.getElementById('cust-name').value,
        email: document.getElementById('cust-email').value,
        mobile: document.getElementById('cust-mobile').value,
        address: document.getElementById('cust-address').value,
        pincode: document.getElementById('cust-pincode').value
    };

    const orderData = {
        items: cart,
        total: orderTotal,
        customer: customer,
        paymentStatus: paymentStatus,
        paymentMethod: document.querySelector('.payment-option.active').getAttribute('data-method'),
        transactionId: paymentStatus === 'Paid Online' ? 'TXN' + Date.now() : 'N/A'
    };

    const order = Store.createOrder(orderData);
    Store.clearCart();
    
    // Redirect to success page or account
    alert(`Order Placed Successfully! Order ID: ${order.id}`);
    window.location.href = 'account.html';
}
