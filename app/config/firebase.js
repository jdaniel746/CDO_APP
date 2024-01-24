import { initializeApp } from 'firebase/app';
// authentication
import { initializeAuth, getAuth } from 'firebase/auth';
/*import { getReactNativePersistence } from 'firebase/auth/react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';*/
// firestore
import { getFirestore } from 'firebase/firestore';
// cloud storage
import { getStorage } from 'firebase/storage';

//import { Env } from '@env';

const firebaseConfig = {
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

export { auth, firestore, storage };