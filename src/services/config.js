import * as firebase from "firebase/app";

export const CONFIG = {
  BUILD_VERSION: '0.0.4',
}

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBlU8164kpkAc-8Bh3qgE3ggsYosDclBSw",
  authDomain: "nozol-test.firebaseapp.com",
  databaseURL: "https://nozol-test.firebaseio.com",
  projectId: "nozol-test",
  storageBucket: "nozol-test.appspot.com",
  messagingSenderId: "222529626196",
  appId: "1:222529626196:web:e10f0e84bbb171ba7f0dc1",
  measurementId: "G-KRVZHK0SH4"
}

firebase.initializeApp(FIREBASE_CONFIG)

export default firebase