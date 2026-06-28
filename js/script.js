// TECHZONE - COMPLETE JAVASCRIPT
// Student: 220526
// Cart System - Using local storage to store cart items and quantities

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}
// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}
// Add item to cart
function addToCart(productName, price) {
    let cart = getCart();
    
    // Check if product already in cart
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showToast(`🛒 ${productName} added to cart!`);
}
// Remove item from cart
function removeFromCart(productName) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== productName);
    saveCart(cart);
    renderCart();
}
// Update quantity
function updateQuantity(productName, change) {
    let cart = getCart();
    const product = cart.find(item => item.name === productName);
    
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.name !== productName);
        }
    }
    
    saveCart(cart);
    renderCart();
}
// Get cart total
function getCartTotal() {
    const cart = getCart();
    let subtotal = 0;
    let itemCount = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        itemCount += item.quantity;
    });
    
    return { subtotal, itemCount };
}
// Update cart badge on all pages
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    
    if (badge) {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// TOAST NOTIFICATION
function showToast(message) {
    // Remove existing toast
    const oldToast = document.querySelector('.toast-notification');
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #0f3460;
        color: white;
        padding: 12px 30px;
        border-radius: 30px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 5px 25px rgba(0,0,0,0.3);
        animation: slideUp 0.5s ease;
        border-left: 4px solid #e94560;
        font-family: 'Segoe UI', sans-serif;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
