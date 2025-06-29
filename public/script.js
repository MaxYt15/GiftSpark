// Importar Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getDatabase, ref, onValue, push, update } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzj_z2GhjWtrxBfzbyQd9Yq0y76tTJx4I",
  authDomain: "gift-spark-b7c70.firebaseapp.com",
  projectId: "gift-spark-b7c70",
  storageBucket: "gift-spark-b7c70.firebasestorage.app",
  messagingSenderId: "775684044370",
  appId: "1:775684044370:web:f4e573c1f5517c3795918b",
  measurementId: "G-NC2JKQYJTY",
  databaseURL: "https://gift-spark-b7c70-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Variables globales con mejor gestión
let currentTab = 'gift';
let gifts = [];
let cards = [];
let firebaseUnsubscribers = []; // Para cleanup de listeners

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeUI();
    setupFirebaseListeners();
});

// Cleanup cuando se desmonta la página
window.addEventListener('beforeunload', function() {
    cleanupFirebaseListeners();
});

// Configurar listeners de Firebase con cleanup
function setupFirebaseListeners() {
    // Limpiar listeners anteriores
    cleanupFirebaseListeners();
    
    // Listener para regalos en tiempo real
    const giftsRef = ref(database, 'gifts');
    const giftsUnsubscribe = onValue(giftsRef, (snapshot) => {
        if (snapshot.exists()) {
            gifts = [];
            snapshot.forEach((childSnapshot) => {
                gifts.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            renderGifts();
        } else {
            gifts = [];
            renderGifts();
        }
    }, (error) => {
        console.error('Error listening to gifts:', error);
        showErrorMessage('Error al cargar los regalos. Verifica tu conexión.');
    });
    
    firebaseUnsubscribers.push(giftsUnsubscribe);

    // Listener para cartas en tiempo real
    const cardsRef = ref(database, 'cards');
    const cardsUnsubscribe = onValue(cardsRef, (snapshot) => {
        if (snapshot.exists()) {
            cards = [];
            snapshot.forEach((childSnapshot) => {
                cards.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            renderCards();
        } else {
            cards = [];
            renderCards();
        }
    }, (error) => {
        console.error('Error listening to cards:', error);
        showErrorMessage('Error al cargar las cartas. Verifica tu conexión.');
    });
    
    firebaseUnsubscribers.push(cardsUnsubscribe);
}

// Limpiar listeners de Firebase
function cleanupFirebaseListeners() {
    firebaseUnsubscribers.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    });
    firebaseUnsubscribers = [];
}

// Función de inicialización mejorada
function initializeUI() {
    setupEventListeners();
    setupAnimations();
    
    // Mostrar estado de carga
    showLoadingState();
}

// Mostrar estado de carga
function showLoadingState() {
    const giftsContainer = document.getElementById('gifts-container');
    const cardsContainer = document.getElementById('cards-container');
    
    if (giftsContainer) {
        giftsContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando regalos...</p>
            </div>
        `;
    }
    
    if (cardsContainer) {
        cardsContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando cartas...</p>
            </div>
        `;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un enlace
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Tabs de creación
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Formularios
    const giftForm = document.getElementById('gift-form');
    const cardForm = document.getElementById('card-form');
    
    if (giftForm) {
        giftForm.addEventListener('submit', handleGiftSubmit);
    }
    if (cardForm) {
        cardForm.addEventListener('submit', handleCardSubmit);
    }

    // Categorías
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => selectCategory(card.dataset.type));
    });

    // Modal
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Navegación suave
    const navLinksAll = document.querySelectorAll('.nav-link[href^="#"]');
    navLinksAll.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Configurar animaciones
function setupAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    document.querySelectorAll('.category-card, .gift-card, .card-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Cambiar entre tabs
function switchTab(tab) {
    currentTab = tab;
    
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Mostrar formulario correspondiente
    document.querySelectorAll('.create-form').forEach(form => {
        form.classList.remove('active');
    });
    
    if (tab === 'gift') {
        document.getElementById('gift-form').classList.add('active');
    } else {
        document.getElementById('card-form').classList.add('active');
    }
}

// Seleccionar categoría
function selectCategory(type) {
    const typeSelect = currentTab === 'gift' ? 'gift-type' : 'card-type';
    document.getElementById(typeSelect).value = type;
    
    // Scroll a la sección de creación
    scrollToSection('create');
    
    // Efecto visual
    const selectedCard = document.querySelector(`[data-type="${type}"]`);
    selectedCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
        selectedCard.style.transform = 'scale(1)';
    }, 150);
}

// Manejar envío de regalo usando Firebase
async function handleGiftSubmit(e) {
    e.preventDefault();
    
    // Validación de campos
    const title = document.getElementById('gift-title').value.trim();
    const type = document.getElementById('gift-type').value;
    const recipient = document.getElementById('gift-recipient').value.trim();
    const sender = document.getElementById('gift-sender').value.trim();
    const description = document.getElementById('gift-description').value.trim();
    const message = document.getElementById('gift-message').value.trim();
    
    // Validaciones específicas
    if (!title) {
        showErrorMessage('Por favor ingresa un título para tu regalo');
        document.getElementById('gift-title').focus();
        return;
    }
    
    if (!type) {
        showErrorMessage('Por favor selecciona el tipo de regalo');
        document.getElementById('gift-type').focus();
        return;
    }
    
    if (!recipient) {
        showErrorMessage('Por favor ingresa el nombre de la persona');
        document.getElementById('gift-recipient').focus();
        return;
    }
    
    if (!sender) {
        showErrorMessage('Por favor ingresa tu nombre');
        document.getElementById('gift-sender').focus();
        return;
    }
    
    if (!description) {
        showErrorMessage('Por favor describe tu regalo virtual');
        document.getElementById('gift-description').focus();
        return;
    }
    
    if (!message) {
        showErrorMessage('Por favor escribe un mensaje personal');
        document.getElementById('gift-message').focus();
        return;
    }
    
    const formData = {
        title,
        type,
        recipient,
        sender,
        description,
        message
    };
    
    try {
        const giftsRef = ref(database, 'gifts');
        const newGiftRef = await push(giftsRef, {
            ...formData,
            createdAt: new Date().toISOString(),
            likes: 0
        });
        
        showSuccessMessage('¡Regalo creado exitosamente! 🎁');
        e.target.reset();
        
        // Log analytics event
        analytics.logEvent('gift_created', {
            gift_type: formData.type
        });
        
    } catch (error) {
        console.error('Error creating gift:', error);
        
        // Manejo específico de errores
        if (error.code === 'PERMISSION_DENIED') {
            showErrorMessage('No tienes permisos para crear regalos. Verifica tu conexión.');
        } else if (error.code === 'UNAVAILABLE') {
            showErrorMessage('Servicio no disponible. Verifica tu conexión a internet.');
        } else if (error.code === 'QUOTA_EXCEEDED') {
            showErrorMessage('Se ha excedido el límite de regalos. Inténtalo más tarde.');
        } else {
            showErrorMessage(`Error al crear el regalo: ${error.message}`);
        }
    }
}

// Manejar envío de carta usando Firebase
async function handleCardSubmit(e) {
    e.preventDefault();
    
    // Validación de campos
    const title = document.getElementById('card-title').value.trim();
    const type = document.getElementById('card-type').value;
    const recipient = document.getElementById('card-recipient').value.trim();
    const sender = document.getElementById('card-sender').value.trim();
    const design = document.getElementById('card-design').value;
    const content = document.getElementById('card-content').value.trim();
    
    // Validaciones específicas
    if (!title) {
        showErrorMessage('Por favor ingresa un título para tu carta');
        document.getElementById('card-title').focus();
        return;
    }
    
    if (!type) {
        showErrorMessage('Por favor selecciona el tipo de carta');
        document.getElementById('card-type').focus();
        return;
    }
    
    if (!recipient) {
        showErrorMessage('Por favor ingresa el nombre de la persona');
        document.getElementById('card-recipient').focus();
        return;
    }
    
    if (!sender) {
        showErrorMessage('Por favor ingresa tu nombre');
        document.getElementById('card-sender').focus();
        return;
    }
    
    if (!content) {
        showErrorMessage('Por favor escribe el contenido de tu carta');
        document.getElementById('card-content').focus();
        return;
    }
    
    const formData = {
        title,
        type,
        recipient,
        sender,
        design,
        content
    };
    
    try {
        const cardsRef = ref(database, 'cards');
        const newCardRef = await push(cardsRef, {
            ...formData,
            createdAt: new Date().toISOString(),
            likes: 0
        });
        
        showSuccessMessage('¡Carta creada exitosamente! 💌');
        e.target.reset();
        
        // Log analytics event
        analytics.logEvent('card_created', {
            card_type: formData.type,
            card_design: formData.design
        });
        
    } catch (error) {
        console.error('Error creating card:', error);
        
        // Manejo específico de errores
        if (error.code === 'PERMISSION_DENIED') {
            showErrorMessage('No tienes permisos para crear cartas. Verifica tu conexión.');
        } else if (error.code === 'UNAVAILABLE') {
            showErrorMessage('Servicio no disponible. Verifica tu conexión a internet.');
        } else if (error.code === 'QUOTA_EXCEEDED') {
            showErrorMessage('Se ha excedido el límite de cartas. Inténtalo más tarde.');
        } else {
            showErrorMessage(`Error al crear la carta: ${error.message}`);
        }
    }
}

// Renderizar regalos
function renderGifts() {
    const container = document.getElementById('gifts-container');
    
    if (gifts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-gift" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No hay regalos aún</h3>
                <p>¡Sé el primero en crear un regalo virtual!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = gifts.map(gift => `
        <div class="gift-card" onclick="showGiftModal('${gift.id}')">
            <h3>${escapeHtml(gift.title)}</h3>
            <p><strong>Para:</strong> ${escapeHtml(gift.recipient)}</p>
            <p><strong>De:</strong> ${escapeHtml(gift.sender)}</p>
            <p>${escapeHtml(gift.description)}</p>
            <div class="gift-meta">
                <span class="gift-type">${getTypeLabel(gift.type)}</span>
                <button class="like-btn" onclick="likeGift('${gift.id}', event)">
                    <i class="fas fa-heart"></i> ${gift.likes || 0}
                </button>
            </div>
        </div>
    `).join('');
}

// Renderizar cartas
function renderCards() {
    const container = document.getElementById('cards-container');
    
    if (cards.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No hay cartas aún</h3>
                <p>¡Sé el primero en crear una carta virtual!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cards.map(card => `
        <div class="card-item" onclick="showCardModal('${card.id}')">
            <h3>${escapeHtml(card.title)}</h3>
            <p><strong>Para:</strong> ${escapeHtml(card.recipient)}</p>
            <p><strong>De:</strong> ${escapeHtml(card.sender)}</p>
            <p>${escapeHtml(card.content.substring(0, 100))}${card.content.length > 100 ? '...' : ''}</p>
            <div class="card-meta">
                <span class="card-type">${getTypeLabel(card.type)}</span>
                <button class="like-btn" onclick="likeCard('${card.id}', event)">
                    <i class="fas fa-heart"></i> ${card.likes || 0}
                </button>
            </div>
        </div>
    `).join('');
}

// Mostrar modal de regalo
async function showGiftModal(giftId) {
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) return;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="modal-gift">
            <h2>${escapeHtml(gift.title)}</h2>
            <div class="gift-details">
                <p><strong>Para:</strong> ${escapeHtml(gift.recipient)}</p>
                <p><strong>De:</strong> ${escapeHtml(gift.sender)}</p>
                <p><strong>Tipo:</strong> ${getTypeLabel(gift.type)}</p>
                <p><strong>Descripción:</strong></p>
                <p>${escapeHtml(gift.description)}</p>
                <p><strong>Mensaje:</strong></p>
                <div class="message-box">
                    <p>${escapeHtml(gift.message)}</p>
                </div>
            </div>
            <div class="gift-actions">
                <button class="btn btn-primary" onclick="shareGift('${gift.id}')">
                    <i class="fas fa-share"></i> Compartir
                </button>
                <button class="btn btn-secondary" onclick="likeGift('${gift.id}')">
                    <i class="fas fa-heart"></i> Me gusta (${gift.likes || 0})
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modal').style.display = 'block';
    
    // Log analytics event
    analytics.logEvent('gift_viewed', {
        gift_id: giftId,
        gift_type: gift.type
    });
}

// Mostrar modal de carta
async function showCardModal(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="modal-card">
            <h2>${escapeHtml(card.title)}</h2>
            <div class="card-details">
                <p><strong>Para:</strong> ${escapeHtml(card.recipient)}</p>
                <p><strong>De:</strong> ${escapeHtml(card.sender)}</p>
                <p><strong>Tipo:</strong> ${getTypeLabel(card.type)}</p>
                <p><strong>Diseño:</strong> ${getDesignLabel(card.design)}</p>
                <p><strong>Contenido:</strong></p>
                <div class="card-content">
                    <p>${escapeHtml(card.content)}</p>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="shareCard('${card.id}')">
                    <i class="fas fa-share"></i> Compartir
                </button>
                <button class="btn btn-secondary" onclick="likeCard('${card.id}')">
                    <i class="fas fa-heart"></i> Me gusta (${card.likes || 0})
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modal').style.display = 'block';
    
    // Log analytics event
    analytics.logEvent('card_viewed', {
        card_id: cardId,
        card_type: card.type,
        card_design: card.design
    });
}

// Cerrar modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Dar like a regalo usando Firebase
async function likeGift(giftId, event) {
    if (event) event.stopPropagation();
    
    try {
        const giftRef = ref(database, `gifts/${giftId}`);
        const gift = gifts.find(g => g.id === giftId);
        
        if (gift) {
            const updatedLikes = (gift.likes || 0) + 1;
            await update(giftRef, { likes: updatedLikes });
            
            // Log analytics event
            analytics.logEvent('gift_liked', {
                gift_id: giftId,
                gift_type: gift.type
            });
        }
    } catch (error) {
        console.error('Error dando like:', error);
        showErrorMessage('Error al dar like al regalo.');
    }
}

// Dar like a carta usando Firebase
async function likeCard(cardId, event) {
    if (event) event.stopPropagation();
    
    try {
        const cardRef = ref(database, `cards/${cardId}`);
        const card = cards.find(c => c.id === cardId);
        
        if (card) {
            const updatedLikes = (card.likes || 0) + 1;
            await update(cardRef, { likes: updatedLikes });
            
            // Log analytics event
            analytics.logEvent('card_liked', {
                card_id: cardId,
                card_type: card.type
            });
        }
    } catch (error) {
        console.error('Error dando like:', error);
        showErrorMessage('Error al dar like a la carta.');
    }
}

// Compartir regalo
function shareGift(giftId) {
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) return;
    
    const shareText = `¡Mira este regalo virtual que recibí en GiftSpark! 🎁\n\n"${gift.title}"\n\n${gift.message}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'GiftSpark - Regalo Virtual',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(shareText).then(() => {
            showSuccessMessage('¡Enlace copiado al portapapeles!');
        });
    }
    
    // Log analytics event
    analytics.logEvent('gift_shared', {
        gift_id: giftId,
        gift_type: gift.type
    });
}

// Compartir carta
function shareCard(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    
    const shareText = `¡Mira esta carta virtual que recibí en GiftSpark! 💌\n\n"${card.title}"\n\n${card.content}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'GiftSpark - Carta Virtual',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(shareText).then(() => {
            showSuccessMessage('¡Enlace copiado al portapapeles!');
        });
    }
    
    // Log analytics event
    analytics.logEvent('card_shared', {
        card_id: cardId,
        card_type: card.type
    });
}

// Scroll suave a sección
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Funciones auxiliares
function getTypeLabel(type) {
    const labels = {
        'novia': 'Para mi Novia',
        'novio': 'Para mi Novio',
        'amigo': 'Para mi Amigo',
        'amiga': 'Para mi Amiga',
        'mejor-amigo': 'Para mi Mejor Amigo',
        'mejor-amiga': 'Para mi Mejor Amiga',
        'crush': 'Para mi Crush',
        'declaracion': 'Declaración'
    };
    return labels[type] || type;
}

function getDesignLabel(design) {
    const labels = {
        'romantic': 'Romántico',
        'friendship': 'Amistad',
        'elegant': 'Elegante',
        'funny': 'Divertido',
        'vintage': 'Vintage'
    };
    return labels[design] || design;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Mostrar mensajes de éxito
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

// Mostrar mensajes de error
function showErrorMessage(message) {
    showNotification(message, 'error');
}

// Mostrar notificaciones
function showNotification(message, type = 'success') {
    // Eliminar toast anterior si existe
    const prev = document.querySelector('.toast-gs');
    if (prev) prev.remove();

    // Crear el toast
    const toast = document.createElement('div');
    toast.className = `toast-gs toast-${type}`;
    toast.innerHTML = `
        <span class="toast-gs-icon">${type === 'success' ? '✔️' : '⚠️'}</span>
        <span>${message}</span>
        <button class="toast-gs-close" aria-label="Cerrar">&times;</button>
    `;
    document.body.appendChild(toast);

    // Mostrar con animación
    setTimeout(() => toast.classList.add('toast-gs-show'), 50);

    // Cerrar al hacer click en la X
    toast.querySelector('.toast-gs-close').onclick = () => {
        toast.classList.remove('toast-gs-show');
        setTimeout(() => toast.remove(), 350);
    };

    // Cerrar automáticamente a los 3s
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('toast-gs-show');
            setTimeout(() => toast.remove(), 350);
        }
    }, 3000);
}

// Hacer funciones disponibles globalmente
window.switchTab = switchTab;
window.selectCategory = selectCategory;
window.showGiftModal = showGiftModal;
window.showCardModal = showCardModal;
window.closeModal = closeModal;
window.likeGift = likeGift;
window.likeCard = likeCard;
window.shareGift = shareGift;
window.shareCard = shareCard;
window.scrollToSection = scrollToSection;
window.removeImage = removeImage;
window.removeMusic = removeMusic; 