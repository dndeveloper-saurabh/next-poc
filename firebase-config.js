import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCgfeFcXVvvuIp79IJD8KCahJo2PzrHDco",
  authDomain: "avian-display-193502.firebaseapp.com",
  databaseURL: "https://avian-display-193502.firebaseio.com",
  projectId: "avian-display-193502",
  storageBucket: "avian-display-193502.appspot.com",
  messagingSenderId: "661886367826",
  appId: "1:661886367826:web:ffaad3bce5fed318a5878b",
};

let firebaseApp;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app();
}

const db = firebaseApp.firestore();
const rdb = firebaseApp.database();
const auth = firebase.auth();
const storage = firebase.storage();
let messaging = null;
const functions = firebase.functions();
const phoneAuth = firebase.auth.PhoneAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const appleProvider = new firebase.auth.OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

const isMessagingSupported = firebase.messaging.isSupported();

if (isMessagingSupported) {
  messaging = firebase.messaging();
}

export {
  db,
  rdb,
  auth,
  googleProvider,
  facebookProvider,
  appleProvider,
  storage,
  functions,
  firebaseApp,
  phoneAuth,
  messaging,
  isMessagingSupported,
};
