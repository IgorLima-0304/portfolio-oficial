// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABh0nqY_YJFBOAsKOAuVwYjm2soRVaEG4",
  authDomain: "igor-portfolio-cms.firebaseapp.com",
  projectId: "igor-portfolio-cms",
  storageBucket: "igor-portfolio-cms.firebasestorage.app",
  messagingSenderId: "269561809266",
  appId: "1:269561809266:web:a9a39c5fea55f775aff5eb",
  measurementId: "G-XK8JR4995Q"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// CORREÇÃO AQUI: Garanta que as palavras 'export' estejam presentes
export const auth = getAuth(app);
export const db = getFirestore(app);