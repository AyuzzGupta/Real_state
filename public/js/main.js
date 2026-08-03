// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// User Profile Dropdown Toggle
function toggleUserDropdown(event) {
    if (event) event.stopPropagation();
    const dropdownMenu = document.getElementById('userDropdownMenu');
    if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
    }
}

// Close dropdown on click outside
window.addEventListener('click', (event) => {
    const dropdownMenu = document.getElementById('userDropdownMenu');
    const userBtn = document.querySelector('.nav-user-btn');
    if (dropdownMenu && dropdownMenu.classList.contains('show')) {
        if (!userBtn || !userBtn.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    }
});

// Toast Notification System
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `glass-panel toast-notification ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} mr-2"></i> <span>${message}</span>`;
    
    document.body.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}

// Favorite Toggle Handler (AJAX)
async function toggleFavorite(event, propertyId) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const targetBtn = event.currentTarget || event.target;

    try {
        const response = await fetch(`/properties/${propertyId}/favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            showToast('Please login to save favorite properties', 'danger');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1200);
            return;
        }

        const data = await response.json();
        if (data.success) {
            if (data.isFavorite) {
                targetBtn.classList.add('active');
                targetBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
                showToast('Added to your Favourites!', 'success');
            } else {
                targetBtn.classList.remove('active');
                targetBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
                showToast('Removed from your Favourites', 'success');

                // If on favorites tab or page, smoothly fade out card
                const card = targetBtn.closest('.property-card');
                if (window.location.pathname === '/favorites' || window.location.search.includes('tab=favorites')) {
                    if (card) {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        card.style.transition = 'all 0.3s ease';
                        setTimeout(() => {
                            card.remove();
                            // Check if empty
                            const grid = document.querySelector('.favorites-grid');
                            if (grid && grid.children.length === 0) {
                                window.location.reload();
                            }
                        }, 300);
                    }
                }
            }
        } else {
            showToast(data.message || 'Failed to update favorites', 'danger');
        }
    } catch (err) {
        console.error(err);
        showToast('Something went wrong. Please try again.', 'danger');
    }
}

// Modal Toggle Helpers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Copy text to clipboard
function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg, 'success');
    }).catch(err => {
        showToast('Failed to copy', 'danger');
    });
}
