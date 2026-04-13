/**
 * VibePick Store Management Logic
 * Migrated to MongoDB Atlas App Services (Realm Web SDK)
 */

// --- CONFIGURATION ---
const DB_CONFIG = {
    APP_ID: 'vibepick-app-xxxxx', // USER: Replace with your MongoDB App ID (found in App Services)
    DATABASE: 'vibepick_db',
    COLLECTIONS: {
        PRODUCTS: 'products',
        ORDERS: 'orders',
        SALES: 'sales_meta',
        CATEGORIES: 'categories',
        REPORTS: 'reports'
    }
};

let db = null;

// --- DATABASE INITIALIZATION ---
async function initDB() {
    if (db) return db;
    try {
        const app = new Realm.App({ id: DB_CONFIG.APP_ID });
        // Using Anonymous Authentication for universal sync without requiring user login
        const user = await app.logIn(Realm.Credentials.anonymous());
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        db = mongodb.db(DB_CONFIG.DATABASE);
        console.log('✅ Connected to MongoDB Atlas via App Services.');
        return db;
    } catch (err) {
        console.error('❌ MongoDB Initialization Failed:', err);
        return null;
    }
}

window.AppStore = {
    state: {
        categories: JSON.parse(localStorage.getItem('app_categories')) || ["Outerwear", "Tops", "Footwear", "Accessories"],
        products: JSON.parse(localStorage.getItem('app_products')) || [],
        cart: JSON.parse(localStorage.getItem('app_cart')) || [],
        sales: JSON.parse(localStorage.getItem('app_sales')) || { totalRevenue: 0, totalItemsSold: 0 },
        orders: JSON.parse(localStorage.getItem('app_orders')) || [],
        financialReports: JSON.parse(localStorage.getItem('app_reports')) || [],
        isLoading: false,
    },
    searchTerm: '',

    // --- SYNC CORE ---
    async syncWithDB() {
        this.state.isLoading = true;
        console.log('🔄 Syncing with MongoDB Atlas...');

        try {
            const database = await initDB();
            if (!database) throw new Error("DB Connection failed");

            // Fetch all collections in parallel
            const [products, orders, salesDoc, categoriesDoc, reports] = await Promise.all([
                database.collection(DB_CONFIG.COLLECTIONS.PRODUCTS).find({}),
                database.collection(DB_CONFIG.COLLECTIONS.ORDERS).find({}),
                database.collection(DB_CONFIG.COLLECTIONS.SALES).findOne({}),
                database.collection(DB_CONFIG.COLLECTIONS.CATEGORIES).findOne({}),
                database.collection(DB_CONFIG.COLLECTIONS.REPORTS).find({})
            ]);

            this.state.products = products || [];
            this.state.orders = orders || [];
            if (salesDoc) this.state.sales = salesDoc;
            if (categoriesDoc && categoriesDoc.list) this.state.categories = categoriesDoc.list;
            this.state.financialReports = reports || [];
            
            console.log('✅ Sync Complete.');
        } catch (err) {
            console.warn('⚠️ MongoDB Sync failed, using local cache.', err);
        }

        this.state.isLoading = false;
        this.renderAll();
        this.updateOfflineCache();
    },

    updateOfflineCache() {
        localStorage.setItem('app_products', JSON.stringify(this.state.products));
        localStorage.setItem('app_cart', JSON.stringify(this.state.cart));
        localStorage.setItem('app_sales', JSON.stringify(this.state.sales));
        localStorage.setItem('app_orders', JSON.stringify(this.state.orders));
        localStorage.setItem('app_reports', JSON.stringify(this.state.financialReports));
        localStorage.setItem('app_categories', JSON.stringify(this.state.categories));
    },

    // MediaDB: IndexedDB utility for large file storage (Videos)
    mediaDB: {
        dbName: 'vibepick_media_v1',
        storeName: 'media',
        async init() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, 1);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                    }
                };
                request.onsuccess = (e) => resolve(e.target.result);
                request.onerror = (e) => reject(e.target.error);
            });
        },
        async save(id, blob) {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                store.put(blob, id);
                transaction.oncomplete = () => resolve(id);
                transaction.onerror = () => reject(transaction.error);
            });
        },
        async get(id) {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },
        async delete(id) {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                store.delete(id);
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            });
        }
    },

    async addNewCategory(newCat) {
        if (newCat && !this.state.categories.includes(newCat)) {
            this.state.categories.push(newCat);
            const database = await initDB();
            await database.collection(DB_CONFIG.COLLECTIONS.CATEGORIES).updateOne(
                {}, 
                { "$set": { list: this.state.categories } },
                { upsert: true }
            );
            await this.syncWithDB();
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
            const activeSizeBtn = document.querySelector('#detail-sizes-grid button.bg-on-surface');
            if (activeSizeBtn) size = activeSizeBtn.textContent;
            else return alert('Please select a size first.');
        }

        const cartId = size ? \`\${productId}-\${size}\` : productId;
        const totalInCartForProduct = this.state.cart.filter(c => c.id === productId).reduce((sum, c) => sum + c.quantity, 0);
        const existingCartItem = this.state.cart.find(c => c.cartId === cartId);
        
        if (existingCartItem) {
            if (totalInCartForProduct < product.stockCount) existingCartItem.quantity++;
            else alert(\`Cannot add more. Only \${product.stockCount} left in total stock.\`);
        } else {
            if (totalInCartForProduct < product.stockCount) {
                this.state.cart.push({ ...product, cartId: cartId, size: size, quantity: 1, selectedColorColorName: document.getElementById('detail-image')?.src });
            } else alert(\`Cannot add more. Only \${product.stockCount} left in total stock.\`);
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
            if (delta > 0 && totalInCartForProduct >= product.stockCount) return alert(\`Only \${product.stockCount} left.\`);
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
        toast.className = \`fixed bottom-8 right-8 px-6 py-4 rounded-md shadow-2xl z-[9999] text-sm font-bold text-white uppercase tracking-widest transition-opacity duration-300 \${type === 'success' ? 'bg-green-600' : 'bg-red-600'}\`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('opacity-0'), 2500);
        setTimeout(() => toast.remove(), 3000);
    },

    async checkout(customerDetails) {
        if (this.state.cart.length === 0) return;
        try {
            this.state.isLoading = true;
            const database = await initDB();
            let orderTotal = 0;
            let itemsSold = 0;
            const newOrder = {
                id: \`ORD-\${Date.now()}\`,
                date: new Date().toISOString(),
                customerInfo: customerDetails || { name: "Guest", email: "guest@example.com", address: "To verify", phone: "N/A" },
                items: [...this.state.cart],
                totalAmount: 0,
                status: 'Pending'
            };

            for (const cartItem of this.state.cart) {
                const product = this.state.products.find(p => p.id === cartItem.id);
                if (!product || product.stockCount < cartItem.quantity) throw new Error(\`Insufficient stock for \${cartItem.name}\`);
                orderTotal += (product.price * cartItem.quantity);
                itemsSold += cartItem.quantity;

                // Sync Stock Update
                await database.collection(DB_CONFIG.COLLECTIONS.PRODUCTS).updateOne(
                    { id: product.id },
                    { "$inc": { stockCount: -cartItem.quantity } }
                );
            }

            newOrder.totalAmount = orderTotal;
            await database.collection(DB_CONFIG.COLLECTIONS.ORDERS).insertOne(newOrder);
            await database.collection(DB_CONFIG.COLLECTIONS.SALES).updateOne(
                {},
                { "$inc": { totalRevenue: orderTotal, totalItemsSold: itemsSold } },
                { upsert: true }
            );

            this.state.cart = [];
            await this.syncWithDB();
            this.showToast('Order processed successfully!', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
            throw error;
        } finally { this.state.isLoading = false; }
    },

    async updateOrderStatus(orderId, newStatus) {
        const database = await initDB();
        await database.collection(DB_CONFIG.COLLECTIONS.ORDERS).updateOne(
            { id: orderId },
            { "$set": { status: newStatus } }
        );
        await this.syncWithDB();
    },

    async saveFinancialReport(reportData) {
        const fullReport = { id: \`REP-\${Date.now()}\`, date: new Date().toISOString(), ...reportData };
        const database = await initDB();
        await database.collection(DB_CONFIG.COLLECTIONS.REPORTS).insertOne(fullReport);
        await this.syncWithDB();
    },

    sanitizeString(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    
    async addNewProduct(productData) {
        const sanitizeObj = (obj, isDescription = false) => {
            if (typeof obj === 'string') return isDescription ? obj : this.sanitizeString(obj);
            if (Array.isArray(obj)) return obj.map(item => sanitizeObj(item));
            if (typeof obj === 'object' && obj !== null) {
                const newObj = {};
                for (let key in obj) newObj[key] = sanitizeObj(obj[key], key === 'description');
                return newObj;
            }
            return obj;
        };
        const prodId = \`prod-\${Date.now()}\`;
        const safeProduct = sanitizeObj(productData);
        safeProduct.id = prodId;

        const database = await initDB();
        await database.collection(DB_CONFIG.COLLECTIONS.PRODUCTS).insertOne(safeProduct);
        await this.syncWithDB();
    },

    async updateProduct(id, productData) {
        const sanitizeObj = (obj, isDescription = false) => {
            if (typeof obj === 'string') return isDescription ? obj : this.sanitizeString(obj);
            if (Array.isArray(obj)) return obj.map(item => sanitizeObj(item));
            if (typeof obj === 'object' && obj !== null) {
                const newObj = {};
                for (let key in obj) newObj[key] = sanitizeObj(obj[key], key === 'description');
                return newObj;
            }
            return obj;
        };
        const safeProduct = sanitizeObj(productData);
        const database = await initDB();
        await database.collection(DB_CONFIG.COLLECTIONS.PRODUCTS).updateOne(
            { id: id },
            { "$set": safeProduct }
        );
        await this.syncWithDB();
    },
    
    async deleteProduct(id) {
        const database = await initDB();
        await database.collection(DB_CONFIG.COLLECTIONS.PRODUCTS).deleteOne({ id: id });
        this.state.cart = this.state.cart.filter(c => c.id !== id);
        await this.syncWithDB();
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

    renderAll() {
        this.renderCartSidebar();
        this.renderProductsList();
        this.updateCartBadges();
        this.renderOrderSummaryIfCheckout();
    },

    updateCartBadges() {
        const count = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.app-cart-badge').forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    formatMoney(amount) { return \`৳\${amount.toFixed(2)}\`; },

    injectCartHTML() {
        if (document.getElementById('global-cart-wrapper')) return;
        const cartWrapper = document.createElement('div');
        cartWrapper.id = 'global-cart-wrapper';
        cartWrapper.className = 'fixed inset-0 z-[100] hidden opacity-0 transition-opacity duration-300';
        cartWrapper.innerHTML = \`
            <div data-action="close-cart" class="absolute inset-0 bg-on-surface/40 backdrop-blur-[2px]"></div>
            <aside id="global-cart-sidebar" class="absolute right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl flex flex-col translate-x-full transition-transform duration-300">
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
        \`;
        document.body.appendChild(cartWrapper);
    },

    renderCartSidebar() {
        this.injectCartHTML();
        const container = document.getElementById('cart-items-container');
        const subtotalEl = document.getElementById('cart-sidebar-subtotal');
        if (!container || !subtotalEl) return;
        const totals = this.getCartTotals();
        subtotalEl.textContent = this.formatMoney(totals.subtotal);
        if (this.state.cart.length === 0) {
            container.innerHTML = \`<div class="flex flex-col items-center justify-center h-full text-center mt-10"><p class="text-gray-500 text-sm mb-6">Your cart is empty.</p><button data-action="close-cart" class="border border-gray-300 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Close</button></div>\`;
            return;
        }
        container.innerHTML = this.state.cart.map(item => \`
            <div class="flex gap-4">
                <div class="w-20 h-28 bg-gray-100 flex-shrink-0"><img src="\${item.selectedColorColorName || (item.images && item.images[0] ? item.images[0] : './placeholder.jpg')}" class="w-full h-full object-cover"></div>
                <div class="flex flex-col justify-between flex-grow">
                    <div>
                        <div class="flex justify-between items-start gap-2 min-w-0">
                            <h3 class="text-sm font-bold text-gray-900 truncate flex-1 min-w-0">\${item.name} \${item.size ? \`(\${item.size})\` : ''}</h3>
                            <button data-action="remove-item" data-id="\${item.cartId}" class="text-gray-400 hover:text-red-700"><span class="material-symbols-outlined text-sm">delete</span></button>
                        </div>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">\${item.category}</p>
                    </div>
                    <div class="flex justify-between items-end">
                        <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 px-2 py-1">
                            <button data-action="decrease-qty" data-id="\${item.cartId}" class="text-xs px-2">-</button>
                            <span class="text-xs font-medium w-4 text-center">\${item.quantity}</span>
                            <button data-action="increase-qty" data-id="\${item.cartId}" class="text-xs px-2">+</button>
                        </div>
                        <span class="font-bold text-sm">\${this.formatMoney(item.price * item.quantity)}</span>
                    </div>
                </div>
            </div>
        \`).join('');
    },

    renderProductsList() {
        const container = document.getElementById('dynamic-products-grid');
        if (!container) return;
        container.innerHTML = '';
        const products = this.state.products.filter(p => !this.state.searchTerm || p.name.toLowerCase().includes(this.state.searchTerm) || p.category.toLowerCase().includes(this.state.searchTerm));
        if (products.length === 0) {
            container.innerHTML = \`<div class="col-span-full py-32 text-center text-gray-400 italic">No products found.</div>\`;
            return;
        }
        products.forEach(product => {
            const isOutOfStock = product.stockCount === 0;
            const productEl = document.createElement('div');
            productEl.className = 'group flex flex-col cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative';
            productEl.setAttribute('data-action', 'view-details');
            productEl.setAttribute('data-id', product.id);
            productEl.innerHTML = \`
                <div class="relative overflow-hidden bg-gray-100 aspect-square mb-6">
                    <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 \${isOutOfStock ? 'grayscale opacity-70' : ''}" src="\${product.images[0]}">
                    \${isOutOfStock ? \`<div class="absolute inset-0 bg-white/40 flex items-center justify-center"><span class="bg-gray-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">Out of Stock</span></div>\` : ''}
                </div>
                <div class="flex justify-between items-start gap-4">
                    <div class="min-w-0 flex-grow">
                        <h3 class="text-lg font-bold truncate \${isOutOfStock ? 'text-gray-400' : ''}">\${product.name}</h3>
                        <p class="text-[10px] tracking-widest uppercase mt-1 text-gray-500">\${product.category}</p>
                    </div>
                    <span class="text-lg font-medium \${isOutOfStock ? 'text-gray-400' : ''}">\${this.formatMoney(product.price)}</span>
                </div>
            \`;
            container.appendChild(productEl);
        });
    },

    renderOrderSummaryIfCheckout() {
        const summaryContainer = document.getElementById('checkout-order-summary');
        if (!summaryContainer) return;
        const totals = this.getCartTotals();
        summaryContainer.innerHTML = this.state.cart.map(item => \`
            <div class="flex gap-4 group">
                <div class="w-20 h-28 bg-gray-100 flex-shrink-0"><img src="\${item.selectedColorColorName || item.images[0]}" class="w-full h-full object-cover"></div>
                <div class="flex flex-col justify-between flex-grow py-1 min-w-0">
                    <div>
                        <div class="flex justify-between items-start gap-2 min-w-0">
                            <h4 class="font-bold text-sm text-gray-900 truncate flex-1">\${item.name}</h4>
                            <button data-action="remove-item" data-id="\${item.cartId}" class="text-gray-400 hover:text-red-700"><span class="material-symbols-outlined text-sm">delete</span></button>
                        </div>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">\${item.category}</p>
                    </div>
                    <div class="flex justify-between items-end">
                        <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 px-2 py-1">
                            <button data-action="decrease-qty" data-id="\${item.cartId}" class="text-xs px-2">-</button>
                            <span class="text-xs font-medium w-4 text-center">\${item.quantity}</span>
                            <button data-action="increase-qty" data-id="\${item.cartId}" class="text-xs px-2">+</button>
                        </div>
                        <span class="font-bold text-sm">\${this.formatMoney(item.price * item.quantity)}</span>
                    </div>
                </div>
            </div>
        \`).join('') + \`
            <div class="pt-6 border-t border-gray-200 mt-6 flex justify-between items-baseline">
                <span class="text-lg font-bold">Total</span>
                <span class="text-2xl font-extrabold tracking-tighter">\${this.formatMoney(totals.total)}</span>
            </div>
        \`;
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
        
        // Quill Support
        const descElem = document.getElementById('detail-desc') || document.getElementById('product-description');
        if (descElem) descElem.innerHTML = product.description || "";
        const descSecondary = document.getElementById('detail-desc-secondary');
        if (descSecondary) descSecondary.innerHTML = product.description || "";

        // Sizes
        const sizesGrid = document.getElementById('detail-sizes-grid');
        if (sizesGrid) {
            sizesGrid.innerHTML = (product.sizes || []).map((s, i) => \`<button class="size-btn py-3 text-xs transition-colors \${i === 0 ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}" onclick="[...this.parentElement.children].forEach(b=>b.className='size-btn py-3 text-xs bg-gray-100 hover:bg-gray-200');this.className='size-btn py-3 text-xs bg-black text-white'">\${s}</button>\`).join('');
        }

        // Colors
        const colorsContainer = document.getElementById('detail-colors-container');
        if (colorsContainer) {
            colorsContainer.innerHTML = (product.colors || []).map(c => \`<button data-action="swap-image" data-img-url="\${c.colorImage}" data-color-name="\${c.colorName}" class="w-8 h-8 rounded-full border border-gray-300 hover:scale-110 transition-transform overflow-hidden shadow-sm flex-shrink-0"><img src="\${c.colorImage}" class="w-full h-full object-cover pointer-events-none"></button>\`).join('');
        }

        // Refine Details
        const refineGrid = document.getElementById('refined-details') || document.getElementById('detail-features-grid');
        if (refineGrid) {
            refineGrid.innerHTML = (product.detailsList || []).map(d => \`<li class="flex flex-col gap-1 border-b border-gray-100 pb-2 mt-2"><span class="font-bold tracking-widest text-[10px] uppercase text-gray-500">\${d.title}</span><span class="text-sm text-black">\${d.value}</span></li>\`).join('');
        }
    },

    openCart() {
        const wrapper = document.getElementById('global-cart-wrapper');
        const sidebar = document.getElementById('global-cart-sidebar');
        if (!wrapper || !sidebar) return;
        wrapper.classList.remove('hidden');
        setTimeout(() => {
            wrapper.classList.remove('opacity-0');
            sidebar.classList.remove('translate-x-full');
        }, 10);
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

// --- INITIALIZE APP ---
document.addEventListener('DOMContentLoaded', () => {
    if (window.initStoreUI) window.initStoreUI();
    if (window.AppStore && window.AppStore.syncWithDB) window.AppStore.syncWithDB();
});

// Event Delegation
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');
    if (action === 'view-details') {
        const url = \`details.html?id=\${id}\`;
        window.history.pushState({}, '', url);
        if (window.handleRouting) window.handleRouting(url);
        else window.location.href = url;
    } else if (action === 'add-to-cart') {
        window.AppStore.addToCart(id);
    } else if (action === 'remove-item') {
        window.AppStore.removeFromCart(id);
    } else if (action === 'increase-qty') {
        window.AppStore.updateCartQuantity(id, 1);
    } else if (action === 'decrease-qty') {
        window.AppStore.updateCartQuantity(id, -1);
    } else if (action === 'close-cart') {
        window.AppStore.closeCart();
    } else if (action === 'swap-image') {
        const newImgUrl = target.getAttribute('data-img-url');
        const img = document.getElementById('detail-image');
        if (img) img.src = newImgUrl;
        const colorLabel = document.getElementById('detail-color-label');
        if (colorLabel) colorLabel.textContent = \`Color / \${target.getAttribute('data-color-name')}\`;
    }
});
