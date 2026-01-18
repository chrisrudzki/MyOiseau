import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";//in

import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp ({
  apiKey: "AIzaSyCAUd7eHodqA4wO4MVZCjp3Y3I9OVDu_Mo",
  authDomain: "cool-places-84e55.firebaseapp.com",
  projectId: "cool-places-84e55",
  storageBucket: "cool-places-84e55.firebasestorage.app",
  messagingSenderId: "568081727341",
  appId: "1:568081727341:web:f1fb2f4a13b53e008b2464"
});

const auth_in = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);

export const store = storage;
export const auth = auth_in;
export const Firestore = db;