import * as firebase from "firebase/app";

export const CONFIG = {
  BUILD_VERSION: '0.0.41',
}

export const FIREBASE_CONFIG = {
  // apiKey: "AIzaSyBlU8164kpkAc-8Bh3qgE3ggsYosDclBSw",
  // authDomain: "nozol-test.firebaseapp.com",
  // databaseURL: "https://nozol-test.firebaseio.com",
  // projectId: "nozol-test",
  // storageBucket: "nozol-test.appspot.com",
  // messagingSenderId: "222529626196",
  // appId: "1:222529626196:web:e10f0e84bbb171ba7f0dc1",
  // measurementId: "G-KRVZHK0SH4"
  apiKey: "AIzaSyD3vZ20AC8ZK9xvknD5cCuAVU0PI051sp0",
  authDomain: "nozol-app.firebaseapp.com",
  databaseURL: "https://nozol-app.firebaseio.com",
  projectId: "nozol-app",
  storageBucket: "nozol-app.appspot.com",
  messagingSenderId: "513069854055",
  appId: "1:513069854055:web:6de2bd36999652ff1fd3c2",
  measurementId: "G-T4J0JT8ZB6"
}

export const HYPERPAY_CONFIG = {
  ACCESS_TOKEN: `OGFjN2E0Yzk3NTAyOTVhOTAxNzUwMzQ1OTdkZDAzM2N8Y244azc5V3gzNQ==`,
  PAYMENT_TYPE: {
    VISA: {
      entityId : `8ac7a4c9750295a9017503460b670340`,
      paymentType: `DB`,
      currency: `SAR`,
      paymentMethod: 'VISA'
    },
    MADA: {
      entityId : `8ac7a4c9750295a90175034786b10345`,
      paymentType: `DB`,
      currency: `SAR`,
      paymentMethod: 'MADA'
    }
  }
}

firebase.initializeApp(FIREBASE_CONFIG)

export default firebase