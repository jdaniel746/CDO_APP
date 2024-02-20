import * as actionTypes from './authActionTypes';
import { auth } from '../config/firebase';
import {sendPasswordResetEmail } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import supabase from "../config/supabase";

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

    console.log("ON LOGIN"+JSON.stringify(user)+'--'+JSON.stringify(session)+'--'+JSON.stringify(error))

    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("ONAUTH")
      console.log(event)
      console.log("----------")
      console.log(session)
      switch (event) {
        case 'USER_UPDATED':
          if (session) {
            let data = {
              user: {
                lang: session.user.user_metadata.lang ?? 'es',
                email: session.user.email,
                id: session.user.id,
                firstname: session.user.user_metadata.firstname,
                lastname: session.user.user_metadata.lastname,
                avatar: session.user.user_metadata.avatar,
                role_id: session.user.user_metadata.role_id,
                active: session.user.user_metadata.active
              }
            };
            AsyncStorage.setItem('token', JSON.stringify(session.access_token));
            dispatch(onLoginSuccess(data));
          }
          break;
        case 'INITIAL_SESSION':
          if (session) {
            const { data, error } = await supabase.from('person').select('id').eq('user_id', session.user.id).single()
            let sessionData = {
              user: {
                lang: session.user.user_metadata.lang ?? 'es',
                email: session.user.email,
                id: session.user.id,
                firstname: session.user.user_metadata.firstname,
                lastname: session.user.user_metadata.lastname,
                avatar: session.user.user_metadata.avatar,
                role_id: session.user.user_metadata.role_id,
                active: session.user.user_metadata.active,
                person_id: data.id
              }
            };
            AsyncStorage.setItem('token', JSON.stringify(session.access_token));
            dispatch(onLoginSuccess(sessionData));
            callback({ success: true });
          } else {
            callback({ success: false, message: 'Debe activar su cuenta enviada a su email!' });
          }
          break;
        case 'SIGNED_OUT':
          console.log("SIGNED OUT")
          break;
        default:
          callback({ success: false, message: 'usuario o password invalidos!' });
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
          role_id: 1,
          lang: 'es'
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


