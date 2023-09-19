import { firestore } from '../config/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as personActionTypes from './personActionTypes';

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
    const docRef = doc(firestore, 'persona', uid);
    onSnapshot(docRef, (querySnapshot) => {
      const data = querySnapshot.data();
      dispatch(onFetchSuccess(data));
      if (typeof callback === 'function') {
        AsyncStorage.setItem('person', JSON.stringify(data));
        callback({ success: true });
      }
    });
  } catch (e) {
    console.log(e);
    dispatch(onFetchError());
    callback({ success: false });
  }
};
