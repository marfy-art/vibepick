// main routing file (Vanilla JS SPA Router)
document.addEventListener('click', async (e) => {
    // Intercept clicks on links
    const link = e.target.closest('a');
    if (link && link.href && link.origin === window.location.origin && link.pathname.includes('.html')) {
        e.preventDefault();
        
        // 1. Validation Logic Before Redirecting to Checkout
        if (link.href.includes('checkout')) {
            console.log('Validating cart before proceeding to checkout...');
            if (window.AppStore && window.AppStore.state.cart.length === 0) {
                alert('Your cart is empty. Please add items before proceeding to checkout.');
                return; // halt routing
            }
        }

        const url = link.href;
        
        // 2. Trigger Navigation without Full Page Reload
        window.history.pushState({}, '', url);
        await window.handleRouting(url);
    }
});

// Handle Back/Forward buttons in the browser
window.addEventListener('popstate', async () => {
    await window.handleRouting(window.location.href);
});

// The routing method handler
window.handleRouting = async function(url) {
    // Smooth fade out transition
    document.body.style.transition = 'opacity 0.2s ease';
    document.body.style.opacity = '0';
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page not found');
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        setTimeout(() => {
            // Replace body and title with the new page's content
            document.body.innerHTML = doc.body.innerHTML;
            document.body.className = doc.body.className;
            document.title = doc.title;
            
            // Swap out custom <style> tags in <head>
            document.querySelectorAll('head style:not(#tailwindcss-stylesheet)').forEach(el => el.remove());
            doc.querySelectorAll('head style').forEach(styleEl => {
                const newStyle = document.createElement('style');
                newStyle.innerHTML = styleEl.innerHTML;
                document.head.appendChild(newStyle);
            });

            // --- PERFORMANCE ENHANCEMENT: SCRIPT RE-EXECUTION ---
            // Re-run all script tags found in the new body
            const scripts = document.body.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });

            // Re-initialize Store UI if it exists after script re-execution
            if (window.initStoreUI) {
                window.initStoreUI();
            }
            
            // Re-bind modal close buttons
            const closeModalBtn = document.getElementById('close-modal-btn');
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', () => {
                    const modal = document.getElementById('order-modal');
                    if (modal) {
                        modal.classList.add('opacity-0');
                        setTimeout(() => {
                            modal.classList.remove('flex');
                            modal.classList.add('hidden');
                            window.history.pushState({}, '', 'index.html');
                            window.handleRouting('index.html');
                        }, 500);
                    }
                });
            }

            window.scrollTo({ top: 0, behavior: 'instant' });
            document.body.style.opacity = '1';
        }, 200);
        
    } catch(err) {
        console.error('Routing failed:', err);
        window.location.href = url;
    }
}

// Initialized by store.js mostly, but we set up the close modal here on first load if on checkout page
document.addEventListener('DOMContentLoaded', () => {
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const modal = document.getElementById('order-modal');
            if (modal) {
                modal.classList.add('opacity-0');
                setTimeout(() => {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                    window.history.pushState({}, '', 'index.html');
                    window.handleRouting('index.html');
                }, 500);
            }
        });
    }
});
