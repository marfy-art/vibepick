const defaultProducts = [
    {
        id: "prod-001",
        name: "Structured Wool Overcoat",
        category: "Outerwear",
        price: 840.00,
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDlN_fhUFRc_vr0Cqa5jXXI6lCAU3hjFM0rNwg3Ho1eKmmTM1Udvowcgf8MYGjNUTSSDhFGu4c8pBqJOBT9EuUkWPYDaOC-9JHQ_BCpsXf26UHjrT82Lo8zsKv4NH2a2namJs0VA79H-wbPY6LM5LWf3PjkrkU4UoA3cpoLjHBT2cjZJkFw3Lpl4XU-TEFhA2kxMd9N84-LGDkBmRa0R6S_x4LTIfsujjjGoaeo9JT7imDLbqDCn9FwfMOLnSkI2NmuTHiliU0glNY"],
        stockCount: 6,
        description: "Anthracite Grey",
        colors: [
            { colorName: "Graphite Gray", colorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlN_fhUFRc_vr0Cqa5jXXI6lCAU3hjFM0rNwg3Ho1eKmmTM1Udvowcgf8MYGjNUTSSDhFGu4c8pBqJOBT9EuUkWPYDaOC-9JHQ_BCpsXf26UHjrT82Lo8zsKv4NH2a2namJs0VA79H-wbPY6LM5LWf3PjkrkU4UoA3cpoLjHBT2cjZJkFw3Lpl4XU-TEFhA2kxMd9N84-LGDkBmRa0R6S_x4LTIfsujjjGoaeo9JT7imDLbqDCn9FwfMOLnSkI2NmuTHiliU0glNY" }
        ],
        videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJbabA0DFXJ2LgGOGUSpgF974q6ceVmzMxMZWmtp097jhVzFEOqTlUTafe8zd7Tqi5qX5wZlpVoPs296hwbWGLIQ_KM8AqANGGUdN6XldnBtqV912UIZiHoFPXSd3JJ1iOB_SbE12yXZ3m_yf_07oPtNlEiB1LKf5-1zhbvHjXu3VNRHeEFfZVLGhCFIse4Z-t3k6GDNG6DK1oq4h_y0JZhFZ1vcPHUZKKPFpL9rsXNRr1OeHYzb5-C2QWlvRPnyEX5lHUSzwMzTM",
        refinedDetails: {
            title: "Refined details for the modern collector.",
            text: "This overcoat is crafted from premium wool, ensuring both warmth and style. The classic cut is timeless."
        },
        sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
        id: "prod-002",
        name: "Raw Silk Blouse",
        category: "Tops",
        price: 320.00,
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCqXwMJGwn895CNxYIXrsa4fiTdwrd4nRmKWpNI2sk0XGeqh36L_FhAn1GC7wKvV-4EWF_8gFI18X3dsZPiYWwW8vvIxLFiJHJVU7QFnnpKJiUwEwYTfKfGy6I9vbqx-We9xpFV1BGyy-xq1Uc-adC0xlTaR6RcS5JNokhO42SvFEk26gtbnL85DitsmEfOI_BKlrOBflHML_KzRB5khnTMYZ4ggjvvpQavLcHS3WbK166X0jRIYTO20aO34y5oi6qOca7j56R0BDY"],
        stockCount: 2,
        description: "Ivory White",
        colors: [
            { colorName: "Ivory White", colorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqXwMJGwn895CNxYIXrsa4fiTdwrd4nRmKWpNI2sk0XGeqh36L_FhAn1GC7wKvV-4EWF_8gFI18X3dsZPiYWwW8vvIxLFiJHJVU7QFnnpKJiUwEwYTfKfGy6I9vbqx-We9xpFV1BGyy-xq1Uc-adC0xlTaR6RcS5JNokhO42SvFEk26gtbnL85DitsmEfOI_BKlrOBflHML_KzRB5khnTMYZ4ggjvvpQavLcHS3WbK166X0jRIYTO20aO34y5oi6qOca7j56R0BDY" }
        ],
        sizes: ["S", "M"]
    },
    {
        id: "prod-003",
        name: "Architectural Heel",
        category: "Footwear",
        price: 560.00,
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCJDlOvAew9MtVZnYIuZg_fJd1kVHgUI9DwBjMFxXe6FCPuNHny4jtm4yJyDgxanjORZNtYtSXlCZs5dHuAgX6_eP97rFCcCxUsM92djw6Y6tTwi15pv5lKGYIuFHyHXztT3AYgU4K1PSZSCTSKZ2C__qe-PfGxD7IyvCCG3PNX_il7BZRN-YtU6VIl-4cjOKHmhjtrWhGUbzU-7X2ubJdvoYmNp3w4IAhBUmrJ_9ted1CNBjAFYEFXksaTNS_73Dkif2eTPJk7hPY"],
        stockCount: 0,
        description: "Matte Black Leather",
        colors: [
            { colorName: "Matte Black", colorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJDlOvAew9MtVZnYIuZg_fJd1kVHgUI9DwBjMFxXe6FCPuNHny4jtm4yJyDgxanjORZNtYtSXlCZs5dHuAgX6_eP97rFCcCxUsM92djw6Y6tTwi15pv5lKGYIuFHyHXztT3AYgU4K1PSZSCTSKZ2C__qe-PfGxD7IyvCCG3PNX_il7BZRN-YtU6VIl-4cjOKHmhjtrWhGUbzU-7X2ubJdvoYmNp3w4IAhBUmrJ_9ted1CNBjAFYEFXksaTNS_73Dkif2eTPJk7hPY" }
        ]
    }
];

window.AppStore = {
    state: {
        categories: JSON.parse(localStorage.getItem('app_categories')) || ["Outerwear", "Tops", "Footwear", "Accessories"],
        products: JSON.parse(localStorage.getItem('app_products')) || defaultProducts,
        cart: JSON.parse(localStorage.getItem('app_cart')) || [],
        sales: JSON.parse(localStorage.getItem('app_sales')) || { totalRevenue: 0, totalItemsSold: 0 },
        orders: JSON.parse(localStorage.getItem('app_orders')) || [],
        financialReports: JSON.parse(localStorage.getItem('app_reports')) || []
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
    
    addNewProduct(productData) {
        // Deep recursive sanitization to protect against XSS
        const sanitizeObj = (obj) => {
            if (typeof obj === 'string') return this.sanitizeString(obj);
            if (Array.isArray(obj)) return obj.map(item => sanitizeObj(item));
            if (typeof obj === 'object' && obj !== null) {
                const newObj = {};
                for (let key in obj) newObj[key] = sanitizeObj(obj[key]);
                return newObj;
            }
            return obj;
        };
        const safeProduct = sanitizeObj(productData);

        this.state.products.unshift({
            id: `prod-${Date.now()}`,
            ...safeProduct
        });
        this.saveState();
    },
    
    deleteProduct(id) {
        this.state.products = this.state.products.filter(p => p.id !== id);
        this.state.cart = this.state.cart.filter(c => c.id !== id);
        this.saveState();
    },

    getCartTotals() {
        const subtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { subtotal, shipping: 0, total: subtotal };
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
                        <h2 class="text-lg font-bold">Your Selection</h2>
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
                    <img src="${item.images && item.images[0] ? item.images[0] : './placeholder.jpg'}" class="w-full h-full object-cover" alt="${item.name}" />
                </div>
                <div class="flex flex-col justify-between flex-grow">
                    <div>
                        <div class="flex justify-between items-start gap-2 min-w-0">
                            <h3 class="text-sm font-bold text-gray-900 truncate">${item.name} ${item.size ? `(${item.size})` : ''}</h3>
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
        this.state.products.forEach(product => {
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
                    <img src="${item.images && item.images[0] ? item.images[0] : './placeholder.jpg'}" class="w-full h-full object-cover" alt="${item.name}" />
                </div>
                <div class="flex flex-col justify-between flex-grow py-1">
                    <div>
                        <div class="flex justify-between items-start gap-2 min-w-0">
                            <h4 class="font-bold text-sm text-gray-900 truncate">${item.name} ${item.size ? `(${item.size})` : ''}</h4>
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

        // Refine Details (Technical Specs Grid)
        const featuresGrid = document.getElementById('detail-features-grid');
        const extrasSection = document.getElementById('detail-extras-section');
        const tabsMenu = document.getElementById('detail-tabs-menu');
        const secondaryDescEl = document.getElementById('detail-desc-secondary');

        if (extrasSection && secondaryDescEl) {
            if (product.detailsList && product.detailsList.length > 0) {
                extrasSection.style.display = 'block';
                if (tabsMenu) {
                    tabsMenu.style.display = 'block';
                    tabsMenu.textContent = '';
                    const h2 = document.createElement('h2');
                    h2.className = "text-3xl font-headline font-bold tracking-tighter mb-8";
                    h2.textContent = "Refined Details";
                    tabsMenu.appendChild(h2);
                }
                secondaryDescEl.textContent = product.description || "";
                
                if (featuresGrid) {
                    featuresGrid.style.display = 'grid';
                    featuresGrid.textContent = '';
                    product.detailsList.forEach(d => {
                        const li = document.createElement('li');
                        li.className = 'flex flex-col gap-1 border-b border-gray-200 pb-2 mt-2';
                        
                        const titleSpan = document.createElement('span');
                        titleSpan.className = 'font-bold tracking-widest text-[10px] uppercase text-on-surface-variant';
                        titleSpan.textContent = d.title;
                        
                        const valueSpan = document.createElement('span');
                        valueSpan.className = 'text-sm text-on-surface';
                        valueSpan.textContent = d.value;
                        
                        li.appendChild(titleSpan);
                        li.appendChild(valueSpan);
                        featuresGrid.appendChild(li);
                    });
                }
            } else if (product.features && product.features.length > 0) {
                extrasSection.style.display = 'block';
                if (tabsMenu) tabsMenu.style.display = 'none';
                secondaryDescEl.textContent = product.description || "";
                if (featuresGrid) {
                    featuresGrid.style.display = 'grid';
                    featuresGrid.textContent = '';
                    product.features.forEach(f => {
                        const li = document.createElement('li');
                        li.className = 'flex items-start gap-4';
                        
                        const check = document.createElement('span');
                        check.className = 'material-symbols-outlined text-secondary';
                        check.textContent = 'check_circle';
                        
                        const txt = document.createElement('span');
                        txt.textContent = f;
                        
                        li.appendChild(check);
                        li.appendChild(txt);
                        featuresGrid.appendChild(li);
                    });
                }
            } else {
                extrasSection.style.display = 'none';
            }
        }

        // Additional Product Views below hero image
        const gallerySection = document.getElementById('detail-quote-section');
        if (gallerySection) {
            if (product.galleryImages && product.galleryImages.length > 0) {
                gallerySection.style.display = 'block';
                const img1 = document.getElementById('detail-gallery-img-1');
                const img2 = document.getElementById('detail-gallery-img-2');
                if (img1 && product.galleryImages[0]) {
                    img1.src = product.galleryImages[0];
                    img1.loading = "lazy";
                }
                if (img2 && product.galleryImages[1]) {
                    img2.src = product.galleryImages[1];
                    img2.loading = "lazy";
                }
            } else {
                gallerySection.style.display = 'block';
                const img1 = document.getElementById('detail-gallery-img-1');
                const img2 = document.getElementById('detail-gallery-img-2');
                if (img1) img1.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBzQvh6NVOC4B5O_zs6Woah1Kmo-sZJ1mOJPmuvmuJNFgsSrVqoML_VwQ2Zar-qRytjeBjs7i8oWdKSAUHikJfg8lNrVjYz6Z-htHEjjcLtS7kJeYIZrTRq1GBC-EGMv8zkuZ4wyu0o5y6Gdgu_XKzJDfJl8NpUnp5M9CW9BP7Dlclrrn42Fja_bga8wNmT_VaFPzrogBSe3Net8y5zGLIRbpuz2ZJZF5VIUjK9ViVUhSfZMDS6EokQFS2Nqp6pjXcDqZ9JxnQhA6s";
                if (img2) img2.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA8xVRnSAbfgaXL5ppat03aAyof9NPgHBPb2I9Gx9jqiQrv2-mpC7PirCOdIvTIbO7ASj73pPSqmSoij5FBEEpmNP1yJncO100pHBPvpJnaGRAwp8Yth446DfU2DcMxRoJOvCL11-L-7Jdnd46HKCTdyfU4iiz7hUQmp3pS7RGuSHMVyZ5M7wYvqSkY9wqgxoz4CHX5aAxy4YgwbezlWr1cu00o7nKssmTw_xEUYEjEl48KK3asbgHV0-IXvNldXRxtsRxe7OEEyw4";
            }
        }

        const videoSection = document.getElementById('detail-video-section');
        if (videoSection) {
             const videoPlayer = document.getElementById('detail-video-player');
             if (product.videoUrl && product.videoUrl.trim() !== '') {
                 videoSection.style.display = 'block';
                 if (videoPlayer) videoPlayer.src = product.videoUrl;
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
                name: document.getElementById('c-fname')?.value + " " + document.getElementById('c-lname')?.value,
                email: document.getElementById('c-email')?.value,
                address: document.getElementById('c-address')?.value,
                phone: document.getElementById('c-phone')?.value
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
};

document.addEventListener('DOMContentLoaded', () => {
    window.initStoreUI();
});
