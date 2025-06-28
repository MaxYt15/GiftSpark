# 🎁 GiftSpark - Cartas y Regalos Virtuales

GiftSpark es una plataforma web moderna y atractiva para crear y compartir cartas y regalos virtuales. Perfecta para expresar tus sentimientos a tu novia, novio, amigos, crush o hacer declaraciones especiales.

## ✨ Características

- 🎨 **Diseño Super Llamativo**: Interfaz moderna con animaciones y efectos visuales atractivos
- 💌 **Cartas Virtuales**: Crea cartas personalizadas con diferentes diseños
- 🎁 **Regalos Virtuales**: Comparte regalos virtuales únicos
- 💕 **Categorías Especiales**: 
  - Para mi Novia/Novio
  - Para mi Amigo/Amiga
  - Para mi Mejor Amigo/Mejor Amiga
  - Para mi Crush
  - Declaraciones
- ❤️ **Sistema de Likes**: Interactúa con los regalos y cartas
- 📱 **Responsive**: Funciona perfectamente en móviles y tablets
- 🚀 **Backend Completo**: API REST con Node.js y Express
- 🔥 **Firebase Realtime Database**: Base de datos en tiempo real
- 📊 **Analytics**: Seguimiento de eventos y interacciones
- ⚡ **Tiempo Real**: Actualizaciones instantáneas sin recargar

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Firebase Realtime Database** - Base de datos en tiempo real
- **Firebase Analytics** - Análisis de eventos
- **CORS** - Middleware para CORS
- **UUID** - Generación de IDs únicos

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con animaciones
- **JavaScript ES6+** - Funcionalidad interactiva
- **Firebase SDK** - Integración con Firebase
- **Font Awesome** - Iconos
- **Google Fonts** - Tipografías atractivas

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd GiftSpark-WEB
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Firebase** (Opcional - ya configurado)
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto
   - Habilita Realtime Database
   - Copia la configuración a `config/firebase.js`

4. **Inicia el servidor**
   ```bash
   npm start
   ```

5. **Abre tu navegador**
   ```
   http://localhost:3000
   ```

## 🔥 Configuración de Firebase

El proyecto ya incluye una configuración de Firebase. Si quieres usar tu propia base de datos:

1. **Crea un proyecto en Firebase Console**
2. **Habilita Realtime Database**
3. **Actualiza la configuración en `index.js`**:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id",
  measurementId: "tu-measurement-id",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com"
};
```

## 🚀 Uso

### Crear un Regalo Virtual
1. Ve a la sección "Crear"
2. Selecciona "Regalo Virtual"
3. Completa el formulario:
   - Título del regalo
   - Tipo (novia, novio, amigo, etc.)
   - Destinatario
   - Tu nombre
   - Descripción del regalo
   - Mensaje personal
4. Haz clic en "Crear Regalo"

### Crear una Carta Virtual
1. Ve a la sección "Crear"
2. Selecciona "Carta Virtual"
3. Completa el formulario:
   - Título de la carta
   - Tipo de carta
   - Destinatario
   - Tu nombre
   - Diseño de la carta
   - Contenido de la carta
4. Haz clic en "Crear Carta"

### Interactuar con Contenido
- **Ver detalles**: Haz clic en cualquier regalo o carta
- **Dar like**: Usa el botón de corazón
- **Compartir**: Usa el botón de compartir
- **Estado de conexión**: Mira el indicador en la esquina superior derecha

## 📁 Estructura del Proyecto

```
GiftSpark-WEB/
├── index.js              # Servidor principal con Firebase
├── package.json          # Dependencias y scripts
├── README.md            # Documentación
├── config/
│   └── firebase.js      # Configuración de Firebase
└── public/              # Archivos del frontend
    ├── index.html       # Página principal
    ├── styles.css       # Estilos CSS
    └── script.js        # JavaScript con Firebase SDK
```

## 🔧 API Endpoints

### Regalos
- `GET /api/gifts` - Obtener todos los regalos
- `POST /api/gifts` - Crear un nuevo regalo
- `POST /api/gifts/:id/like` - Dar like a un regalo

### Cartas
- `GET /api/cards` - Obtener todas las cartas
- `POST /api/cards` - Crear una nueva carta
- `POST /api/cards/:id/like` - Dar like a una carta

## 🔥 Características de Firebase

- **Realtime Database**: Actualizaciones en tiempo real
- **Sincronización Automática**: Los cambios se reflejan instantáneamente
- **Escalabilidad**: Maneja múltiples usuarios simultáneos
- **Analytics**: Seguimiento de eventos y métricas
- **Seguridad**: Reglas de seguridad configurables

## 🎨 Características de Diseño

- **Gradientes Modernos**: Colores vibrantes y atractivos
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Iconos Interactivos**: Font Awesome para mejor UX
- **Tipografías Elegantes**: Dancing Script para títulos, Poppins para texto
- **Efectos Hover**: Interacciones visuales atractivas
- **Responsive Design**: Adaptable a todos los dispositivos

## 🌟 Características Especiales

- **Corazones Flotantes**: Animación de fondo en la página principal
- **Efectos de Sparkle**: Elementos brillantes en títulos
- **Modal Interactivo**: Vista detallada de regalos y cartas
- **Notificaciones**: Mensajes de éxito y error
- **Navegación Suave**: Scroll automático entre secciones
- **Categorías Visuales**: Tarjetas interactivas para seleccionar tipo
- **Indicador de Conexión**: Estado de conexión con Firebase
- **Analytics Integrado**: Seguimiento de eventos automático

## 📊 Analytics Events

El sistema registra automáticamente los siguientes eventos:

- `gift_created` - Cuando se crea un regalo
- `card_created` - Cuando se crea una carta
- `gift_viewed` - Cuando se ve un regalo
- `card_viewed` - Cuando se ve una carta
- `gift_liked` - Cuando se da like a un regalo
- `card_liked` - Cuando se da like a una carta
- `gift_shared` - Cuando se comparte un regalo
- `card_shared` - Cuando se comparte una carta

## 🔮 Futuras Mejoras

- [ ] Autenticación de usuarios con Firebase Auth
- [ ] Galería de imágenes para regalos
- [ ] Música de fondo
- [ ] Temas personalizables
- [ ] Exportar a PDF
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Reglas de seguridad avanzadas
- [ ] Backup automático
- [ ] Estadísticas detalladas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **GiftSpark Team** - *Desarrollo inicial*

## 🙏 Agradecimientos

- Firebase por la infraestructura en tiempo real
- Font Awesome por los iconos
- Google Fonts por las tipografías
- La comunidad de desarrolladores web

---

**¡Comparte el amor y la amistad con GiftSpark! 💕✨** # GiftSpark
