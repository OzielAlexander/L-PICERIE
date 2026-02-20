/**
 * L'ÉPICERIE - Core Engine
 * Versión Final Corregida con Imágenes Dinámicas
 */

// 1. Base de Datos Extendida (20 productos con rutas inteligentes)
// Usamos una función para determinar el prefijo de la ruta según la ubicación del archivo
const getImgPath = (imgName) => {
    const isSubPage = window.location.pathname.includes('/views/');
    return isSubPage ? `../../imgs/${imgName}` : `imgs/${imgName}`;
};

const products = [
    // GRECIA
    { id: 1, name: "Aceite Rodas Premium", price: 580, cat: "Grecia", img: getImgPath("imagen1.jpg"), desc: "Extracción en frío de olivas Koroneiki." },
    { id: 2, name: "Aceitunas Kalamata Oro", price: 240, cat: "Grecia", img: getImgPath("imagen2.webp"), desc: "Olivas carnosas curadas en salmuera de vino." },
    { id: 3, name: "Miel de Tomillo Creta", price: 410, cat: "Grecia", img: getImgPath("imagen3.webp"), desc: "Miel silvestre de alta montaña." },
    { id: 4, name: "Queso Feta DOP", price: 320, cat: "Grecia", img: getImgPath("imagen4.webp"), desc: "Tradicional queso de cabra y oveja." },
    { id: 5, name: "Vinagre de Xeres Viejo", price: 890, cat: "Grecia", img: getImgPath("imagen5.png"), desc: "Reserva especial 10 años." },
    // FRANCIA
    { id: 6, name: "Brie de Meaux Trufado", price: 920, cat: "Francia", img: getImgPath("imagen6.jpg"), desc: "Corazón cremoso con trufa negra." },
    { id: 7, name: "Roquefort Papillon", price: 750, cat: "Francia", img: getImgPath("imagen7.jpg"), desc: "El rey de los quesos azules." },
    { id: 8, name: "Foie Gras de Pato", price: 1850, cat: "Francia", img: getImgPath("imagen8.webp"), desc: "Receta tradicional del suroeste." },
    { id: 9, name: "Mostaza de Dijon Oro", price: 190, cat: "Francia", img: getImgPath("imagen9.png"), desc: "Molienda en piedra volcánica." },
    { id: 10, name: "Macarons de París", price: 450, cat: "Francia", img: getImgPath("imagen10.webp"), desc: "Caja de 12 sabores artesanales." },
    // MÉXICO
    { id: 11, name: "Vino Reserva Selección", price: 1450, cat: "México", img: getImgPath("imagen11.webp"), desc: "Cabernet Sauvignon de Valle de Guadalupe." },
    { id: 12, name: "Café Pluma Hidalgo", price: 380, cat: "México", img: getImgPath("imagen12.webp"), desc: "Grano de altura tostado." },
    { id: 13, name: "Mezcal Ancestral", price: 2100, cat: "México", img: getImgPath("imagen13.jpg"), desc: "Destilado en olla de barro." },
    { id: 14, name: "Chocolate de Metate", price: 220, cat: "México", img: getImgPath("imagen14.png"), desc: "Cacao 80% con canela." },
    { id: 15, name: "Vino Blanco Chenin", price: 980, cat: "México", img: getImgPath("imagen15.webp"), desc: "Notas cítricas y manzana verde." },
    // PROVENZA
    { id: 16, name: "Miel de Lavanda", price: 340, cat: "Provenza", img: getImgPath("imagen16.jpeg"), desc: "Directo de los campos de Valensole." },
    { id: 17, name: "Hierbas de Provence", price: 150, cat: "Provenza", img: getImgPath("imagen17.png"), desc: "Mezcla clásica en tarro." },
    { id: 18, name: "Jabón de Marsella", price: 120, cat: "Provenza", img: getImgPath("imagen18.jpg"), desc: "72% aceite de oliva puro." },
    { id: 19, name: "Tapenade de Olivas", price: 280, cat: "Provenza", img: getImgPath("imagen19.jpeg"), desc: "Pasta de olivas negras." },
    { id: 20, name: "Rosé de Provence", price: 1100, cat: "Provenza", img: getImgPath("imagen20.jpg"), desc: "Color pálido, notas de fresa." }
];

let cart = JSON.parse(localStorage.getItem('luxury_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    initScrollEffect();
    initCartSidebar();
    initCustomCursor();
    handleScrollEffects();

    if (document.getElementById('product-grid')) renderProducts();
    if (document.getElementById('product-modal')) initModalEvents();
    
    // CORRECCIÓN: Eliminamos el event listener que buscaba showCartSummary
    const cartTrigger = document.getElementById('cart-trigger');
    if (cartTrigger) {
        cartTrigger.addEventListener('click', () => {
            const sidebar = document.getElementById('side-cart');
            const overlay = document.getElementById('cart-overlay');
            if (sidebar && overlay) {
                renderCartItems();
                sidebar.classList.add('active');
                overlay.classList.add('active');
            }
        });
    }
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const heroText = document.getElementById('hero-text');
    setTimeout(() => {
        if (preloader) preloader.classList.add('loaded');
        if (heroText) heroText.classList.add('reveal');
        setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 800);
        initParallax();
    }, 2000);
});

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = products.map(item => `
        <div class="col-lg-3 col-md-6 reveal-on-scroll">
            <article class="product-card">
                <div class="product-image-wrapper" onclick="openModal(${item.id})" style="cursor:none">
                    <img src="${item.img}" class="product-image" alt="${item.name}">
                </div>
                <div class="product-category">${item.cat}</div>
                <h3 class="product-name">${item.name}</h3>
                <div class="product-price">$${item.price.toLocaleString()}</div>
                <button class="add-btn" onclick="addToCart(event, ${item.id})">Añadir a la Selección</button>
            </article>
        </div>
    `).join('');
}

function openModal(id) {
    const product = products.find(p => p.id === id);
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    if (!product || !modal) return;
    content.innerHTML = `
        <div class="col-md-6 modal-img-col">
            <img src="${product.img}" style="max-width: 100%; height: auto; object-fit: contain;" alt="${product.name}">
        </div>
        <div class="col-md-6 modal-info-col">
            <div class="product-category">${product.cat}</div>
            <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 1rem;">${product.name}</h2>
            <p class="modal-description" style="margin-bottom: 2rem; color: #666; font-weight: 300;">${product.desc}</p>
            <div class="modal-price" style="font-size: 2rem; font-weight: 700; margin-bottom: 2rem;">$${product.price.toLocaleString()}</div>
            <button class="btn-premium" style="background:var(--verde-bosque); color:white; border:none; width: 100%;" onclick="addToCart(event, ${product.id})">
                Añadir a la bolsa de compra
            </button>
        </div>
    `;
    modal.classList.add('active');
}

function initModalEvents() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}

function initCartSidebar() {
    const closeBtn = document.getElementById('close-cart-btn');
    const overlay = document.getElementById('cart-overlay');
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);
}

function closeCart() {
    const sidebar = document.getElementById('side-cart');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

function addToCart(event, productId) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem('luxury_cart', JSON.stringify(cart));
    updateCartUI();
    showToast(product);
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('cart-total-price');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; margin-top:2rem; opacity:0.5;">Su bolsa está vacía.</p>`;
        if (totalDisplay) totalDisplay.innerText = "$0.00";
        return;
    }
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.img}" class="cart-item-img" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toLocaleString()}</p>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4444; font-size:0.7rem; cursor:pointer; padding:0;">Eliminar</button>
            </div>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (totalDisplay) totalDisplay.innerText = `$${total.toLocaleString()}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('luxury_cart', JSON.stringify(cart));
    updateCartUI();
    renderCartItems();
}

function updateCartUI() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.innerText = cart.length;
        countElement.style.transform = 'scale(1.3)';
        setTimeout(() => countElement.style.transform = 'scale(1)', 200);
    }
}

function showToast(product) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-premium';
    toast.innerHTML = `<i class="bi bi-check2-circle"></i><div class="toast-content"><p>Añadido</p><span>${product.name}</span></div>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('active'), 10);
    setTimeout(() => { toast.classList.remove('active'); setTimeout(() => toast.remove(), 500); }, 3000);
}

function initScrollEffect() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}

function initParallax() {
    const heroBg = document.getElementById('hero-parallax');
    const heroText = document.getElementById('hero-text');
    window.addEventListener('scroll', () => {
        let scrollValue = window.scrollY;
        if (scrollValue <= window.innerHeight) {
            if (heroBg) heroBg.style.transform = `translateY(${scrollValue * 0.4}px)`;
            if (heroText) heroText.style.opacity = 1 - (scrollValue / 800);
        }
    });
}

function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    const interactiveElements = document.querySelectorAll('button, a, .product-image-wrapper, .footer-social a');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(4)');
        el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
    });
}

function handleScrollEffects() {
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";
        const reveals = document.querySelectorAll('.reveal-on-scroll');
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 50) el.classList.add('active');
        });
    });
}