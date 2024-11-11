import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCqn-edgVF3HkJNl9TxttrWFm3qY-__Rng",
    authDomain: "mobilewallsheep.firebaseapp.com",
    projectId: "mobilewallsheep",
    storageBucket: "mobilewallsheep.firebasestorage.app",
    messagingSenderId: "441378143775",
    appId: "1:441378143775:web:bb85e8265f5e138e9d5f2a",
    measurementId: "G-ST21X0ZFGQ"
};

let app;
let db;

// Check if Firebase has already been initialized
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} else {
    app = getApps()[0]; // if already initialized, use that one
    db = getFirestore(app);
}

export { db };
