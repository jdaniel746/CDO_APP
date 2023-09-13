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
  apiKey: 'AIzaSyCO8TT14jI6lSiPPjB8BXJATn0wcsO8B2w',
  authDomain: 'cdo-app-39c97.firebaseapp.com',
  projectId: 'cdo-app-39c97',
  storageBucket: 'cdo-app-39c97.appspot.com',
  messagingSenderId: '1006268452087',
  appId: '1:1006268452087:web:338c0211a2a55b803fd7f2',
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
