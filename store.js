console.log('DEBUG: store.js loaded');
const defaultProducts = [];

// --- SAFE INITIALIZATION ---
if (!localStorage.getItem('vibepick_v2_initialized')) {
    if (!localStorage.getItem('app_products')) localStorage.setItem('app_products', JSON.stringify([]));
    if (!localStorage.getItem('app_categories')) localStorage.setItem('app_categories', JSON.stringify(["Outerwear", "Tops", "Footwear", "Accessories"]));
    localStorage.setItem('vibepick_v2_initialized', 'true');
    console.log('System initialized.');
}

window.AppStore = {
    state: {
        categories: JSON.parse(localStorage.getItem('app_categories')) || ["Outerwear", "Tops", "Footwear", "Accessories"],
        products: JSON.parse(localStorage.getItem('app_products')) || defaultProducts,
        cart: JSON.parse(localStorage.getItem('app_cart')) || [],
        sales: JSON.parse(localStorage.getItem('app_sales')) || { totalRevenue: 0, totalItemsSold: 0 },
        orders: JSON.parse(localStorage.getItem('app_orders')) || [],
        financialReports: JSON.parse(localStorage.getItem('app_reports')) || [],
    searchTerm: '',
    
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
    }
},

    // --- DATA MIGRATION HUB ---
    migrateData(encodedData) {
        try {
            const data = JSON.parse(atob(encodedData));
            Object.entries(data).forEach(([key, value]) => {
                if (value) localStorage.setItem(key, value);
            });
            alert('Data migration successful. Reloading...');
            window.location.reload();
        } catch (e) {
            console.error('Migration failed:', e);
            alert('Invalid migration string.');
        }
    },

    addNewCategory(categoryName) {
        if (categoryName && !this.state.categories.includes(categoryName)) {
            this.state.categories.push(categoryName);
            localStorage.setItem('app_categories', JSON.stringify(this.state.categories));
        }
    },

    saveState() {
        localStorage.setItem('app_products', JSON.stringify(this.state.products));
        localStorage.setItem('app_cart', JSON.stringify(this.state.cart));
        localStorage.setItem('app_sales', JSON.stringify(this.state.sales));
        localStorage.setItem('app_orders', JSON.stringify(this.state.orders));
        localStorage.setItem('app_reports', JSON.stringify(this.state.financialReports));
        this.renderAll();
    },

    addToCart(productId, selectedSize = null) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product || product.stockCount <= 0) return alert('Out of stock!');

        let size = selectedSize;
        if (product.sizes && product.sizes.length > 0 && !size) {
            const activeSizeBtn = document.querySelector('#detail-sizes-grid button.bg-on-surface');
            if (activeSizeBtn) {
                size = activeSizeBtn.textContent;
            } else {
                return alert('Please select a size first.');
            }
        }

        const cartId = size ? `${productId}-${size}` : productId;
        const totalInCartForProduct = this.state.cart.filter(c => c.id === productId).reduce((sum, c) => sum + c.quantity, 0);
        const existingCartItem = this.state.cart.find(c => c.cartId === cartId);
        
        if (existingCartItem) {
            if (totalInCartForProduct < product.stockCount) {
                existingCartItem.quantity++;
            } else {
                alert(`Cannot add more. Only ${product.stockCount} left in total stock.`);
            }
        } else {
            if (totalInCartForProduct < product.stockCount) {
                this.state.cart.push({ ...product, cartId: cartId, size: size, quantity: 1, selectedColorColorName: document.getElementById('detail-image')?.src });
            } else {
                alert(`Cannot add more. Only ${product.stockCount} left in total stock.`);
            }
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
            
            if (delta > 0 && totalInCartForProduct >= product.stockCount) {
                alert(`Cannot add more. Only ${product.stockCount} left in total stock.`);
                return;
            }
            if (newQty <= 0) {
                this.removeFromCart(cartId);
            } else {
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

    checkout(customerDetails) {
        if (this.state.cart.length === 0) return;

        try {
            // Extension Audit: Secure Absolute Truth loading against Console Manipulation
            const absoluteProductsSource = JSON.parse(localStorage.getItem('app_products')) || defaultProducts;
            let orderTotal = 0;
            let itemsSold = 0;

            for (const cartItem of this.state.cart) {
                // Reference the immutable source of truth, not potentially tampered this.state.products
                const trueProduct = absoluteProductsSource.find(p => p.id === cartItem.id);
                
                if (!trueProduct) {
                    throw new Error(`Product ${cartItem.id} no longer exists.`);
                }

                if (trueProduct.stockCount < cartItem.quantity) {
                    throw new Error(`Insufficient stock for ${trueProduct.name}. We only have ${trueProduct.stockCount} left.`);
                }

                // Deduct from true source
                trueProduct.stockCount -= cartItem.quantity;
                orderTotal += (trueProduct.price * cartItem.quantity);
                itemsSold += cartItem.quantity;

                // Sync back to live state to instantly reflect UI without full reload
                const liveProduct = this.state.products.find(p => p.id === trueProduct.id);
                if (liveProduct) liveProduct.stockCount = trueProduct.stockCount;
            }

            this.state.sales.totalRevenue += orderTotal;
            this.state.sales.totalItemsSold += itemsSold;

            // Generate Order
            const newOrder = {
                id: `ORD-${Date.now()}`,
                date: new Date().toISOString(),
                customerInfo: customerDetails || { name: "Guest", email: "guest@example.com", address: "To verify", phone: "N/A" },
                items: [...this.state.cart],
                totalAmount: orderTotal,
                status: 'Pending'
            };
            this.state.orders.push(newOrder);
            
            // Wipe cart and sync true changes to localStorage
            this.state.cart = [];
            localStorage.setItem('app_products', JSON.stringify(absoluteProductsSource));
            this.saveState();
            
            this.showToast('Order processed successfully!', 'success');
        } catch (error) {
            console.error('Checkout Security Error:', error);
            this.showToast(error.message, 'error');
            throw error; // Re-throw so checkout.html can handle the modal fallback
        }
    },

    updateOrderStatus(orderId, newStatus) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            this.saveState();
        }
    },

    saveFinancialReport(report) {
         this.state.financialReports.push({
             id: `REP-${Date.now()}`,
             date: new Date().toISOString(),
             ...report
         });
         this.saveState();
    },

    getBestSellingProduct() {
        const salesCount = {};
        for (const order of this.state.orders) {
            for (const item of order.items) {
                if (!salesCount[item.id]) {
                    salesCount[item.id] = { count: 0, name: item.name };
                }
                salesCount[item.id].count += item.quantity;
            }
        }
        
        let best = { count: 0, name: "N/A" };
        for (const id in salesCount) {
            if (salesCount[id].count > best.count) {
                best = salesCount[id];
            }
        }
        return best;
    },

    sanitizeString(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },
    
    async addNewProduct(productData) {
        // Deep recursive sanitization
        const sanitizeObj = (obj, isDescription = false) => {
            if (typeof obj === 'string') {
                // Allow HTML for descriptions (from Quill)
                if (isDescription) return obj; 
                return this.sanitizeString(obj);
            }
            if (Array.isArray(obj)) return obj.map(item => sanitizeObj(item));
            if (typeof obj === 'object' && obj !== null) {
                const newObj = {};
                for (let key in obj) {
                    newObj[key] = sanitizeObj(obj[key], key === 'description');
                }
                return newObj;
            }
            return obj;
        };

        const prodId = `prod-${Date.now()}`;
        
        // Handle Video Upload (IndexedDB)
        if (productData.videoFile instanceof Blob) {
            const videoId = `vid-${prodId}`;
            await this.mediaDB.save(videoId, productData.videoFile);
            productData.videoUrl = videoId; // Using ID as URL reference for internal lookup
            delete productData.videoFile;
        }

        const safeProduct = sanitizeObj(productData);

        this.state.products.unshift({
            id: prodId,
            ...safeProduct
        });
        this.saveState();
    },

    async updateProduct(id, productData) {
        // Find existing product
        const index = this.state.products.findIndex(p => p.id === id);
        if (index === -1) return;

        const oldProduct = this.state.products[index];

        // Sanitization logic
        const sanitizeObj = (obj, isDescription = false) => {
            if (typeof obj === 'string') {
                if (isDescription) return obj; 
                return this.sanitizeString(obj);
            }
            if (Array.isArray(obj)) return obj.map(item => sanitizeObj(item));
            if (typeof obj === 'object' && obj !== null) {
                const newObj = {};
                for (let key in obj) {
                    newObj[key] = sanitizeObj(obj[key], key === 'description');
                }
                return newObj;
            }
            return obj;
        };

        // Handle Video Update
        if (productData.videoFile instanceof Blob) {
            // Delete old IndexedDB video if it exists
            if (oldProduct.videoUrl && oldProduct.videoUrl.startsWith('vid-')) {
                await this.mediaDB.delete(oldProduct.videoUrl);
            }
            const videoId = `vid-${id}`;
            await this.mediaDB.save(videoId, productData.videoFile);
            productData.videoUrl = videoId;
            delete productData.videoFile;
        } else if (!productData.videoUrl && oldProduct.videoUrl) {
            // If video was removed in UI
             if (oldProduct.videoUrl.startsWith('vid-')) {
                await this.mediaDB.delete(oldProduct.videoUrl);
            }
        }

        const safeProduct = sanitizeObj(productData);

        this.state.products[index] = {
            ...oldProduct,
            ...safeProduct
        };
        this.saveState();
    },
    
    async deleteProduct(id) {
        const product = this.state.products.find(p => p.id === id);
        if (product && product.videoUrl && product.videoUrl.startsWith('vid-')) {
            await this.mediaDB.delete(product.videoUrl);
        }
        this.state.products = this.state.products.filter(p => p.id !== id);
        this.state.cart = this.state.cart.filter(c => c.id !== id);
        this.saveState();
    },

    getCartTotals() {
        const subtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { subtotal, shipping: 0, total: subtotal };
    },

    setSearchTerm(query) {
        const cleanQuery = (query || '').toLowerCase().trim();
        this.state.searchTerm = cleanQuery;
        sessionStorage.setItem('app_search_term', cleanQuery);
        console.log(`SearchTerm set to: "${cleanQuery}"`);
        this.renderProductsList();
    },

    // UI RENDERERS
    renderAll() {
        this.renderCartSidebar();
        this.renderProductsList();
        this.renderProductDetails();
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

    formatMoney(amount) {
        return `৳${amount.toFixed(2)}`;
    },

    injectCartHTML() {
        if (document.getElementById('global-cart-wrapper')) return;
        
        const cartWrapper = document.createElement('div');
        cartWrapper.id = 'global-cart-wrapper';
        cartWrapper.className = 'fixed inset-0 z-[100] hidden opacity-0 transition-opacity duration-300';
        cartWrapper.innerHTML = `
            <div data-action="close-cart" class="absolute inset-0 bg-on-surface/40 backdrop-blur-[2px]"></div>
            <aside id="global-cart-sidebar" class="absolute right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl flex flex-col translate-x-full transition-transform duration-300">
                <header class="p-8 pb-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h2 class="text-lg font-bold">Shopping Bag</h2>
                    </div>
                    <button data-action="close-cart" class="text-gray-500 hover:text-black">
                        <span class="material-symbols-outlined" style="pointer-events: none;">close</span>
                    </button>
                </header>
                <div id="cart-items-container" class="flex-grow overflow-y-auto p-8 flex flex-col gap-8">
                </div>
                <footer class="p-8 bg-gray-50 border-t border-gray-200">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
                        <span id="cart-sidebar-subtotal" class="text-xl font-bold">৳0.00</span>
                    </div>
                    <a href="checkout.html" class="w-full bg-gray-800 text-white py-4 flex justify-center text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors">
                        Proceed to Checkout
                    </a>
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

        const totals = this.getCartTotals();
        subtotalEl.textContent = this.formatMoney(totals.subtotal);

        if (this.state.cart.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center mt-10">
                    <p class="text-gray-500 text-sm mb-6">Your cart is empty. Start shopping!</p>
                    <button data-action="close-cart" class="border border-gray-300 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Close</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.state.cart.map(item => `
            <div class="flex gap-4">
                <div class="w-20 h-28 bg-gray-100 flex-shrink-0">
                    <img src="${item.selectedColorColorName || (item.images && item.images[0] ? item.images[0] : './placeholder.jpg')}" class="w-full h-full object-cover" alt="${item.name}" />
                </div>
                <div class="flex flex-col justify-between flex-grow">
                    <div>
                        <div class="flex justify-between items-start gap-2 min-w-0">
                            <h3 class="text-sm font-bold text-gray-900 break-words line-clamp-2 flex-1 min-w-0">${item.name} ${item.size ? `(${item.size})` : ''}</h3>
                            <button data-action="remove-item" data-id="${item.cartId}" class="text-gray-400 hover:text-red-700 transition-colors">
                                <span class="material-symbols-outlined text-sm" style="pointer-events: none;">delete</span>
                            </button>
                        </div>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${item.category}</p>
                    </div>
                    <div class="flex justify-between items-end">
                        <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 px-2 py-1">
                            <button data-action="decrease-qty" data-id="${item.cartId}" class="text-xs px-2 hover:text-black transition-colors">-</button>
                            <span class="text-xs font-medium w-4 text-center">${item.quantity}</span>
                            <button data-action="increase-qty" data-id="${item.cartId}" class="text-xs px-2 hover:text-black transition-colors">+</button>
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
        const products = this.state.products;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-32 text-center animate-fade-in">
                    <p class="text-on-surface-variant font-headline text-2xl tracking-tight italic">Coming Soon: Curated Collection</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            const isOutOfStock = product.stockCount === 0;
            const isLowStock = product.stockCount > 0 && product.stockCount <= 5;

            const productEl = document.createElement('div');
            productEl.className = 'group flex flex-col cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative';
            productEl.setAttribute('data-action', 'view-details');
            productEl.setAttribute('data-id', product.id);
            
            productEl.innerHTML = `
                <div class="relative overflow-hidden bg-surface-container-low aspect-square mb-6">
                    <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-70' : ''}" src="${product.images[0]}" />
                    
                    ${isLowStock ? `
                        <div class="absolute top-4 left-4 z-10">
                            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 text-[10px] tracking-widest uppercase font-bold border border-yellow-200 shadow-sm">
                                Only ${product.stockCount} left!
                            </span>
                        </div>
                    ` : ''}

                    ${isOutOfStock ? `
                        <div class="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                            <span class="bg-gray-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-xl">Out of Stock</span>
                        </div>
                    ` : ''}
                </div>
                <div class="flex justify-between items-start gap-4">
                    <div class="min-w-0 flex-grow">
                        <h3 class="font-headline text-lg font-bold tracking-tight text-on-surface truncate ${isOutOfStock ? 'text-gray-400' : ''}">${product.name}</h3>
                        <p class="font-body text-[10px] tracking-widest uppercase mt-1 text-on-surface-variant">${product.category}</p>
                    </div>
                    <span class="font-headline text-lg font-medium shrink-0 ${isOutOfStock ? 'text-gray-400' : ''}">${this.formatMoney(product.price)}</span>
                </div>
            `;
            container.appendChild(productEl);
        });
    },

    renderOrderSummaryIfCheckout() {
        const summaryContainer = document.getElementById('checkout-order-summary');
        if (!summaryContainer) return;

        const totals = this.getCartTotals();
        
        let itemsHtml = this.state.cart.map(item => `
            <div class="flex gap-4 group">
                <div class="w-20 h-28 bg-gray-100 flex-shrink-0">
                    <img src="${item.selectedColorColorName || (item.images && item.images[0] ? item.images[0] : './placeholder.jpg')}" class="w-full h-full object-cover" alt="${item.name}" />
                </div>
                <div class="flex flex-col justify-between flex-grow py-1 min-w-0">
                    <div>
                        <div class="flex justify-between items-start gap-2 min-w-0">
                            <h4 class="font-bold text-sm text-gray-900 break-words line-clamp-2 flex-1 min-w-0">${item.name} ${item.size ? `(${item.size})` : ''}</h4>
                            <button data-action="remove-item" data-id="${item.cartId}" class="text-gray-400 hover:text-red-700 transition-colors">
                                <span class="material-symbols-outlined text-sm" style="pointer-events: none;">delete</span>
                            </button>
                        </div>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">${item.category}</p>
                    </div>
                    <div class="flex justify-between items-end">
                        <div class="flex items-center gap-3 bg-gray-50 border border-gray-200 px-2 py-1">
                            <button data-action="decrease-qty" data-id="${item.cartId}" class="text-xs px-2 hover:text-black transition-colors">-</button>
                            <span class="text-xs font-medium w-4 text-center">${item.quantity}</span>
                            <button data-action="increase-qty" data-id="${item.cartId}" class="text-xs px-2 hover:text-black transition-colors">+</button>
                        </div>
                        <span class="font-bold text-sm">${this.formatMoney(item.price * item.quantity)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        summaryContainer.innerHTML = `
            <div class="space-y-6 mb-8">${itemsHtml}</div>
            <div class="pt-6 border-t border-gray-200 space-y-4">
                <div class="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                    <span>Subtotal</span>
                    <span>${this.formatMoney(totals.subtotal)}</span>
                </div>
            </div>
            <div class="pt-6 border-t border-gray-200 flex justify-between items-baseline mt-6">
                <span class="text-lg font-bold">Total</span>
                <span class="text-2xl font-extrabold tracking-tighter">${this.formatMoney(totals.total)}</span>
            </div>
        `;
    },

    renderProductDetails() {
        if (!document.getElementById('detail-title')) return;
        
        const params = new URLSearchParams(window.location.search);
        let productId = params.get('id');
        
        if (!productId && this.state.products.length > 0) {
            productId = this.state.products[0].id;
        }

        const product = this.state.products.find(p => p.id === productId);
        if (!product) {
            const mainEl = document.querySelector('main');
            if(mainEl) {
                mainEl.textContent = '';
                const errorDiv = document.createElement('div');
                errorDiv.className = "flex flex-col items-center justify-center min-h-[50vh]";
                const h1 = document.createElement('h1');
                h1.className = "text-4xl font-headline font-bold mb-4";
                h1.textContent = "Product Not Found";
                const p = document.createElement('p');
                p.className = "text-on-surface-variant font-body mb-8";
                p.textContent = "The item you requested could not be located.";
                const a = document.createElement('a');
                a.href = "index.html";
                a.className = "bg-primary py-3 px-6 text-on-primary font-bold uppercase tracking-widest text-xs hover:opacity-90";
                a.textContent = "Return to Shop";
                errorDiv.appendChild(h1);
                errorDiv.appendChild(p);
                errorDiv.appendChild(a);
                mainEl.appendChild(errorDiv);
            }
            return;
        }

        const isOutOfStock = product.stockCount === 0;

        const mainImgElem = document.getElementById('detail-image');
        if (mainImgElem && product.images && product.images.length > 0) {
            mainImgElem.src = product.images[0];
            mainImgElem.alt = product.name || "Product Image";
        }
        
        // Product Views Gallery with Lazy Loading
        const thumbnailsBar = document.getElementById('detail-thumbnails-bar');
        const allAvailableImages = [];
        if(product.images && product.images.length > 0) {
            allAvailableImages.push(product.images[0]);
        }
        if (product.galleryImages && product.galleryImages.length > 0) {
            allAvailableImages.push(...product.galleryImages);
        }

        if (thumbnailsBar) {
            thumbnailsBar.textContent = ''; // safe clear
            if (allAvailableImages.length > 1) {
                thumbnailsBar.style.display = 'flex';
                allAvailableImages.forEach(imgSrc => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    // We dispatch swap-image action. Event Delegation is already configured in global listener.
                    btn.setAttribute('data-action', 'swap-image');
                    btn.setAttribute('data-img-url', imgSrc);
                    btn.className = 'w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden border-2 border-transparent hover:border-gray-900 transition-colors focus:outline-none';
                    
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.loading = 'lazy';
                    img.className = 'w-full h-full object-cover pointer-events-none';
                    
                    btn.appendChild(img);
                    thumbnailsBar.appendChild(btn);
                });
            } else {
                thumbnailsBar.style.display = 'none';
            }
        }

        const catElem = document.getElementById('detail-category');
        if (catElem) catElem.textContent = product.category || "";
        
        const titleElem = document.getElementById('detail-title');
        if (titleElem) titleElem.textContent = product.name || "";
        
        const priceElem = document.getElementById('detail-price');
        if (priceElem) priceElem.textContent = this.formatMoney(product.price);
        
        // Rendering Data Presence
        console.log('Rendering Product Details for:', product.id);

        // Hide size section if product.sizes is empty
        const sizeSection = document.getElementById('detail-size-section');
        const sizesGrid = document.getElementById('detail-sizes-grid');
        if (sizeSection && sizesGrid) {
            sizesGrid.textContent = '';
            if (product.sizes && product.sizes.length > 0) {
                sizeSection.style.display = 'block';
                product.sizes.forEach((s, idx) => {
                    const btn = document.createElement('button');
                    btn.className = `size-btn py-3 text-xs transition-colors ${idx === 0 ? 'bg-on-surface text-background' : 'bg-surface-container-low hover:bg-surface-variant'}`;
                    btn.textContent = s;
                    sizesGrid.appendChild(btn);
                });
                
                const sBtns = sizesGrid.querySelectorAll('.size-btn');
                sBtns.forEach(b => b.addEventListener('click', () => {
                    sBtns.forEach(sibling => sibling.className = 'size-btn py-3 text-xs bg-surface-container-low hover:bg-surface-variant transition-colors');
                    b.className = 'size-btn py-3 text-xs bg-on-surface text-background transition-colors';
                }));
            } else {
                sizeSection.style.display = 'none';
            }
        }

        // Restore Color Circles and Swap Logic
        const colorsContainer = document.getElementById('detail-colors-container');
        if (colorsContainer) {
            colorsContainer.textContent = '';
            if (product.colors && product.colors.length > 0) {
                const defaultColor = product.colors[0];
                const colorLabel = document.getElementById('detail-color-label');
                if(colorLabel) colorLabel.textContent = `Color / ${defaultColor.colorName}`;
                
                product.colors.forEach(c => {
                    const btn = document.createElement('button');
                    btn.setAttribute('data-action', 'swap-image');
                    // Store colorName on the button so click handler updates the label
                    btn.setAttribute('data-img-url', c.colorImage);
                    btn.setAttribute('data-color-name', c.colorName);
                    btn.className = 'w-8 h-8 rounded-full border border-gray-300 hover:scale-110 transition-transform overflow-hidden shadow-sm flex-shrink-0';
                    
                    const img = document.createElement('img');
                    img.src = c.colorImage;
                    img.className = 'w-full h-full object-cover pointer-events-none';
                    btn.appendChild(img);
                    
                    colorsContainer.appendChild(btn);
                });
            }
        }

        // Refine Details (Tabbed Interface Logic)
        const extrasSection = document.getElementById('detail-extras-section');
        const refinedDetailsElem = document.getElementById('refined-details');
        const tabButtons = document.querySelectorAll('.detail-tab-toggle');
        const tabPanes = document.querySelectorAll('.tab-content-panel');
        const descElem = document.getElementById('product-description');

        if (descElem) {
            // Explicit Force Logic per User Request
            descElem.innerHTML = product.description || '<p class="text-sm italic text-on-surface-variant opacity-60">No description available.</p>';
            descElem.style.display = 'block';
            descElem.classList.remove('hidden');
        }

        if (extrasSection) {
            const hasDescription = !!product.description && product.description !== '<p><br></p>';
            const hasSpecs = (product.detailsList && product.detailsList.length > 0);
            const hasDirectSpecs = !!product.refinedDetails;
            const hasFeatures = (product.features && product.features.length > 0);

            // Always show the section if we have any data to show
            extrasSection.style.display = (hasDescription || hasSpecs || hasDirectSpecs || hasFeatures) ? 'block' : 'none';

            // Populate Specifications Tab
            if (refinedDetailsElem) {
                refinedDetailsElem.innerHTML = '';
                
                if (hasDirectSpecs) {
                    refinedDetailsElem.innerHTML = product.refinedDetails;
                } else if (hasSpecs) {
                    // Render the structured list (Matches add-product.html schema)
                    product.detailsList.forEach(d => {
                        const li = document.createElement('li');
                        li.className = 'flex flex-col gap-1 border-b border-outline-variant/20 pb-4';
                        li.innerHTML = `
                            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">${d.title || 'Detail'}</span>
                            <span class="text-xs font-semibold text-on-surface">${d.value || d}</span>
                        `;
                        refinedDetailsElem.appendChild(li);
                    });
                } else if (hasFeatures) {
                    product.features.forEach(f => {
                        const li = document.createElement('li');
                        li.className = 'flex items-start gap-3 text-xs text-on-surface-variant font-medium';
                        li.innerHTML = `
                            <span class="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                            <span class="leading-relaxed">${f}</span>
                        `;
                        refinedDetailsElem.appendChild(li);
                    });
                } else {
                    refinedDetailsElem.innerHTML = '<li class="text-xs text-on-surface-variant opacity-50 italic">Details are pending update.</li>';
                }
            }

            // Tab Switching Interactions
            tabButtons.forEach(btn => {
                btn.onclick = () => {
                    const tabId = btn.getAttribute('data-tab');
                    tabButtons.forEach(b => {
                        const span = b.querySelector('span:first-child');
                        if (span) span.classList.add('opacity-40');
                    });
                    const activeSpan = btn.querySelector('span:first-child');
                    if (activeSpan) activeSpan.classList.remove('opacity-40');
                    tabPanes.forEach(pane => {
                        pane.classList.add('hidden');
                        if (pane.id === `tab-pane-${tabId}`) pane.classList.remove('hidden');
                    });
                };
            });
        }

        // Additional Product Views below hero image (Editorial Mosaic)
        const gallerySection = document.getElementById('detail-quote-section');
        if (gallerySection) {
            gallerySection.style.display = 'block';
            const img1 = document.getElementById('detail-gallery-img-1');
            const img2 = document.getElementById('detail-gallery-img-2');
            const img3 = document.getElementById('detail-gallery-img-3');
            
            if (product.galleryImages && product.galleryImages.length > 0) {
                if (img1 && product.galleryImages[0]) {
                    img1.src = product.galleryImages[0];
                    img1.loading = "lazy";
                }
                if (img2 && product.galleryImages[1]) {
                    img2.src = product.galleryImages[1];
                    img2.loading = "lazy";
                }
                if (img3) {
                    // Fallback to Image 3 if exists, else fallback to Image 1 as a placeholder mosaic
                    img3.src = product.galleryImages[2] || product.galleryImages[0];
                    img3.loading = "lazy";
                }
            } else {
                // Professional fallback mosaic
                if (img1) img1.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBzQvh6NVOC4B5O_zs6Woah1Kmo-sZJ1mOJPmuvmuJNFgsSrVqoML_VwQ2Zar-qRytjeBjs7i8oWdKSAUHikJfg8lNrVjYz6Z-htHEjjcLtS7kJeYIZrTRq1GBC-EGMv8zkuZ4wyu0o5y6Gdgu_XKzJDfJl8NpUnp5M9CW9BP7Dlclrrn42Fja_bga8wNmT_VaFPzrogBSe3Net8y5zGLIRbpuz2ZJZF5VIUjK9ViVUhSfZMDS6EokQFS2Nqp6pjXcDqZ9JxnQhA6s";
                if (img2) img2.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA8xVRnSAbfgaXL5ppat03aAyof9NPgHBPb2I9Gx9jqiQrv2-mpC7PirCOdIvTIbO7ASj73pPSqmSoij5FBEEpmNP1yJncO100pHBPvpJnaGRAwp8Yth446DfU2DcMxRoJOvCL11-L-7Jdnd46HKCTdyfU4iiz7hUQmp3pS7RGuSHMVyZ5M7wYvqSkY9wqgxoz4CHX5aAxy4YgwbezlWr1cu00o7nKssmTw_xEUYEjEl48KK3asbgHV0-IXvNldXRxtsRxe7OEEyw4";
                if (img3) img3.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCH1ZVRnSAbfgaXL5ppat03aAyof9NPgHBPb2I9Gx9jqiQrv2-mpC7PirCOdIvTIbO7ASj73pPSqmSoij5FBEEpmNP1yJncO100pHBPvpJnaGRAwp8Yth446DfU2DcMxRoJOvCL11-L-7Jdnd46HKCTdyfU4iiz7hUQmp3pS7RGuSHMVyZ5M7wYvqSkY9wqgxoz4CHX5aAxy4YgwbezlWr1cu00o7nKssmTw_xEUYEjEl48KK3asbgHV0-IXvNldXRxtsRxe7OEEyw4";
            }
        }

        const videoSection = document.getElementById('detail-video-section');
        if (videoSection) {
             const videoPlayer = document.getElementById('detail-video-player');
             if (product.videoUrl && product.videoUrl.trim() !== '') {
                 videoSection.style.display = 'block';
                 if (videoPlayer) {
                     // Check if it's an IndexedDB reference
                     if (product.videoUrl.startsWith('vid-')) {
                         this.mediaDB.get(product.videoUrl).then(blob => {
                             if (blob) {
                                 videoPlayer.src = URL.createObjectURL(blob);
                             }
                         }).catch(err => console.error("Video load error:", err));
                     } else {
                         videoPlayer.src = product.videoUrl;
                     }
                 }
             } else {
                 videoSection.style.display = 'none';
             }
        }

        ['detail-add-btn', 'detail-add-btn-mobile'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.setAttribute('data-id', product.id);
                btn.textContent = ''; // clear securely
                if (isOutOfStock) {
                    btn.disabled = true;
                    btn.classList.add('bg-gray-400', 'cursor-not-allowed', 'opacity-50');
                    if (btnId.includes('mobile')) {
                        const icon = document.createElement('span');
                        icon.className = 'material-symbols-outlined';
                        icon.textContent = 'shopping_cart';
                        icon.style.pointerEvents = 'none';
                        btn.appendChild(icon);
                        btn.appendChild(document.createTextNode(' Out of Stock'));
                    } else {
                        btn.textContent = 'Out of Stock';
                    }
                } else {
                    btn.disabled = false;
                    btn.classList.remove('bg-gray-400', 'cursor-not-allowed', 'opacity-50');
                    if (btnId.includes('mobile')) {
                        const icon = document.createElement('span');
                        icon.className = 'material-symbols-outlined';
                        icon.textContent = 'shopping_cart';
                        icon.style.pointerEvents = 'none';
                        btn.appendChild(icon);
                        btn.appendChild(document.createTextNode(' Add to Bag'));
                    } else {
                        btn.textContent = 'Add to Shopping Bag';
                    }
                }
            }
        });
    },

    openCart() {
        const w = document.getElementById('global-cart-wrapper');
        const s = document.getElementById('global-cart-sidebar');
        if(!w || !s) return;
        w.classList.remove('hidden');
        setTimeout(() => {
            w.classList.remove('opacity-0');
            s.classList.remove('translate-x-full');
        }, 10);
    },

    closeCart() {
        const w = document.getElementById('global-cart-wrapper');
        const s = document.getElementById('global-cart-sidebar');
        if(!w || !s) return;
        w.classList.add('opacity-0');
        s.classList.add('translate-x-full');
        setTimeout(() => w.classList.add('hidden'), 300);
    }
};

// Global Event Delegation
document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');

    if (action === 'add-to-cart') {
        window.AppStore.addToCart(id);
    } else if (action === 'increase-qty') {
        window.AppStore.updateCartQuantity(id, 1);
    } else if (action === 'decrease-qty') {
        window.AppStore.updateCartQuantity(id, -1);
    } else if (action === 'remove-item') {
        window.AppStore.removeFromCart(id);
    } else if (action === 'open-cart') {
        window.AppStore.openCart();
    } else if (action === 'close-cart') {
        window.AppStore.closeCart();
    } else if (action === 'view-details') {
        const url = `details.html?id=${id}`;
        window.history.pushState({}, '', url);
        if (window.handleRouting) window.handleRouting(url);
    } else if (action === 'swap-image') {
        const newImgUrl = target.getAttribute('data-img-url');
        const colorName = target.getAttribute('data-color-name');
        document.getElementById('detail-image').src = newImgUrl;
        document.getElementById('detail-color-label').textContent = `Color / ${colorName}`;
    } else if (action === 'go-back') {
        window.history.back();
    }
});

window.initStoreUI = function() {
    window.AppStore.renderAll();
    
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm && !checkoutForm.dataset.storeBound) {
        checkoutForm.dataset.storeBound = 'true';
        checkoutForm.addEventListener('submit', (evt) => {
            evt.preventDefault();
            
            if (window.AppStore.state.cart.length === 0) {
                alert('Your cart is empty.');
                return;
            }

            const customerDetails = {
                name: document.getElementById('c-name')?.value || "Guest",
                email: document.getElementById('c-email')?.value || "N/A",
                phone: document.getElementById('c-phone')?.value || "N/A",
                address: `${document.getElementById('c-address')?.value || ''}, ${document.getElementById('c-city')?.value || ''}, ${document.getElementById('c-postcode')?.value || ''}`.trim().replace(/^, |, $/g, '')
            };
            
            window.AppStore.checkout(customerDetails);
            
            const modal = document.getElementById('order-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);
            }
        });
    }

    // Modal Close Logic
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn && !closeModalBtn.dataset.bound) {
        closeModalBtn.dataset.bound = 'true';
        closeModalBtn.addEventListener('click', () => {
            const modal = document.getElementById('order-modal');
            if (modal) {
                modal.classList.add('opacity-0');
                setTimeout(() => {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                    if (window.handleRouting) {
                        window.history.pushState({ path: 'index.html' }, '', 'index.html');
                        window.handleRouting('index.html');
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 500);
            }
        });
    }

};

document.addEventListener('DOMContentLoaded', () => {
    window.initStoreUI();
});
