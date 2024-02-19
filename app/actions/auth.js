import * as actionTypes from './authActionTypes';
import { auth, firestore } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import supabase from "../config/supabase";
import { useEffect } from "react";

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
  try {
    const {user, session, error} = await supabase.auth.signInWithPassword({
      email: login.user,
      password: login.password
    })

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("ONAUTH")
      console.log(event)
      console.log("----------")
      console.log( session)
      if(session) {
        let data = {
          user: {
            lang: 'es',
            email: login.user,
            id: session.user.id,
            firstname: session.user.user_metadata.firstname,
            lastname: session.user.user_metadata.lastname
          }
        };
        //AsyncStorage.setItem('user', JSON.stringify(session.user));
        AsyncStorage.setItem('token', JSON.stringify(session.access_token));
        dispatch(onLoginSuccess(data));
        callback({ success: true });
      } else {
        if(event === 'INITIAL_SESSION'){
          callback({ success: false, message: 'Debe activar su cuenta enviada a su email!' });
        } else if(event === 'SIGNED_OUT') {
          callback({ success: false, message: 'usuario o password invalidos!' });
        }
      }
    })

  } catch (e) {
    callback({ success: false });
    console.log('ERROR: ' + e);
  }
};

export const register = (user, callback) => async (dispatch) => {
  try {
    console.log("values:"+JSON.stringify(user))
    let { data: userAuth, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          active: true,
          role_id: 1
        }
      }
    })
    console.log("register user "+ JSON.stringify(userAuth))
    console.log("register user Error "+JSON.stringify(error))

    dispatch(onRegister(userAuth));
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
  supabase.auth.signOut()
  dispatch(onLogOut());
  if (typeof callback === 'function') {
    AsyncStorage.clear();
    callback({ success: false });
  }
};


