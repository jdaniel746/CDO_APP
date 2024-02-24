import { initializeApp } from 'firebase/app';
//import { getAnalytics } from 'firebase/analytics';
//import { getMessaging } from 'firebase/messaging';
// authentication
import { initializeAuth, getAuth } from 'firebase/auth';
/*import { getReactNativePersistence } from 'firebase/auth/react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';*/
// firestore
import { getFirestore } from 'firebase/firestore';
// cloud storage
import { getStorage } from 'firebase/storage';
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from "@env"

const firebaseConfig = {
  /*apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: ''*/
  apiKey: 'AIzaSyAj3LYrMKPZ4HPT4hIuqu-uNMbznfudad4',
  authDomain: 'cdocaracas-ed2d3.firebaseapp.com',
  projectId: 'cdocaracas-ed2d3',
  storageBucket: 'cdocaracas-ed2d3.appspot.com',
  messagingSenderId: '25084387666',
  appId: '1:25084387666:web:715d06c2caa65720891a8b',
  measurementId: ''
  
};


const app = initializeApp(firebaseConfig);
/*const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});*/
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage();
//const analytics = getAnalytics(app);

//export const messaging = getMessaging(app);

export { auth, firestore, storage };