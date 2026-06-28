// Gallery page - Filter and Lightbox

// Filter gallery by category
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-buttons .btn');
    
    // Update active button
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category || 
            (category === 'all' && btn.textContent.toLowerCase() === 'all')) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide items
    items.forEach(item => {
        const itemCategory = item.dataset.category;
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Open lightbox
function openLightbox(element) {
    // Get the image source
    const img = element.querySelector('img');
    if (!img) return;
    
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = function(e) {
        e.stopPropagation();
        document.body.removeChild(lightbox);
    };
    
    // Create image
    const lightboxImg = document.createElement('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    
    // Assemble lightbox
    lightbox.appendChild(closeBtn);
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);
    
    // Close on click outside
    lightbox.onclick = function(e) {
        if (e.target === lightbox) {
            document.body.removeChild(lightbox);
        }
    };
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const existingLightbox = document.querySelector('.lightbox');
            if (existingLightbox) {
                document.body.removeChild(existingLightbox);
            }
        }
    });
}

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🖼️ Gallery page loaded!');
});

// Cart page - Quantity Control, Remove Item, Update Total, Checkout
// Update quantity
function updateQuantity(button, change) {
    const quantityControl = button.closest('.quantity-control');
    const valueSpan = quantityControl.querySelector('.qty-value');
    let currentValue = parseInt(valueSpan.textContent);
    let newValue = currentValue + change;
    
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    valueSpan.textContent = newValue;
    updateCartTotal();
}
// Remove item from cart
function removeItem(button) {
    const cartItem = button.closest('.cart-item');
    cartItem.style.transition = 'all 0.3s ease';
    cartItem.style.opacity = '0';
    cartItem.style.transform = 'translateX(50px)';
    
    setTimeout(() => {
        cartItem.remove();
        updateCartTotal();
        
        // Check if cart is empty
        const remainingItems = document.querySelectorAll('.cart-item');
        if (remainingItems.length === 0) {
            showEmptyCart();
        }
    }, 300);
}

// Update cart total
function updateCartTotal() {
    const items = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    let itemCount = 0;
    
    items.forEach(item => {
        const priceText = item.querySelector('.cart-item-price')?.textContent || '0';
        const price = parseFloat(priceText.replace('$', ''));
        const quantity = parseInt(item.querySelector('.qty-value')?.textContent || 1);
        subtotal += price * quantity;
        itemCount += quantity;
    });
    
    const shipping = 5.00;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;
    
    // Update order summary
    const summaryRows = document.querySelectorAll('.summary-row');
    if (summaryRows.length >= 3) {
        summaryRows[0].querySelector('span:last-child').textContent = `$${subtotal.toFixed(2)}`;
        summaryRows[1].querySelector('span:last-child').textContent = `$${shipping.toFixed(2)}`;
        summaryRows[2].querySelector('span:last-child').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.summary-row.total span:last-child').textContent = `$${total.toFixed(2)}`;
    }
    
    // Update cart count badge
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.textContent = itemCount;
        if (itemCount === 0) {
            cartBadge.style.display = 'none';
        } else {
            cartBadge.style.display = 'inline-block';
        }
    }
}

// Show empty cart message
function showEmptyCart() {
    const wrapper = document.querySelector('.cart-items-wrapper');
    if (wrapper) {
        wrapper.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--gray);"></i>
                <h5 class="mt-3">Your cart is empty</h5>
                <p class="text-muted">Browse our products and add items to your cart</p>
                <a href="shop.html" class="btn btn-primary-custom">Start Shopping</a>
            </div>
        `;
    }
    
    // Reset order summary
    document.querySelector('.summary-row:first-child span:last-child').textContent = '$0.00';
    document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = '$0.00';
    document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = '$0.00';
    document.querySelector('.summary-row.total span:last-child').textContent = '$0.00';
}

// Checkout function
function checkout() {
    const items = document.querySelectorAll('.cart-item');
    if (items.length === 0) {
        showToast('❌ Your cart is empty!');
        return;
    }
    
    showToast('✅ Order placed successfully! Thank you for shopping at TechZone.');
    
    // Disable checkout button
    const checkoutBtn = document.querySelector('.btn-primary-custom');
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        setTimeout(() => {
            checkoutBtn.innerHTML = '<i class="fas fa-check"></i> Order Placed!';
        }, 2000);
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Cart page loaded!');
    updateCartTotal();
});