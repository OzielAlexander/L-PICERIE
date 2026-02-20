document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('product-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Función principal de filtrado con transiciones suaves
    const applyFilters = (category, term) => {
        const productItems = document.querySelectorAll('#product-grid > div');
        
        productItems.forEach(item => {
            const card = item.querySelector('.product-card');
            if (!card) return;

            const name = card.querySelector('.product-name').innerText.toLowerCase();
            const productCat = card.querySelector('.product-category').innerText;

            const matchesCategory = (category === 'all' || productCat === category);
            const matchesSearch = (name.includes(term) || productCat.toLowerCase().includes(term));

            if (matchesCategory && matchesSearch) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px) scale(0.95)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    };

    // Evento de búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            applyFilters(activeCategory, e.target.value.toLowerCase());
        });
    }

    // Evento de botones
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            applyFilters(filter, searchTerm);
        });
    });
});

// Función de Maridaje (Integrada con app.js)
function addPairingToCart() {
    // Brie (ID 6) y Vino (ID 11) según catálogo global
    const pairingIds = [6, 11]; 
    pairingIds.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
            cart.push(product);
            if (typeof showToast === 'function') showToast(product); 
        }
    });

    localStorage.setItem('luxury_cart', JSON.stringify(cart));
    if (typeof updateCartUI === 'function') updateCartUI(); 

    // Abrir Carrito para feedback inmediato
    const sidebar = document.getElementById('side-cart');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && overlay) {
        if (typeof renderCartItems === 'function') renderCartItems();
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }
}
// Manejo del botón Finalizar Compra corregido para aparecer al frente
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('checkout-btn')) {
        
        if (cart.length === 0) {
            Swal.fire({
                title: 'Carrito Vacío',
                text: 'Añada algunos tesoros gastronómicos antes de finalizar.',
                icon: 'info',
                confirmButtonColor: '#1b2e26'
            });
            return;
        }

        Swal.fire({
            title: '¡Pedido Recibido!',
            text: 'Su selección gourmet está siendo preparada por nuestro concierge.',
            icon: 'success',
            confirmButtonColor: '#1b2e26',
            iconColor: '#c5a47e',
            // ESTA LÍNEA ES LA CLAVE: Forzamos la profundidad de capa
            customClass: {
                container: 'swal-al-frente'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Limpieza del carrito
                cart = [];
                localStorage.removeItem('luxury_cart');
                
                if (typeof updateCartUI === 'function') updateCartUI();
                if (typeof renderCartItems === 'function') renderCartItems();
                
                // Cerrar el menú lateral
                const sidebar = document.getElementById('side-cart');
                const overlay = document.getElementById('cart-overlay');
                if (sidebar && overlay) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            }
        });
    }
});