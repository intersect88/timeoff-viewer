import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVYu_XkeKBdB9I5a1XBSNcBgCmTCsi2_E",
  authDomain: "timeoff-viewer.firebaseapp.com",
  projectId: "timeoff-viewer",
  storageBucket: "timeoff-viewer.firebasestorage.app",
  messagingSenderId: "401436008721",
  appId: "1:401436008721:web:4b87ce47726297ce3cacb0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const db = getFirestore(app);
