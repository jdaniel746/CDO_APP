import { firestore } from '../config/firebase';
import { setDoc, getDocs, collection, query, where, doc } from 'firebase/firestore';
import * as GroupActionsTypes from './groupActionType';
import supabase from "../config/supabase";

const onRetrieveSuccess = (data) => {
  return {
    type: GroupActionsTypes.RETRIEVE_SUCCESS,
    data
  };
};

const onUpdateSuccess = () => {
  return {
    type: GroupActionsTypes.UPDATE_GROUP_SUCCESS
  };
};

export const retrieveGroupsByUser = (user, callback) => async (dispatch) => {
  try {
    const groups = [];
    const { data, error} = await supabase.from('groups').select('*').contains('leaders', [user])
    console.log("grupos: "+JSON.stringify(data) + "--"+JSON.stringify(error))
  /*  const groupsRef = collection(firestore, 'grupos');
    const q = query(groupsRef, where('red', '==', red));
    const groupsSnap = await getDocs(q);
    groupsSnap.forEach((doc) => {
      groups.push(doc.data());
    });*/

    if (typeof callback === 'function') {
      dispatch(onRetrieveSuccess(data));
      callback({ success: true });
    }
  } catch (e) {
    callback({ success: false });
  }
};

export const updateGroup = (group, callback) => async (dispatch) => {
  try {
    const docRef = doc(firestore, 'grupos', 'grupo1');
    await setDoc(docRef, group);
    if (typeof callback === 'function') {
      dispatch(onUpdateSuccess());
      callback({ success: true });
    }
  } catch (e) {
    callback({ success: false });
  }
};
