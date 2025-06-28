// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzj_z2GhjWtrxBfzbyQd9Yq0y76tTJx4I",
  authDomain: "gift-spark-b7c70.firebaseapp.com",
  projectId: "gift-spark-b7c70",
  storageBucket: "gift-spark-b7c70.firebasestorage.app",
  messagingSenderId: "775684044370",
  appId: "1:775684044370:web:f4e573c1f5517c3795918b",
  measurementId: "G-NC2JKQYJTY",
  databaseURL: "https://gift-spark-b7c70-default-rtdb.firebaseio.com" // URL de Realtime Database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Analytics (solo en el navegador)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { database, analytics }; 