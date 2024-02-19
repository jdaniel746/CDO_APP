import { firestore } from '../config/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as personActionTypes from './personActionTypes';
import supabase from "../config/supabase";

const onFetchSuccess = (data) => {
  return {
    type: personActionTypes.FETCH_PERSON_SUCCESS,
    data
  };
};

const onFetchError = () => {
  return {
    type: personActionTypes.FETCH_PERSON_ERROR
  };
};

export const updatePerson = (person, callback) => async (dispatch) => {
  try {
    const docRef = doc(firestore, 'persona', person.id);
    updateDoc(docRef, person).then((docRef) => {
      console.log('Value of an Existing Document Field has been updated');
      callback({ success: true });
    });
  } catch (e) {
    console.log(e);
    callback({ success: false });
  }
};

export const fetchPerson = (uid, callback) => async (dispatch) => {
  try {
    console.log("uid:"+uid)
    let {data, error} = await supabase.from('person')
      .select('*')
      .eq(typeof(uid) === 'string' ? 'user_id' : 'id', uid)
      .limit(1)
      .single()
    console.log("DATA:"+JSON.stringify(data)+"--"+JSON.stringify(error))
    if(error) callback({ success: false, message: 'Error consultando persona' });
    if(data) {
      AsyncStorage.setItem('person', JSON.stringify(data));
      dispatch(onFetchSuccess(data));
      callback({ success: true });
    }
   /* const docRef = doc(firestore, 'persona', uid);
    onSnapshot(docRef, (querySnapshot) => {
      const data = querySnapshot.data();
      console.log("PERSONA SUCC:" + JSON.stringify(data))

      if (typeof callback === 'function') {
        if (data) {
          AsyncStorage.setItem('person', JSON.stringify(data));
          dispatch(onFetchSuccess(data));
          callback({ success: true });
        }else {
          callback({ success: false, message: 'Error consultando persona' });
        }

      }
    });*/
  } catch (e) {
    console.log(e);
    dispatch(onFetchError());
    callback({ success: false });
  }
};
