// src/utils/firebaseService.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

//  OBJETO DE CONFIGURAÇÃO DO FIREBASE COPIADO DO CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyBfUWK3fYufoylWQh0aXCjCeFoevhqwCTo",
  authDomain: "campus-connect-cbd68.firebaseapp.com",
  projectId: "campus-connect-cbd68",
  storageBucket: "campus-connect-cbd68.appspot.com", // CORRIGIDO
  messagingSenderId: "39522128798",
  appId: "1:39522128798:android:8cbaed6afdc4a454eebc8f", // CORRIGIDO
  measurementId: "G-KY5NNP4WVR"
};

// IDs DE CLIENTE DO GOOGLE 
// (IOS_CLIENT_ID está vazio-optei não configurar para iOS)
export const WEB_CLIENT_ID = "39522128798-kh18km49arl0va1jjkdnd4rtp5hgg64b.apps.googleusercontent.com";
export const ANDROID_CLIENT_ID = "39522128798-kh18km49arl0va1jjkdnd4rtp5hgg64b.apps.googleusercontent.com"; // CORRIGIDO
export const IOS_CLIENT_ID = ""; // Deixado vazio,não configurado para iOS


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;