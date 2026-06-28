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