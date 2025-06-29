# 🎁 GiftSpark - Plataforma de Cartas y Regalos Virtuales

Una plataforma web moderna para crear y compartir cartas y regalos virtuales únicos con tus seres queridos.

## ✨ Características Principales

### 🎨 **Editor Avanzado de Cartas**
- Editor de texto rico con múltiples fuentes y estilos
- Herramientas de dibujo integradas
- Soporte para imágenes y música
- Vista previa en tiempo real
- Cartas públicas y privadas con códigos únicos

### 🎁 **Regalos Virtuales**
- Creación de regalos personalizados
- Categorías específicas (novia, novio, amigos, etc.)
- Mensajes personalizados
- Sistema de likes y compartir

### 📱 **Diseño Responsive**
- Menú hamburguesa para móviles
- Interfaz adaptativa para todos los dispositivos
- Navegación fluida y intuitiva

### 🔒 **Seguridad Mejorada**
- Validación de datos en frontend y backend
- Sanitización de entrada para prevenir XSS
- Variables de entorno para configuración
- Manejo robusto de errores

## 🚀 Tecnologías Utilizadas

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Base de Datos**: Firebase Realtime Database
- **Autenticación**: Firebase Auth
- **Hosting**: Firebase Hosting (recomendado)

## 📦 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Firebase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/giftspark.git
cd giftspark
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

Edita el archivo `.env` con tus credenciales de Firebase:
```env
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu_proyecto_id
FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
FIREBASE_APP_ID=tu_app_id
FIREBASE_MEASUREMENT_ID=tu_measurement_id
FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🔧 Configuración de Firebase

1. Crea un nuevo proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Realtime Database
3. Configura las reglas de seguridad
4. Obtén las credenciales de configuración
5. Actualiza el archivo `.env`

## 📱 Uso

### Crear un Regalo Virtual
1. Ve a la sección "Crear"
2. Selecciona "Regalo Virtual"
3. Completa el formulario con los detalles
4. Haz clic en "Crear Regalo"

### Crear una Carta Virtual
1. Ve a "Editor Avanzado"
2. Personaliza el texto, imágenes y música
3. Configura la visibilidad (público/privado)
4. Guarda la carta

### Ver Cartas Privadas
- Las cartas privadas generan un código único
- Comparte el enlace para que otros puedan ver la carta
- Ejemplo: `https://tudominio.com/ver-carta?code=ABC12345`

## 🛠️ Mejoras Implementadas

### ✅ **Problemas Resueltos**

#### **Diseño y UX**
- ✅ Menú hamburguesa funcional para móviles
- ✅ Responsive design mejorado
- ✅ Eliminación de overflow horizontal
- ✅ Media queries consistentes

#### **Funcionalidad**
- ✅ Validación de formularios mejorada
- ✅ Manejo específico de errores
- ✅ Event listeners sin duplicación
- ✅ Gestión de estado centralizada

#### **Multimedia**
- ✅ Validación de archivos (tamaño, tipo, dimensiones)
- ✅ Límites de tamaño para imágenes (5MB) y música (10MB)
- ✅ Validación de duración de audio (máx 4 minutos)
- ✅ Botones para remover multimedia

#### **Navegación**
- ✅ Rutas relativas corregidas
- ✅ Manejo robusto de URLs privadas
- ✅ Validación de códigos de carta

#### **CSS**
- ✅ Eliminación de `!important` excesivo
- ✅ Especificidad CSS mejorada
- ✅ Media queries reorganizadas

#### **Técnico**
- ✅ Memory leaks prevenidos con cleanup
- ✅ Gestión de estado mejorada
- ✅ Estados de carga implementados

#### **Seguridad**
- ✅ Variables de entorno para Firebase
- ✅ Validación y sanitización de datos
- ✅ Prevención de XSS
- ✅ Manejo de errores específico

## 🎯 Próximas Mejoras

- [ ] Sistema de autenticación de usuarios
- [ ] Galería de plantillas de cartas
- [ ] Sistema de comentarios
- [ ] Notificaciones push
- [ ] Exportar cartas como PDF
- [ ] Integración con redes sociales
- [ ] Analytics avanzado
- [ ] Tests automatizados

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **GiftSpark Team** - *Desarrollo inicial*
- **Tu Nombre** - *Mejoras y mantenimiento*

## 🙏 Agradecimientos

- Firebase por la infraestructura
- Font Awesome por los iconos
- Google Fonts por las tipografías
- La comunidad de desarrolladores

---

**Hecho con ❤️ para compartir amor y amistad**
