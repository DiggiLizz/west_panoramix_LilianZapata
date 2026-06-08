import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIVFWzYKFJh0MyblMCSHV2EDIrdvuhkv4",
  authDomain: "auth-productora-eventos-ed2d1.firebaseapp.com",
  projectId: "auth-productora-eventos-ed2d1",
  storageBucket: "auth-productora-eventos-ed2d1.firebasestorage.app",
  messagingSenderId: "317922440099",
  appId: "1:317922440099:web:23ca998bd223d2a3cfe016"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// funcion para disparar el pop-up de google
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);