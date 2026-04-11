// main routing file (Vanilla JS SPA Router)
let routingInProgress = false;

document.addEventListener('click', async (e) => {
    // Intercept clicks on links
    const link = e.target.closest('a');
    if (link && link.href && link.origin === window.location.origin && !link.hasAttribute('data-no-router')) {
        const url = link.href;
        const currentUrl = window.location.href;

        // Skip if same URL
        if (url === currentUrl) return;

        e.preventDefault();
        
        // 1. Validation Logic Before Proceeding to Checkout
        if (url.includes('checkout')) {
            if (window.AppStore && window.AppStore.state.cart.length === 0) {
                alert('Your cart is empty. Please add items before proceeding to checkout.');
                return; 
            }
        }

        // 2. Trigger Navigation
        window.history.pushState({ path: url }, '', url);
        await window.handleRouting(url);
    }
});

// Handle Back/Forward buttons in the browser
window.addEventListener('popstate', async (e) => {
    await window.handleRouting(window.location.href);
});

// The routing method handler
window.handleRouting = async function(url) {
    if (routingInProgress) return;
    routingInProgress = true;

    console.log(`Routing to: ${url}`);
    
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

            // Re-run script tags selectively
            const scripts = document.body.querySelectorAll('script');
            scripts.forEach(oldScript => {
                if (oldScript.src && (oldScript.src.includes('store.js') || oldScript.src.includes('router.js'))) {
                    // Don't re-execute core scripts if they are already active
                    return;
                }
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });

            // Re-initialize Store UI
            if (window.initStoreUI) {
                console.log('Router: Triggering Store UI Re-initialization');
                window.initStoreUI();
            }
            
            window.scrollTo({ top: 0, behavior: 'instant' });
            document.body.style.opacity = '1';
            routingInProgress = false;
        }, 200);
        
    } catch(err) {
        console.error('Routing failed:', err);
        routingInProgress = false;
        window.location.href = url; // Fallback to full page load
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
