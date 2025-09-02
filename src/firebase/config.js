import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBg74v-h-5WymQm2J6TYSDjxAqBdFok0mQ",
  authDomain: "doggy-forum.firebaseapp.com",
  projectId: "doggy-forum",
  storageBucket: "doggy-forum.appspot.com",
  messagingSenderId: "854035007283",
  appId: "1:854035007283:web:20f260df0c5f3387e66046",
  measurementId: "G-EL12YN0FJV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;