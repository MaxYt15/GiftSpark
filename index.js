import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, get, set, update, query, orderByChild, equalTo } from 'firebase/database';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase configuration con variables de entorno
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDzj_z2GhjWtrxBfzbyQd9Yq0y76tTJx4I",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "gift-spark-b7c70.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "gift-spark-b7c70",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "gift-spark-b7c70.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "775684044370",
  appId: process.env.FIREBASE_APP_ID || "1:775684044370:web:f4e573c1f5517c3795918b",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-NC2JKQYJTY",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://gift-spark-b7c70-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Middleware de validación
function validateGiftData(data) {
    const errors = [];
    
    if (!data.title || data.title.trim().length === 0) {
        errors.push('El título es requerido');
    }
    if (!data.type || data.type.trim().length === 0) {
        errors.push('El tipo es requerido');
    }
    if (!data.recipient || data.recipient.trim().length === 0) {
        errors.push('El destinatario es requerido');
    }
    if (!data.sender || data.sender.trim().length === 0) {
        errors.push('El remitente es requerido');
    }
    if (!data.description || data.description.trim().length === 0) {
        errors.push('La descripción es requerida');
    }
    if (!data.message || data.message.trim().length === 0) {
        errors.push('El mensaje es requerido');
    }
    
    return errors;
}

function validateCardData(data) {
    const errors = [];
    
    if (!data.title || data.title.trim().length === 0) {
        errors.push('El título es requerido');
    }
    if (!data.type || data.type.trim().length === 0) {
        errors.push('El tipo es requerido');
    }
    if (!data.recipient || data.recipient.trim().length === 0) {
        errors.push('El destinatario es requerido');
    }
    if (!data.sender || data.sender.trim().length === 0) {
        errors.push('El remitente es requerido');
    }
    if (!data.content || data.content.trim().length === 0) {
        errors.push('El contenido es requerido');
    }
    
    return errors;
}

// Función para sanitizar datos
function sanitizeData(data) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            // Remover scripts y HTML peligroso
            sanitized[key] = value
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

// Rutas de páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cartas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cartas.html'));
});

app.get('/ver-carta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ver-carta.html'));
});

// Ruta para cartas privadas
app.get('/cartas/:code', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ver-carta.html'));
});

// Rutas API
app.get('/api/gifts', async (req, res) => {
    try {
        const giftsRef = ref(database, 'gifts');
        const snapshot = await get(giftsRef);
        
        if (snapshot.exists()) {
            const gifts = [];
            snapshot.forEach((childSnapshot) => {
                gifts.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            res.json(gifts);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching gifts:', error);
        res.status(500).json({ error: 'Error al obtener los regalos' });
    }
});

app.post('/api/gifts', async (req, res) => {
    try {
        // Validar datos de entrada
        const validationErrors = validateGiftData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Datos inválidos', 
                details: validationErrors 
            });
        }
        
        // Sanitizar datos
        const sanitizedData = sanitizeData(req.body);
        
        const newGift = {
            title: sanitizedData.title,
            description: sanitizedData.description,
            type: sanitizedData.type,
            recipient: sanitizedData.recipient,
            message: sanitizedData.message,
            sender: sanitizedData.sender,
            createdAt: new Date().toISOString(),
            likes: 0
        };
        
        const giftsRef = ref(database, 'gifts');
        const newGiftRef = await push(giftsRef, newGift);
        
        const createdGift = {
            id: newGiftRef.key,
            ...newGift
        };
        
        res.status(201).json(createdGift);
    } catch (error) {
        console.error('Error creating gift:', error);
        res.status(500).json({ error: 'Error al crear el regalo' });
    }
});

app.get('/api/cards', async (req, res) => {
    try {
        const cardsRef = ref(database, 'cards');
        const snapshot = await get(cardsRef);
        
        if (snapshot.exists()) {
            const cards = [];
            snapshot.forEach((childSnapshot) => {
                const card = childSnapshot.val();
                // Solo incluir cartas públicas
                if (card.visibility === 'public') {
                    cards.push({
                        id: childSnapshot.key,
                        ...card
                    });
                }
            });
            res.json(cards);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Error al obtener las cartas' });
    }
});

app.post('/api/cards', async (req, res) => {
    try {
        // Validar datos de entrada
        const validationErrors = validateCardData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: 'Datos inválidos', 
                details: validationErrors 
            });
        }
        
        // Sanitizar datos
        const sanitizedData = sanitizeData(req.body);
        
        const newCard = {
            title: sanitizedData.title,
            content: sanitizedData.content,
            type: sanitizedData.type,
            recipient: sanitizedData.recipient,
            sender: sanitizedData.sender,
            design: sanitizedData.design || 'romantic',
            visibility: sanitizedData.visibility || 'public',
            message: sanitizedData.message || '',
            images: sanitizedData.images || [],
            music: sanitizedData.music || null,
            drawing: sanitizedData.drawing || null,
            createdAt: new Date().toISOString(),
            likes: 0
        };
        
        // Generar código privado si es necesario
        if (newCard.visibility === 'private') {
            newCard.privateCode = generatePrivateCode();
        }
        
        const cardsRef = ref(database, 'cards');
        const newCardRef = await push(cardsRef, newCard);
        
        const createdCard = {
            id: newCardRef.key,
            ...newCard
        };
        
        res.status(201).json(createdCard);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ error: 'Error al crear la carta' });
    }
});

// Buscar carta por código privado
app.get('/api/cards/private/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const cardsRef = ref(database, 'cards');
        const cardsQuery = query(cardsRef, orderByChild('privateCode'), equalTo(code));
        const snapshot = await get(cardsQuery);
        
        if (snapshot.exists()) {
            let foundCard = null;
            snapshot.forEach((childSnapshot) => {
                foundCard = {
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                };
            });
            res.json(foundCard);
        } else {
            res.status(404).json({ error: 'Carta no encontrada' });
        }
    } catch (error) {
        console.error('Error fetching private card:', error);
        res.status(500).json({ error: 'Error al obtener la carta' });
    }
});

// Buscar carta por ID
app.get('/api/cards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cardRef = ref(database, `cards/${id}`);
        const snapshot = await get(cardRef);
        
        if (snapshot.exists()) {
            const card = {
                id: snapshot.key,
                ...snapshot.val()
            };
            res.json(card);
        } else {
            res.status(404).json({ error: 'Carta no encontrada' });
        }
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).json({ error: 'Error al obtener la carta' });
    }
});

app.post('/api/gifts/:id/like', async (req, res) => {
    try {
        const giftRef = ref(database, `gifts/${req.params.id}`);
        const snapshot = await get(giftRef);
        
        if (snapshot.exists()) {
            const gift = snapshot.val();
            const updatedLikes = (gift.likes || 0) + 1;
            
            await update(giftRef, { likes: updatedLikes });
            
            const updatedGift = {
                id: req.params.id,
                ...gift,
                likes: updatedLikes
            };
            
            res.json(updatedGift);
        } else {
            res.status(404).json({ error: 'Regalo no encontrado' });
        }
    } catch (error) {
        console.error('Error liking gift:', error);
        res.status(500).json({ error: 'Error al dar like al regalo' });
    }
});

app.post('/api/cards/:id/like', async (req, res) => {
    try {
        const cardRef = ref(database, `cards/${req.params.id}`);
        const snapshot = await get(cardRef);
        
        if (snapshot.exists()) {
            const card = snapshot.val();
            const updatedLikes = (card.likes || 0) + 1;
            
            await update(cardRef, { likes: updatedLikes });
            
            const updatedCard = {
                id: req.params.id,
                ...card,
                likes: updatedLikes
            };
            
            res.json(updatedCard);
        } else {
            res.status(404).json({ error: 'Carta no encontrada' });
        }
    } catch (error) {
        console.error('Error liking card:', error);
        res.status(500).json({ error: 'Error al dar like a la carta' });
    }
});

// Generar código privado
function generatePrivateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🎁 GiftSpark está corriendo en http://localhost:${PORT}`);
    console.log(`✨ ¡Comparte el amor y la amistad con GiftSpark!`);
    console.log(`🔥 Firebase Realtime Database conectado`);
    console.log(`🎨 Editor de cartas avanzado disponible en /cartas`);
    console.log(`🔗 Cartas privadas con códigos únicos`);
}); 