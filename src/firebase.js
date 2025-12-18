import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore"; // Mudamos aqui

const firebaseConfig = {
  apiKey: "AIzaSyABh0nqY_YJFBOAsKOAuVwYjm2soRVaEG4",
  authDomain: "igor-portfolio-cms.firebaseapp.com",
  projectId: "igor-portfolio-cms",
  storageBucket: "igor-portfolio-cms.firebasestorage.app",
  messagingSenderId: "269561809266",
  appId: "1:269561809266:web:a9a39c5fea55f775aff5eb",
  measurementId: "G-XK8JR4995Q"
};

const app = initializeApp(firebaseConfig);

// Configuração otimizada para evitar delay em redes locais/desenvolvimento
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Força um método de conexão mais estável para desenvolvimento
});

export const auth = getAuth(app);