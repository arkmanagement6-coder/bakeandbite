/**
 * Bake and Bite - Centralized Data Store
 * Handles localStorage persistence for products, cart, orders, and users.
 */

const DB_KEYS = {
    PRODUCTS: 'bb_products',
    CATEGORIES: 'bb_categories',
    CART: 'bb_cart',
    ORDERS: 'bb_orders',
    CUSTOM_ENQUIRIES: 'bb_enquiries',
    USERS: 'bb_users',
    CURRENT_USER: 'bb_current_user',
    COUPONS: 'bb_coupons',
    REVIEWS: 'bb_reviews'
};

const Store = {
    init() {
        if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
            this.seedData();
        }
    },

    seedData() {
        const initialProducts = [
            {
                id: 'p1',
                name: 'Belgian Chocolate Truffle Cake',
                price: 899,
                discountPrice: 749,
                category: 'Cakes',
                flavor: 'Chocolate',
                weight: '500g',
                eggless: true,
                rating: 4.8,
                image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
                description: 'Indulge in our signature Belgian chocolate truffle cake, made with premium cocoa and silky smooth ganache.',
                stock: 15,
                active: true
            },
            {
                id: 'p2',
                name: 'Red Velvet Cupcakes',
                price: 299,
                discountPrice: 249,
                category: 'Cupcakes',
                flavor: 'Red Velvet',
                weight: 'Pack of 6',
                eggless: false,
                rating: 4.7,
                image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800',
                description: 'Classic red velvet cupcakes topped with a rich cream cheese frosting.',
                stock: 20,
                active: true
            },
            {
                id: 'p3',
                name: 'Butter Croissants',
                price: 150,
                discountPrice: 120,
                category: 'Breads',
                flavor: 'Butter',
                weight: '150g',
                eggless: false,
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
                description: 'Flaky, buttery, and golden brown. The perfect breakfast companion.',
                stock: 30,
                active: true
            },
            {
                id: 'p4',
                name: 'Macaron Gift Box',
                price: 1200,
                discountPrice: 999,
                category: 'Gift Hampers',
                flavor: 'Assorted',
                weight: '12 Pieces',
                eggless: false,
                rating: 4.6,
                image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800',
                description: 'An elegant assortment of French macarons in various flavors.',
                stock: 10,
                active: true
            }
        ];

        const initialCategories = [
            { id: 'cat1', name: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', order: 1 },
            { id: 'cat2', name: 'Pastries', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', order: 2 },
            { id: 'cat3', name: 'Cupcakes', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400', order: 3 },
            { id: 'cat4', name: 'Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', order: 4 },
            { id: 'cat5', name: 'Breads', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', order: 5 },
            { id: 'cat6', name: 'Gift Hampers', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', order: 6 }
        ];

        localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(initialProducts));
        localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(initialCategories));
        localStorage.setItem(DB_KEYS.CART, JSON.stringify([]));
        localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]));
        localStorage.setItem(DB_KEYS.CUSTOM_ENQUIRIES, JSON.stringify([]));
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
        localStorage.setItem(DB_KEYS.COUPONS, JSON.stringify([
            { code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 500, active: true },
            { code: 'FREESHIP', type: 'flat', value: 50, minOrder: 1000, active: true }
        ]));
        localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify([
            { id: 1, userName: 'John Doe', rating: 5, comment: 'Best chocolate cake in town!', productId: 'p1', approved: true },
            { id: 2, userName: 'Jane Smith', rating: 4, comment: 'Very fresh and yummy.', productId: 'p2', approved: true }
        ]));
    },

    // Generic Getters
    get(key) {
        const data = localStorage.getItem(DB_KEYS[key]);
        return data ? JSON.parse(data) : [];
    },

    // Generic Setters
    set(key, data) {
        localStorage.setItem(DB_KEYS[key], JSON.stringify(data));
    },

    // Product Methods
    getProducts() { return this.get('PRODUCTS'); },
    getActiveProducts() { return this.getProducts().filter(p => p.active); },
    getProductById(id) { return this.getProducts().find(p => p.id === id); },
    saveProduct(product) {
        let products = this.getProducts();
        if (product.id) {
            products = products.map(p => p.id === product.id ? product : p);
        } else {
            product.id = 'p' + Date.now();
            products.push(product);
        }
        this.set('PRODUCTS', products);
    },
    deleteProduct(id) {
        const products = this.getProducts().filter(p => p.id !== id);
        this.set('PRODUCTS', products);
    },

    // Category Methods
    getCategories() { return this.get('CATEGORIES').sort((a, b) => a.order - b.order); },

    // Cart Methods
    getCart() { return this.get('CART'); },
    addToCart(product, quantity = 1, options = {}) {
        let cart = this.getCart();
        const existing = cart.find(item => item.id === product.id && JSON.stringify(item.options) === JSON.stringify(options));
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...product, quantity, options });
        }
        this.set('CART', cart);
        window.dispatchEvent(new CustomEvent('cart-updated'));
    },
    removeFromCart(index) {
        let cart = this.getCart();
        cart.splice(index, 1);
        this.set('CART', cart);
        window.dispatchEvent(new CustomEvent('cart-updated'));
    },
    updateCartQuantity(index, quantity) {
        let cart = this.getCart();
        if (quantity <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = quantity;
        }
        this.set('CART', cart);
        window.dispatchEvent(new CustomEvent('cart-updated'));
    },
    clearCart() {
        this.set('CART', []);
        window.dispatchEvent(new CustomEvent('cart-updated'));
    },

    // Order Methods
    getOrders() { return this.get('ORDERS'); },
    createOrder(orderData) {
        const orders = this.getOrders();
        const newOrder = {
            id: 'ORD' + Date.now(),
            date: new Date().toISOString(),
            status: 'New Order',
            ...orderData
        };
        orders.push(newOrder);
        this.set('ORDERS', orders);
        return newOrder;
    },

    // Custom Enquiry Methods
    saveEnquiry(enquiry) {
        const enquiries = this.get('CUSTOM_ENQUIRIES');
        enquiry.id = 'ENQ' + Date.now();
        enquiry.date = new Date().toISOString();
        enquiry.status = 'Pending';
        enquiries.push(enquiry);
        this.set('CUSTOM_ENQUIRIES', enquiries);
    },

    // Auth Methods
    getCurrentUser() {
        const user = localStorage.getItem(DB_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },
    setCurrentUser(user) {
        localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
        window.dispatchEvent(new CustomEvent('auth-updated'));
    },
    logout() {
        localStorage.removeItem(DB_KEYS.CURRENT_USER);
        window.dispatchEvent(new CustomEvent('auth-updated'));
    }
};

// Initialize Store
Store.init();
export default Store;
