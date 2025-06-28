// Importar Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getDatabase, ref, push, set, get } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';
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
let currentTool = 'pen';
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let cardData = {
    title: '',
    type: '',
    recipient: '',
    sender: '',
    design: 'romantic',
    visibility: 'public',
    message: '',
    content: '',
    images: [],
    music: null,
    drawing: null,
    createdAt: null,
    privateCode: null
};

// Elementos del DOM
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const textArea = document.getElementById('text-area');
const imageContainer = document.getElementById('image-container');
const musicInfo = document.getElementById('music-info');
const musicName = document.getElementById('music-name');
const musicDuration = document.getElementById('music-duration');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeCanvas();
    setupEventListeners();
    setupTextEditor();
    setupDrawingTools();
    setupMediaTools();
    setupFormHandlers();
});

// Inicializar canvas
function initializeCanvas() {
    // Configurar canvas para dispositivos de alta densidad
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Configurar estilo del canvas
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 5;
}

// Configurar event listeners
function setupEventListeners() {
    // Modal events
    const previewModal = document.getElementById('preview-modal');
    const successModal = document.getElementById('success-modal');
    const closeBtns = document.querySelectorAll('.close');
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            previewModal.style.display = 'none';
            successModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === previewModal) previewModal.style.display = 'none';
        if (e.target === successModal) successModal.style.display = 'none';
    });
}

// Configurar editor de texto
function setupTextEditor() {
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const textColor = document.getElementById('text-color');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');
    
    // Cambiar fuente
    fontFamily.addEventListener('change', () => {
        document.execCommand('fontName', false, fontFamily.value);
        textArea.focus();
    });
    
    // Cambiar tamaño
    fontSize.addEventListener('change', () => {
        document.execCommand('fontSize', false, fontSize.value);
        textArea.focus();
    });
    
    // Cambiar color
    textColor.addEventListener('change', () => {
        document.execCommand('foreColor', false, textColor.value);
        textArea.focus();
    });
    
    // Botones de formato
    boldBtn.addEventListener('click', () => {
        document.execCommand('bold', false, null);
        textArea.focus();
    });
    
    italicBtn.addEventListener('click', () => {
        document.execCommand('italic', false, null);
        textArea.focus();
    });
    
    underlineBtn.addEventListener('click', () => {
        document.execCommand('underline', false, null);
        textArea.focus();
    });
    
    // Evento de cambio en el área de texto
    textArea.addEventListener('input', () => {
        cardData.content = textArea.innerHTML;
    });
}

// Configurar herramientas de dibujo
function setupDrawingTools() {
    const penTool = document.getElementById('pen-tool');
    const eraserTool = document.getElementById('eraser-tool');
    const drawingColor = document.getElementById('drawing-color');
    const brushSize = document.getElementById('brush-size');
    const clearCanvas = document.getElementById('clear-canvas');
    
    // Cambiar herramienta
    penTool.addEventListener('click', () => {
        currentTool = 'pen';
        updateToolButtons();
    });
    
    eraserTool.addEventListener('click', () => {
        currentTool = 'eraser';
        updateToolButtons();
    });
    
    // Cambiar color de dibujo
    drawingColor.addEventListener('change', () => {
        ctx.strokeStyle = drawingColor.value;
    });
    
    // Cambiar tamaño del pincel
    brushSize.addEventListener('change', () => {
        ctx.lineWidth = parseInt(brushSize.value);
    });
    
    // Limpiar canvas
    clearCanvas.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cardData.drawing = null;
    });
    
    // Eventos del canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Eventos táctiles para móviles
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

// Actualizar botones de herramientas
function updateToolButtons() {
    const penTool = document.getElementById('pen-tool');
    const eraserTool = document.getElementById('eraser-tool');
    
    penTool.classList.toggle('active', currentTool === 'pen');
    eraserTool.classList.toggle('active', currentTool === 'eraser');
    
    if (currentTool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
    } else {
        ctx.strokeStyle = document.getElementById('drawing-color').value;
    }
}

// Funciones de dibujo
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
    // Guardar el estado del canvas
    cardData.drawing = canvas.toDataURL();
}

// Manejar eventos táctiles
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                    e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

// Configurar herramientas multimedia
function setupMediaTools() {
    const addImageBtn = document.getElementById('add-image-btn');
    const addMusicBtn = document.getElementById('add-music-btn');
    const imageUpload = document.getElementById('image-upload');
    const musicUpload = document.getElementById('music-upload');
    
    addImageBtn.addEventListener('click', () => {
        imageUpload.click();
    });
    
    addMusicBtn.addEventListener('click', () => {
        musicUpload.click();
    });
    
    // Manejar subida de imágenes
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Manejar subida de música
    musicUpload.addEventListener('change', handleMusicUpload);
}

// Manejar subida de imágenes
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Verificar tipo de archivo
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor selecciona un archivo de imagen válido.', 'error');
        return;
    }
    
    // Verificar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('La imagen debe ser menor a 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Crear elemento de imagen
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = 'Imagen de la carta';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => {
            imageItem.remove();
            updateCardImages();
        };
        
        imageItem.appendChild(img);
        imageItem.appendChild(removeBtn);
        imageContainer.appendChild(imageItem);
        
        // Guardar en cardData
        updateCardImages();
        
        showNotification('Imagen agregada exitosamente!', 'success');
    };
    
    reader.readAsDataURL(file);
}

// Actualizar imágenes en cardData
function updateCardImages() {
    const images = [];
    const imageItems = imageContainer.querySelectorAll('.image-item img');
    imageItems.forEach(img => {
        images.push(img.src);
    });
    cardData.images = images;
}

// Manejar subida de música
function handleMusicUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Verificar tipo de archivo
    if (!file.type.startsWith('audio/')) {
        showNotification('Por favor selecciona un archivo de audio válido.', 'error');
        return;
    }
    
    // Verificar duración (máximo 4 minutos)
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        if (duration > 240) { // 4 minutos = 240 segundos
            showNotification('La música debe ser menor a 4 minutos.', 'error');
            return;
        }
        
        // Convertir a base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const musicData = e.target.result;
            
            cardData.music = {
                data: musicData,
                name: file.name,
                duration: formatDuration(duration)
            };
            
            // Mostrar información de la música
            musicName.textContent = file.name;
            musicDuration.textContent = formatDuration(duration);
            musicInfo.style.display = 'block';
            
            showNotification('Música agregada exitosamente!', 'success');
        };
        
        reader.readAsDataURL(file);
    });
}

// Formatear duración
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Configurar manejadores de formulario
function setupFormHandlers() {
    const saveCardBtn = document.getElementById('save-card');
    const previewCardBtn = document.getElementById('preview-card');
    const clearAllBtn = document.getElementById('clear-all');
    
    saveCardBtn.addEventListener('click', saveCard);
    previewCardBtn.addEventListener('click', previewCard);
    clearAllBtn.addEventListener('click', clearAll);
    
    // Eventos de éxito
    document.getElementById('view-card').addEventListener('click', viewCard);
    document.getElementById('create-another').addEventListener('click', createAnother);
    document.getElementById('go-home').addEventListener('click', goHome);
    document.getElementById('copy-link').addEventListener('click', copyLink);
}

// Guardar carta
async function saveCard() {
    // Recopilar datos del formulario
    cardData.title = document.getElementById('card-title').value;
    cardData.type = document.getElementById('card-type').value;
    cardData.recipient = document.getElementById('card-recipient').value;
    cardData.sender = document.getElementById('card-sender').value;
    cardData.design = document.getElementById('card-design').value;
    cardData.visibility = document.querySelector('input[name="visibility"]:checked').value;
    cardData.message = document.getElementById('card-message').value;
    cardData.content = textArea.innerHTML;
    cardData.createdAt = new Date().toISOString();
    
    // Validaciones
    if (!cardData.title || !cardData.type || !cardData.recipient || !cardData.sender) {
        showNotification('Por favor completa todos los campos obligatorios.', 'error');
        return;
    }
    
    // Generar código para cartas privadas
    let privateCode = null;
    if (cardData.visibility === 'private') {
        privateCode = generatePrivateCode();
        cardData.privateCode = privateCode;
    }
    
    try {
        const cardsRef = ref(database, 'cards');
        const newCardRef = await push(cardsRef, cardData);
        
        // Log analytics
        logEvent(analytics, 'card_created_advanced', {
            card_type: cardData.type,
            card_visibility: cardData.visibility,
            has_images: cardData.images.length > 0,
            has_music: cardData.music !== null,
            has_drawing: cardData.drawing !== null
        });
        
        // Usar el código real guardado en la base de datos
        if (cardData.visibility === 'private') {
            showSuccessModal(cardData.privateCode);
        } else {
            showSuccessModal(null);
        }
    } catch (error) {
        console.error('Error saving card:', error);
        showNotification('Error al guardar la carta. Inténtalo de nuevo.', 'error');
    }
}

// Generar código privado
function generatePrivateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Mostrar modal de éxito
function showSuccessModal(privateCode) {
    const successModal = document.getElementById('success-modal');
    const successMessage = document.getElementById('success-message');
    const privateLink = document.getElementById('private-link');
    const privateLinkInput = document.getElementById('private-link-input');
    
    if (privateCode) {
        const link = `${window.location.origin}/cartas/${privateCode}`;
        successMessage.textContent = 'Tu carta privada ha sido creada. Comparte el siguiente enlace para que otros puedan verla:';
        privateLinkInput.value = link;
        privateLink.style.display = 'block';
    } else {
        successMessage.textContent = 'Tu carta pública ha sido creada y ya está disponible para todos.';
        privateLink.style.display = 'none';
    }
    
    successModal.style.display = 'block';
}

// Vista previa de la carta
function previewCard() {
    const previewModal = document.getElementById('preview-modal');
    const previewTitle = document.getElementById('preview-title');
    const previewBody = document.getElementById('preview-body');
    const musicControls = document.getElementById('music-controls');
    const previewAudio = document.getElementById('preview-audio');
    
    previewTitle.textContent = document.getElementById('card-title').value || 'Vista Previa de la Carta';
    
    // Construir contenido de la carta
    let content = `
        <div class="card-preview-content">
            <div class="card-text">${textArea.innerHTML}</div>
            ${cardData.images.length > 0 ? '<div class="card-images">' + 
                cardData.images.map(img => `<img src="${img}" alt="Imagen de la carta" style="max-width: 100%; margin: 10px 0; border-radius: 8px;">`).join('') + 
                '</div>' : ''}
            ${cardData.drawing ? '<div class="card-drawing"><img src="' + cardData.drawing + '" alt="Dibujo" style="max-width: 100%; border-radius: 8px;"></div>' : ''}
        </div>
    `;
    
    previewBody.innerHTML = content;
    
    // Configurar música si existe
    if (cardData.music) {
        previewAudio.src = cardData.music.data;
        musicControls.style.display = 'block';
    } else {
        musicControls.style.display = 'none';
    }
    
    previewModal.style.display = 'block';
}

// Limpiar todo
function clearAll() {
    if (confirm('¿Estás seguro de que quieres limpiar todo? Esta acción no se puede deshacer.')) {
        // Limpiar formulario
        document.getElementById('card-title').value = '';
        document.getElementById('card-type').value = '';
        document.getElementById('card-recipient').value = '';
        document.getElementById('card-sender').value = '';
        document.getElementById('card-design').value = 'romantic';
        document.getElementById('card-message').value = '';
        
        // Limpiar área de texto
        textArea.innerHTML = 'Escribe tu mensaje aquí...';
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Limpiar imágenes
        imageContainer.innerHTML = '';
        
        // Limpiar música
        musicInfo.style.display = 'none';
        
        // Resetear cardData
        cardData = {
            title: '',
            type: '',
            recipient: '',
            sender: '',
            design: 'romantic',
            visibility: 'public',
            message: '',
            content: '',
            images: [],
            music: null,
            drawing: null,
            createdAt: null,
            privateCode: null
        };
        
        showNotification('Todo ha sido limpiado.', 'success');
    }
}

// Ver carta
function viewCard() {
    // Implementar vista de la carta creada
    window.open(`/cartas/${cardData.privateCode || 'public'}`, '_blank');
}

// Crear otra carta
function createAnother() {
    document.getElementById('success-modal').style.display = 'none';
    clearAll();
}

// Ir al inicio
function goHome() {
    window.location.href = '/';
}

// Copiar enlace
function copyLink() {
    const linkInput = document.getElementById('private-link-input');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    showNotification('Enlace copiado al portapapeles!', 'success');
}

// Mostrar notificaciones
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4ecdc4' : '#ff6b9d'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
} 