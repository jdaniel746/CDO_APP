import * as actionTypes from '../actions/actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
const user = AsyncStorage.getItem('user');
const initialState = user ? { isLoggedIn: true, user: user } : { isLoggedIn: false, user: null };

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      console.log("reducer:" + JSON.stringify(action.data))
      return {
        ...state,
        isLoggedIn: true,
        user: action.data.user
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };
    case actionTypes.SIGNUP:
      return {
        ...state
      };
    case actionTypes.RESET_PASSWORD:
      return {
        ...state
      }
    default:
      return state;
  }
};
