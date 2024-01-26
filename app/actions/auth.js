import * as actionTypes from './authActionTypes';
import { auth, firestore } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const onLoginSuccess = (data) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    data
  };
};

const onLogOut = () => {
  return {
    type: actionTypes.LOGOUT
  };
};

const onRegister = () => {
  return {
    type: actionTypes.SIGNUP
  };
};


export const login = (login, callback) => async (dispatch) => {
  //call api and dispatch action case
  try {
    const response = await signInWithEmailAndPassword(auth, login.user, login.password);
    const { uid } = response.user;
    console.log(response);
    const usersRef = doc(firestore, 'users', uid);
    const firestoreDocument = await getDoc(usersRef);

    if (!firestoreDocument.exists) {
      alert('User does not exist anymore.');
    }

    onSnapshot(usersRef, (querySnapshot) => {
      const userDataNew = querySnapshot.data();
      console.log(userDataNew);

      let data = {
        user: { lang: 'es', ...userDataNew }
      };

      dispatch(onLoginSuccess(data));
      if (typeof callback === 'function') {
        console.log("SETTING CALLBACK TRUE")
        AsyncStorage.setItem('user', JSON.stringify(data.user));
        callback({ success: true });
      }
    });
  } catch (e) {
    callback({ success: false });
    console.log('ERROR: ' + e);
  }
};

export const register = (user, callback) => async (dispatch) => {
  try {
    console.log("values:"+JSON.stringify(user))
    const response = await createUserWithEmailAndPassword(auth, user.email, user.password);
    console.log("response "+response)
    const { uid } = response.user;
    const user_ = {
      id: uid,
      email: user.email,
      fullName: user.firstname + ' ' + user.lastname,
      avatar: '',
      personId: uid
    };
    const person_ = {
      firstname: user.firstname,
      middlename: '',
      lastname: user.lastname,
      surname: '',
      phone: '',
      address: '',
      birthdate: '',
      invitedBy: ''
    };

    const New_ = {
      address: '' ,
      lastname: '',
      birthdate: '',
      code: '',
      code_local: '',
      firstname: '',
      identify: '',
      lastname: '',
      local: '',
      phone: ''
      
    };

    const personRef = doc(firestore, 'persona', uid);
    await setDoc(personRef, person_);
    const usersRef = doc(firestore, 'users', uid);
    await setDoc(usersRef, user_);
    const NewRef = doc(firestore, 'New', uid);
    await setDoc(NewRef, New_);

    dispatch(onRegister(user_));
    if (typeof callback === 'function') {
      callback({ success: true });
    }
  } catch (e) {
    console.log('ERROR: ' + e);
    callback({ success: false });
  }
  
};

export const resetPassword = (email, callback) => async(dispatch) => {
  try {
    await sendPasswordResetEmail(auth, email)
    if (typeof callback === 'function') {
      callback({ success: true });
    } 
    Toast.show({
      type: 'success',
      text1: 'Exito',
      text2: ' Se ha enviado una clave a su correo electronico!'
    });
  } catch (error) {
    callback({ success: false, message: error });
  }
};

export const logout = (callback) => (dispatch) => {
  dispatch(onLogOut());
  if (typeof callback === 'function') {
    AsyncStorage.clear();
    callback({ success: false });
  }
};


