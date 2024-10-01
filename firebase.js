// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgBwfUpy6pgzL5GNlntzxZ57mmqSkA_XQ",
  authDomain: "webanalisisdampaklalulintas.firebaseapp.com",
  databaseURL: "https://webanalisisdampaklalulintas-default-rtdb.firebaseio.com",
  projectId: "webanalisisdampaklalulintas",
  storageBucket: "webanalisisdampaklalulintas.appspot.com",
  messagingSenderId: "435784394834",
  appId: "1:435784394834:web:698c257010dee577cf178b",
  measurementId: "G-PE2FWCP87Y"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
