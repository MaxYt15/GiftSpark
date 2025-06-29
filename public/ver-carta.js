// Importar Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getDatabase, ref, get, update } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';
import { getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js';

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

// Variables globales
let currentCard = null;
let isPlaying = false;
let isMuted = false;

// Elementos del DOM
const cardTitle = document.getElementById('card-title');
const cardRecipient = document.getElementById('card-recipient');
const cardSender = document.getElementById('card-sender');
const cardType = document.getElementById('card-type');
const cardContent = document.getElementById('card-content');
const cardMessage = document.getElementById('card-message');
const messageText = document.getElementById('message-text');
const musicControls = document.getElementById('music-controls');
const musicName = document.getElementById('music-name');
const cardAudio = document.getElementById('card-audio');
const playPauseBtn = document.getElementById('play-pause');
const stopBtn = document.getElementById('stop-music');
const muteBtn = document.getElementById('mute-music');
const likeBtn = document.getElementById('like-card');
const shareBtn = document.getElementById('share-card');
const goHomeBtn = document.getElementById('go-home');
const errorModal = document.getElementById('error-modal');
const goHomeErrorBtn = document.getElementById('go-home-error');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadCard();
    setupEventListeners();
});

// Cargar carta
async function loadCard() {
    try {
        // Obtener el código de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const cardCode = urlParams.get('code') || getCardCodeFromPath();
        
        if (!cardCode) {
            showError('No se encontró el código de la carta.');
            return;
        }
        
        // Buscar la carta en Firebase
        const cardsRef = ref(database, 'cards');
        const snapshot = await get(cardsRef);
        
        if (snapshot.exists()) {
            let foundCard = null;
            
            snapshot.forEach((childSnapshot) => {
                const card = childSnapshot.val();
                if (card.privateCode === cardCode || childSnapshot.key === cardCode) {
                    foundCard = {
                        id: childSnapshot.key,
                        ...card
                    };
                }
            });
            
            if (foundCard) {
                currentCard = foundCard;
                displayCard(foundCard);
                
                // Log analytics
                logEvent(analytics, 'card_viewed_private', {
                    card_id: foundCard.id,
                    card_type: foundCard.type,
                    has_music: foundCard.music !== null,
                    has_images: foundCard.images && foundCard.images.length > 0,
                    has_drawing: foundCard.drawing !== null
                });
                
            } else {
                showError('La carta no fue encontrada o ha sido eliminada.');
            }
        } else {
            showError('No se encontraron cartas en la base de datos.');
        }
        
    } catch (error) {
        console.error('Error loading card:', error);
        showError('Error al cargar la carta. Inténtalo de nuevo.');
    }
}

// Obtener código de la carta desde la ruta
function getCardCodeFromPath() {
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1];
}

// Mostrar carta
function displayCard(card) {
    // Configurar título de la página
    document.title = `${card.title} - GiftSpark`;
    
    // Mostrar información básica
    cardTitle.textContent = card.title;
    cardRecipient.textContent = card.recipient;
    cardSender.textContent = card.sender;
    cardType.textContent = getTypeLabel(card.type);
    
    // Aplicar clase de diseño
    const cardViewer = document.querySelector('.card-viewer');
    cardViewer.className = `card-viewer ${card.design}`;
    
    // Mostrar contenido
    let content = '';
    
    // Texto de la carta
    if (card.content) {
        content += `<div class="card-text">${card.content}</div>`;
    }
    
    // Imágenes
    if (card.images && card.images.length > 0) {
        content += '<div class="card-images">';
        card.images.forEach(img => {
            content += `<img src="${img}" alt="Imagen de la carta" loading="lazy">`;
        });
        content += '</div>';
    }
    
    // Dibujo
    if (card.drawing) {
        content += `<div class="card-drawing"><img src="${card.drawing}" alt="Dibujo personalizado"></div>`;
    }
    
    cardContent.innerHTML = content;
    
    // Mostrar mensaje adicional si existe
    if (card.message) {
        messageText.textContent = card.message;
        cardMessage.style.display = 'block';
    }
    
    // Configurar música si existe
    if (card.music) {
        setupMusic(card.music);
    }
    
    // Configurar botones
    setupButtons(card);
}

// Configurar música
function setupMusic(music) {
    musicName.textContent = music.name;
    cardAudio.src = music.data;
    musicControls.style.display = 'block';
    
    // Configurar controles de música
    cardAudio.addEventListener('loadedmetadata', () => {
        // Verificar duración
        if (cardAudio.duration > 240) {
            console.warn('La música excede los 4 minutos permitidos');
        }
    });
    
    cardAudio.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseButton();
    });
    
    cardAudio.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayPauseButton();
    });
    
    cardAudio.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayPauseButton();
    });
}

// Configurar botones
function setupButtons(card) {
    // Botón de like
    likeBtn.addEventListener('click', () => likeCard(card.id));
    
    // Botón de compartir
    shareBtn.addEventListener('click', () => shareCard(card));
    
    // Botón de ir al inicio
    goHomeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Controles de música
    playPauseBtn.addEventListener('click', togglePlayPause);
    stopBtn.addEventListener('click', stopMusic);
    muteBtn.addEventListener('click', toggleMute);
    
    // Botón de error
    goHomeErrorBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
    
    // Eventos del audio
    cardAudio.addEventListener('volumechange', updateMuteButton);
}

// Reproducir/Pausar música
function togglePlayPause() {
    if (cardAudio.paused) {
        cardAudio.play();
    } else {
        cardAudio.pause();
    }
}

// Detener música
function stopMusic() {
    cardAudio.pause();
    cardAudio.currentTime = 0;
}

// Silenciar/Desilenciar música
function toggleMute() {
    if (isMuted) {
        cardAudio.muted = false;
        isMuted = false;
    } else {
        cardAudio.muted = true;
        isMuted = true;
    }
    updateMuteButton();
}

// Actualizar botón de reproducir/pausar
function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.className = 'fas fa-pause';
    } else {
        icon.className = 'fas fa-play';
    }
}

// Actualizar botón de silenciar
function updateMuteButton() {
    const icon = muteBtn.querySelector('i');
    if (cardAudio.muted) {
        icon.className = 'fas fa-volume-mute';
        muteBtn.classList.add('muted');
    } else {
        icon.className = 'fas fa-volume-up';
        muteBtn.classList.remove('muted');
    }
}

// Dar like a la carta
async function likeCard(cardId) {
    try {
        const cardRef = ref(database, `cards/${cardId}`);
        const snapshot = await get(cardRef);
        
        if (snapshot.exists()) {
            const card = snapshot.val();
            const updatedLikes = (card.likes || 0) + 1;
            
            await update(cardRef, { likes: updatedLikes });
            
            // Actualizar botón
            likeBtn.innerHTML = `<i class="fas fa-heart"></i> Me gusta (${updatedLikes})`;
            likeBtn.style.background = 'var(--secondary-color)';
            
            // Log analytics
            logEvent(analytics, 'card_liked_private', {
                card_id: cardId
            });
            
            showNotification('¡Gracias por tu like! ❤️', 'success');
        }
    } catch (error) {
        console.error('Error liking card:', error);
        showNotification('Error al dar like.', 'error');
    }
}

// Compartir carta
function shareCard(card) {
    const shareText = `¡Mira esta carta especial que recibí en GiftSpark! 💌\n\n"${card.title}"\n\n${card.content ? card.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : ''}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'GiftSpark - Carta Especial',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(shareText + '\n\n' + window.location.href).then(() => {
            showNotification('¡Enlace copiado al portapapeles!', 'success');
        });
    }
    
    // Log analytics
    logEvent(analytics, 'card_shared_private', {
        card_id: card.id
    });
}

// Mostrar error
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
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

// Mostrar notificaciones
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    // Cambiar a position absolute y contenedor local
    notification.style.cssText = `
        position: absolute;
        top: 20px;
        left: 2.5vw;
        right: 2.5vw;
        max-width: 95vw;
        background: ${type === 'success' ? '#4ecdc4' : '#ff6b9d'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        word-break: break-word;
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    // Insertar en el contenedor principal, no en body
    const container = document.querySelector('.card-viewer-container') || document.body;
    container.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
    }, 3000);
} 