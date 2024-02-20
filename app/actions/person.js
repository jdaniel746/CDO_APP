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

const onUpdatePerson = (data) => {
  return {
    type: personActionTypes.UPDATE_PERSON_SUCCESS,
    data
  }
}

const onUpdateProfile = (data) => {
  return {
    type: personActionTypes.UPDATE_PROFILE_SUCCESS,
    data
  }
}

export const updatePerson = (person, callback) => async (dispatch) => {
  try {
    await updatePersonData(person)
    dispatch(onUpdatePerson(person))
    callback({ success: true });
  } catch (e) {
    console.log(e);
    callback({ success: false });
  }
};

export const updateProfile = (person, user, callback) => async (dispatch) => {
  try {
    user.firstname = person.firstname
    user.lastname = person.lastname

    if(person.photo){
      user.avatar = person.photo
      const { data, error } = await supabase.auth.updateUser({
        data:  user
      })
      if(error) throw error
    }

    await updatePersonData(person)
    dispatch(onUpdatePerson({person: person, user: user}))
    callback({ success: true });
  } catch (e) {
    console.log(e);
    callback({ success: false });
  }
}

const updatePersonData = async (person) => {
  const { data, error } = await supabase.from('person').update(person).eq('id', person.id)

  if (error) throw error
}

export const fetchPerson = (uid, callback) => async (dispatch) => {
  try {
    console.log("uid:"+uid)
    let {data, error} = await supabase.from('person')
      .select('*')
      .eq(typeof(uid) === 'string' ? 'user_id' : 'id', uid)
      .limit(1)
      .single()
    if(error) callback({ success: false, message: 'Error consultando persona' });
    if(data) {
      AsyncStorage.setItem('person', JSON.stringify(data));
      dispatch(onFetchSuccess(data));
      callback({ success: true });
    }
  } catch (e) {
    console.log(e);
    dispatch(onFetchError());
    callback({ success: false });
  }
};
