/**
 * VibePick Store Management Logic
 * Powered by Firebase Realtime Database for Instant Multi-Browser Sync
 */

const firebaseConfig = {
  apiKey: 'AIzaSyA36Xha9t1t0zXeH7TY4ts2FNseKQhxZt8',
  authDomain: 'vibepick-2a776.firebaseapp.com',
  databaseURL: 'https://vibepick-2a776-default-rtdb.firebaseio.com',
  projectId: 'vibepick-2a776',
  storageBucket: 'vibepick-2a776.firebasestorage.app',
  messagingSenderId: '42869078681',
  appId: '1:42869078681:web:a8cd9672728ba2df255608',
  measurementId: 'G-C1CCK3QRVM'
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

window.AppStore = {
    state: {
        categories: ["Outerwear", "Tops", "Footwear", "Accessories"],
        products: [],
        cart: JSON.parse(localStorage.getItem('app_cart')) || [],
        sales: { totalRevenue: 0, totalItemsSold: 0 },
        orders: [],
        financialReports: [],
        isLoading: true,
    },
    searchTerm: '',

    // --- REALTIME SYNC CORE ---
    initSync() {
        console.log('🔥 Initializing Realtime Firebase Sync...');
        
        // Listen for all state changes in real-time
        db.ref('store_state').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.state.products = data.products || [];
                this.state.orders = data.orders ? Object.values(data.orders).reverse() : [];
                this.state.sales = data.sales || { totalRevenue: 0, totalItemsSold: 0 };
                this.state.categories = data.categories || this.state.categories;
                this.state.financialReports = data.reports ? Object.values(data.reports).reverse() : [];
                
                console.log('✅ Synchronized with Firebase.');
                this.state.isLoading = false;
                this.renderAll();
                this.updateOfflineCache();
            } else {
                // Initialize DB if empty
                this.pushFullStateToDB();
            }
        });
    },

    pushFullStateToDB() {
        db.ref('store_state').set({
            products: this.state.products || [],
            categories: this.state.categories,
            sales: this.state.sales
        });
    },

    updateOfflineCache() {
        localStorage.setItem('app_cart', JSON.stringify(this.state.cart));
    },

    // MediaDB (IndexedDB for local video storage)
    mediaDB: {
        dbName: 'vibepick_media_v1',
        storeName: 'media',
        async init() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, 1);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) db.createObjectStore(this.storeName);
                };
                request.onsuccess = (e) => resolve(e.target.result);
                request.onerror = (e) => reject(e.target.error);
            });
        },
        async save(id, blob) {
            const dbRef = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = dbRef.transaction(this.storeName, 'readwrite');
                transaction.objectStore(this.storeName).put(blob, id);
                transaction.oncomplete = () => resolve(id);
                transaction.onerror = () => reject(transaction.error);
            });
        }
    },

    async addNewCategory(newCat) {
        if (newCat && !this.state.categories.includes(newCat)) {
            this.state.categories.push(newCat);
            await db.ref('store_state/categories').set(this.state.categories);
        }
    },

    saveState() {
        this.updateOfflineCache();
        this.renderAll();
    },

    addToCart(productId, selectedSize = null) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product || product.stockCount <= 0) return alert('Out of stock!');

        let size = selectedSize;
        if (product.sizes && product.sizes.length > 0 && !size) {
            const activeSizeBtn = document.querySelector('#detail-sizes-grid button.bg-black');
            if (activeSizeBtn) size = activeSizeBtn.textContent;
            else return alert('Please select a size first.');
        }

        const cartId = size ? `${productId}-${size}` : productId;
        const totalInCartForProduct = this.state.cart.filter(c => c.id === productId).reduce((sum, c) => sum + c.quantity, 0);
        const existingCartItem = this.state.cart.find(c => c.cartId === cartId);
        
        if (existingCartItem) {
            if (totalInCartForProduct < product.stockCount) existingCartItem.quantity++;
            else alert(`Cannot add more. Only ${product.stockCount} left in total stock.`);
        } else {
            if (totalInCartForProduct < product.stockCount) {
                this.state.cart.push({ ...product, cartId: cartId, size: size, quantity: 1, selectedColorColorName: document.getElementById('detail-image')?.src });
            } else alert(`Cannot add more. Only ${product.stockCount} left in total stock.`);
        }
        this.saveState();
        this.openCart();
    },

    updateCartQuantity(cartId, delta) {
        const cartItem = this.state.cart.find(c => c.cartId === cartId);
        if (!cartItem) return;
        const product = this.state.products.find(p => p.id === cartItem.id);
        const totalInCartForProduct = this.state.cart.filter(c => c.id === cartItem.id).reduce((sum, c) => sum + c.quantity, 0);

        if (cartItem && product) {
            const newQty = cartItem.quantity + delta;
            if (delta > 0 && totalInCartForProduct >= product.stockCount) return alert(`Only ${product.stockCount} left.`);
            if (newQty <= 0) this.removeFromCart(cartId);
            else {
                cartItem.quantity = newQty;
                this.saveState();
            }
        }
    },

    removeFromCart(cartId) {
        this.state.cart = this.state.cart.filter(c => c.cartId !== cartId);
        this.saveState();
    },

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-8 right-8 px-6 py-4 rounded-md shadow-2xl z-[9999] text-sm font-bold text-white uppercase tracking-widest transition-opacity duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('opacity-0'), 2500);
        setTimeout(() => toast.remove(), 3000);
    },

    async checkout(customerDetails) {
        if (this.state.cart.length === 0) return;
        this.state.isLoading = true;
        try {
            let orderTotal = 0;
            let itemsSold = 0;
            const newOrder = {
                id: `ORD-${Date.now()}`,
                date: new Date().toISOString(),
                customerInfo: customerDetails || { name: "Guest", email: "guest@example.com", address: "To verify", phone: "N/A" },
                items: [...this.state.cart],
                totalAmount: 0,
                status: 'Pending'
            };

            const updates = {};
            for (const cartItem of this.state.cart) {
                const productIndex = this.state.products.findIndex(p => p.id === cartItem.id);
                if (productIndex === -1 || this.state.products[productIndex].stockCount < cartItem.quantity) {
                    throw new Error(`Insufficient stock for ${cartItem.name}`);
                }
                orderTotal += (cartItem.price * cartItem.quantity);
                itemsSold += cartItem.quantity;
                this.state.products[productIndex].stockCount -= cartItem.quantity;
            }

            newOrder.totalAmount = orderTotal;
            const orderId = db.ref('store_state/orders').push().key;
            updates[`store_state/orders/${orderId}`] = newOrder;
            updates[`store_state/products`] = this.state.products;
            updates[`store_state/sales/totalRevenue`] = (this.state.sales.totalRevenue || 0) + orderTotal;
            updates[`store_state/sales/totalItemsSold`] = (this.state.sales.totalItemsSold || 0) + itemsSold;

            await db.ref().update(updates);
            this.state.cart = [];
            this.showToast('Order processed successfully!', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
            throw error;
        } finally { this.state.isLoading = false; }
    },

    async updateOrderStatus(orderId, newStatus) {
        const snapshot = await db.ref('store_state/orders').once('value');
        const ordersData = snapshot.val();
        for (let key in ordersData) {
            if (ordersData[key].id === orderId) {
                await db.ref(`store_state/orders/${key}/status`).set(newStatus);
                break;
            }
        }
    },

    async saveFinancialReport(reportData) {
        const fullReport = { id: `REP-${Date.now()}`, date: new Date().toISOString(), ...reportData };
        await db.ref('store_state/reports').push(fullReport);
    },

    sanitizeString(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    
    async addNewProduct(productData) {
        const prodId = `prod-${Date.now()}`;
        productData.id = prodId;
        this.state.products.unshift(productData);
        await db.ref('store_state/products').set(this.state.products);
    },

    async updateProduct(id, productData) {
        const index = this.state.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.state.products[index] = { ...this.state.products[index], ...productData };
            await db.ref('store_state/products').set(this.state.products);
        }
    },
    
    async deleteProduct(id) {
        this.state.products = this.state.products.filter(p => p.id !== id);
        await db.ref('store_state/products').set(this.state.products);
    },

    getCartTotals() {
        const subtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { subtotal, shipping: 0, total: subtotal };
    },

    setSearchTerm(query) {
        this.state.searchTerm = (query || '').toLowerCase().trim();
        sessionStorage.setItem('app_search_term', this.state.searchTerm);
        this.renderProductsList();
    },

    // UI RENDERERS
    renderAll() {
        this.renderCartSidebar();
        this.renderProductsList();
        this.updateCartBadges();
        this.renderOrderSummaryIfCheckout();
        if (document.getElementById('detail-title')) this.renderProductDetails();
    },

    updateCartBadges() {
        const count = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.app-cart-badge').forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    formatMoney(amount) { return `৳${amount.toFixed(2)}`; },

    injectCartHTML() {
        if (document.getElementById('global-cart-wrapper')) return;
        const cartWrapper = document.createElement('div');
        cartWrapper.id = 'global-cart-wrapper';
        cartWrapper.className = 'fixed inset-0 z-[100] hidden opacity-0 transition-opacity duration-300';
        cartWrapper.innerHTML = `
            <div data-action="close-cart" class="absolute inset-0 bg-on-surface/40 backdrop-blur-[2px]"></div>
            <aside id="global-cart-sidebar" class="absolute right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl flex flex-col translate-x-full transition-transform duration-300 text-on-surface">
                <header class="p-8 pb-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-lg font-bold">Shopping Bag</h2>
                    <button data-action="close-cart" class="text-gray-500 hover:text-black">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </header>
                <div id="cart-items-container" class="flex-grow overflow-y-auto p-8 flex flex-col gap-8"></div>
                <footer class="p-8 bg-gray-50 border-t border-gray-200">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
                        <span id="cart-sidebar-subtotal" class="text-xl font-bold">৳0.00</span>
                    </div>
                    <a href="checkout.html" class="w-full bg-gray-800 text-white py-4 flex justify-center text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors">Proceed to Checkout</a>
                </footer>
            </aside>
        `;
        document.body.appendChild(cartWrapper);
    },

    renderCartSidebar() {
        this.injectCartHTML();
        const container = document.getElementById('cart-items-container');
        const subtotalEl = document.getElementById('cart-sidebar-subtotal');
        if (!container || !subtotalEl) return;
        subtotalEl.textContent = this.formatMoney(this.getCartTotals().subtotal);
        if (this.state.cart.length === 0) {
            container.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center mt-10"><p class="text-gray-500">Your cart is empty.</p></div>`;
            return;
        }
        container.innerHTML = this.state.cart.map(item => `
            <div class="flex gap-4">
                <div class="w-20 h-28 bg-gray-100 flex-shrink-0"><img src="${item.selectedColorColorName || (item.images && item.images[0] ? item.images[0] : './placeholder.jpg')}" class="w-full h-full object-cover"></div>
                <div class="flex flex-col justify-between flex-grow">
                    <div class="flex justify-between items-start">
                        <h3 class="text-sm font-bold truncate flex-1">${item.name} ${item.size ? `(${item.size})` : ''}</h3>
                        <button data-action="remove-item" data-id="${item.cartId}" class="text-gray-400 hover:text-red-700"><span class="material-symbols-outlined text-sm">delete</span></button>
                    </div>
                    <div class="flex justify-between items-end">
                        <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 px-2 py-1">
                            <button data-action="decrease-qty" data-id="${item.cartId}" class="text-xs px-2">-</button>
                            <span class="text-xs font-medium w-4 text-center">${item.quantity}</span>
                            <button data-action="increase-qty" data-id="${item.cartId}" class="text-xs px-2">+</button>
                        </div>
                        <span class="font-bold text-sm">${this.formatMoney(item.price * item.quantity)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderProductsList() {
        const container = document.getElementById('dynamic-products-grid');
        if (!container) return;
        container.innerHTML = '';
        const products = this.state.products.filter(p => !this.state.searchTerm || p.name.toLowerCase().includes(this.state.searchTerm) || p.category.toLowerCase().includes(this.state.searchTerm));
        if (products.length === 0) {
            container.innerHTML = `<div class="col-span-full py-32 text-center text-gray-400 italic">No products found.</div>`;
            return;
        }
        products.forEach(product => {
            const isOutOfStock = product.stockCount <= 0;
            const productEl = document.createElement('div');
            productEl.className = 'group flex flex-col cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative';
            productEl.setAttribute('data-action', 'view-details');
            productEl.setAttribute('data-id', product.id);
            productEl.innerHTML = `
                <div class="relative overflow-hidden bg-gray-100 aspect-square mb-6">
                    <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-70' : ''}" src="${product.images[0]}">
                    ${isOutOfStock ? `<div class="absolute inset-0 bg-white/40 flex items-center justify-center"><span class="bg-gray-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">Out of Stock</span></div>` : ''}
                </div>
                <div class="flex justify-between items-start gap-4">
                    <div class="min-w-0 flex-grow">
                        <h3 class="text-lg font-bold truncate ${isOutOfStock ? 'text-gray-400' : ''}">${product.name}</h3>
                        <p class="text-[10px] tracking-widest uppercase mt-1 text-gray-500">${product.category}</p>
                    </div>
                    <span class="text-lg font-medium ${isOutOfStock ? 'text-gray-400' : ''}">${this.formatMoney(product.price)}</span>
                </div>
            `;
            container.appendChild(productEl);
        });
    },

    renderOrderSummaryIfCheckout() {
        const summaryContainer = document.getElementById('checkout-order-summary');
        if (!summaryContainer) return;
        const totals = this.getCartTotals();
        summaryContainer.innerHTML = this.state.cart.map(item => `
            <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-sm font-medium">${item.name} (x${item.quantity})</span>
                <span class="text-sm font-bold">${this.formatMoney(item.price * item.quantity)}</span>
            </div>
        `).join('') + `
            <div class="mt-6 flex justify-between">
                <span class="text-lg font-bold">Total</span>
                <span class="text-2xl font-extrabold">${this.formatMoney(totals.total)}</span>
            </div>
        `;
    },

    renderProductDetails() {
        if (!document.getElementById('detail-title')) return;
        const params = new URLSearchParams(window.location.search);
        let productId = params.get('id');
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;
        
        document.getElementById('detail-image').src = product.images[0];
        document.getElementById('detail-category').textContent = product.category;
        document.getElementById('detail-title').textContent = product.name;
        document.getElementById('detail-price').textContent = this.formatMoney(product.price);
        
        const descElem = document.getElementById('detail-desc') || document.getElementById('product-description');
        if (descElem) descElem.innerHTML = product.description || "";

        const sizesGrid = document.getElementById('detail-sizes-grid');
        if (sizesGrid) {
            sizesGrid.innerHTML = (product.sizes || []).map((s, i) => `<button class="size-btn py-3 text-xs transition-colors ${i === 0 ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}" onclick="[...this.parentElement.children].forEach(b=>b.className='size-btn py-3 text-xs bg-gray-100 hover:bg-gray-200');this.className='size-btn py-3 text-xs bg-black text-white'">${s}</button>`).join('');
        }

        const colorsContainer = document.getElementById('detail-colors-container');
        if (colorsContainer) {
            colorsContainer.innerHTML = (product.colors || []).map(c => `<button data-action="swap-image" data-img-url="${c.colorImage}" data-color-name="${c.colorName}" class="w-8 h-8 rounded-full border border-gray-300 hover:scale-110 transition-transform overflow-hidden shadow-sm flex-shrink-0"><img src="${c.colorImage}" class="w-full h-full object-cover pointer-events-none"></button>`).join('');
        }
        
        const refineGrid = document.getElementById('refined-details') || document.getElementById('detail-features-grid');
        if (refineGrid) {
            refineGrid.innerHTML = (product.detailsList || []).map(d => `<li class="flex flex-col gap-1 border-b border-gray-100 pb-2 mt-2"><span class="font-bold tracking-widest text-[10px] uppercase text-gray-500">${d.title}</span><span class="text-sm text-black">${d.value}</span></li>`).join('');
        }
    },

    openCart() {
        const wrapper = document.getElementById('global-cart-wrapper');
        const sidebar = document.getElementById('global-cart-sidebar');
        if (!wrapper || !sidebar) return;
        wrapper.classList.remove('hidden');
        setTimeout(() => { wrapper.classList.remove('opacity-0'); sidebar.classList.remove('translate-x-full'); }, 10);
    },

    closeCart() {
        const wrapper = document.getElementById('global-cart-wrapper');
        const sidebar = document.getElementById('global-cart-sidebar');
        if (!wrapper || !sidebar) return;
        wrapper.classList.add('opacity-0');
        sidebar.classList.add('translate-x-full');
        setTimeout(() => wrapper.classList.add('hidden'), 300);
    }
};

// --- INITIALIZE ---
window.AppStore.initSync();
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');
    if (action === 'view-details') {
        const url = `details.html?id=${id}`;
        window.history.pushState({}, '', url);
        if (window.handleRouting) window.handleRouting(url);
        else window.location.href = url;
    } else if (action === 'add-to-cart') window.AppStore.addToCart(id);
    else if (action === 'remove-item') window.AppStore.removeFromCart(id);
    else if (action === 'increase-qty') window.AppStore.updateCartQuantity(id, 1);
    else if (action === 'decrease-qty') window.AppStore.updateCartQuantity(id, -1);
    else if (action === 'close-cart') window.AppStore.closeCart();
    else if (action === 'open-cart') window.AppStore.openCart();
    else if (action === 'swap-image') {
        const newImgUrl = target.getAttribute('data-img-url');
        const img = document.getElementById('detail-image');
        if (img) img.src = newImgUrl;
        const colorLabel = document.getElementById('detail-color-label');
        if (colorLabel) colorLabel.textContent = `Color / ${target.getAttribute('data-color-name')}`;
    }
});
