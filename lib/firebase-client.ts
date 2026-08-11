
"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAETldm9cacVQhKRDz5XZOJhCR-IXjU6c4",
  authDomain: "glasskid-portfolio.firebaseapp.com",
  projectId: "glasskid-portfolio",
  storageBucket: "glasskid-portfolio.firebasestorage.app",
  messagingSenderId: "870231487489",
  appId: "1:870231487489:web:5951b6a92cf8219d90fc00",
  measurementId: "G-LBF17R1PDV",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;