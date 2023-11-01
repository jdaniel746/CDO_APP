import * as actionTypes from './authActionTypes';
import { auth, firestore } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const onResetPassword = (data) => {
  return {
    type: actionTypes.RESET_PASSWORD,
    data
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
    const response = await createUserWithEmailAndPassword(auth, user.email, user.password);
    const { uid } = response.user;
    const user_ = {
      id: uid,
      email: user.email,
      fullName: user.firstname + ' ' + user.lastname,
      avatar: 'https://firebasestorage.googleapis.com/v0/b/cdo-app-39c97.appspot.com/o/avatar%2FbmDbb48uYjVP1ilcKk7vYj0Fsmw1%2Fuser.png?alt=media&token=fe38c769-fbc9-4eff-bc73-b48c06271332&_gl=1*1gkku91*_ga*MTA5OTc3Mjg0NC4xNjUzNjAwMzU4*_ga_CW55HF8NVT*MTY5ODg3Njk0OS44Ny4xLjE2OTg4Nzc3NTUuNTIuMC4w',
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
    const personRef = doc(firestore, 'persona', uid);
    await setDoc(personRef, person_);
    const usersRef = doc(firestore, 'users', uid);
    await setDoc(usersRef, user_);

    dispatch(onRegister(user_));
    if (typeof callback === 'function') {
      callback({ success: true });
    }
  } catch (e) {
    console.log('ERROR: ' + e);
    callback({ success: false });
  }
};

export const resetPassword = (email, callback) => (dispatch) => {
  dispatch(onResetPassword());
  if (typeof callback === 'function') {
    callback({ success: true });
  }
};

export const logout = (callback) => (dispatch) => {
  dispatch(onLogOut());
  if (typeof callback === 'function') {
    AsyncStorage.clear();
    callback({ success: false });
  }
};
