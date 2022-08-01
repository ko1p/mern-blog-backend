import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "shishkova-blog.firebaseapp.com",
    projectId: "shishkova-blog",
    storageBucket: "shishkova-blog.appspot.com",
    messagingSenderId: "662723515539",
    appId: "1:662723515539:web:252db705773ca0a76e2966",
    measurementId: "G-32WTKEXCT0"
  };

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);