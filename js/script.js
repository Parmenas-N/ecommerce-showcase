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

// Shop page function
function addToCartFromShop(productName, price) {
    addToCart(productName, price);
}

//Cart page functions
function renderCart() {
    const cartContainer = document.getElementById('cartItemsContainer');
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #cbd5e1;"></i>
                <h5 class="mt-3">Your cart is empty</h5>
                <p class="text-muted">Browse our products and add items to your cart</p>
                <a href="shop.html" class="btn btn-primary-custom">Start Shopping</a>
            </div>
        `;
        updateOrderSummary(0, 0);
        return;
    }
    
    let html = '';
    let subtotal = 0;
    let itemCount = 0;
    
    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        subtotal += total;
        itemCount += item.quantity;
        
        html += `
            <div class="cart-item" data-index="${index}">
                <div class="row align-items-center">
                    <div class="col-md-2 col-3">
                        <img src="https://via.placeholder.com/80x80/2563eb/ffffff?text=${encodeURIComponent(item.name)}" alt="${item.name}" class="cart-item-img">
                    </div>
                    <div class="col-md-4 col-6">
                        <h6 class="cart-item-title">${item.name}</h6>
                        <p class="cart-item-desc">$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="col-md-2 col-3">
                        <div class="quantity-control">
                            <button class="qty-btn" onclick="updateQuantityFromCart('${item.name}', -1)">-</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantityFromCart('${item.name}', 1)">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 col-6">
                        <p class="cart-item-price">$${total.toFixed(2)}</p>
                    </div>
                    <div class="col-md-2 col-3 text-end">
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = html;
    updateOrderSummary(subtotal, itemCount);
}

function updateQuantityFromCart(productName, change) {
    updateQuantity(productName, change);
}

function updateOrderSummary(subtotal, itemCount) {
    const shipping = subtotal > 0 ? 5.00 : 0;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;
    
    const summaryRows = document.querySelectorAll('.summary-row');
    if (summaryRows.length >= 4) {
        summaryRows[0].querySelector('span:last-child').textContent = `$${subtotal.toFixed(2)}`;
        summaryRows[1].querySelector('span:last-child').textContent = `$${shipping.toFixed(2)}`;
        summaryRows[2].querySelector('span:last-child').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.summary-row.total span:last-child').textContent = `$${total.toFixed(2)}`;
    }
    
    // Update cart badge
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        if (itemCount > 0) {
            cartBadge.textContent = itemCount;
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

//Checkout function
function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('❌ Your cart is empty!');
        return;
    }
    
    showToast('✅ Order placed successfully! Thank you for shopping at TechZone.');
    
    setTimeout(() => {
        localStorage.removeItem('cart');
        updateCartBadge();
        renderCart();
    }, 2000);
    
    const checkoutBtn = document.querySelector('.btn-primary-custom');
    if (checkoutBtn && checkoutBtn.textContent.includes('Proceed')) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        setTimeout(() => {
            checkoutBtn.innerHTML = '<i class="fas fa-check"></i> Order Placed!';
            setTimeout(() => {
                checkoutBtn.disabled = false;
                checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> Proceed to Checkout';
            }, 1500);
        }, 2000);
    }
}

//Gallery  Page - filter
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-buttons .btn');
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category || 
            (category === 'all' && btn.textContent.toLowerCase() === 'all')) {
            btn.classList.add('active');
        }
    });
    
    items.forEach(item => {
        const itemCategory = item.dataset.category;
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function openLightbox(element) {
    const img = element.querySelector('img');
    if (!img) return;
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
    `;
    
    const closeBtn = document.createElement('span');
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 2.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = function(e) {
        e.stopPropagation();
        document.body.removeChild(lightbox);
    };
    
    const lightboxImg = document.createElement('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    lightbox.appendChild(closeBtn);
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);
    
    lightbox.onclick = function(e) {
        if (e.target === lightbox) {
            document.body.removeChild(lightbox);
        }
    };
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const existingLightbox = document.querySelector('.lightbox');
            if (existingLightbox) {
                document.body.removeChild(existingLightbox);
            }
        }
    });
}
