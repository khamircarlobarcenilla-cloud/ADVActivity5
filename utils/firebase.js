import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmDXrA_2wP681M7LOphOqdsk2OPuUvVGY",
  authDomain: "act7-ace11.firebaseapp.com",
  projectId: "act7-ace11",
  storageBucket: "act7-ace11.firebasestorage.app",
  messagingSenderId: "862942208477",
  appId: "1:862942208477:web:76e09dabfa16a452f91634",
  measurementId: "G-P13QC5DR7D",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
