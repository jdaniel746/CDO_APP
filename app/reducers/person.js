const initialState = null;
import * as personActionType from '../actions/personActionTypes';

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case personActionType.FETCH_PERSON_SUCCESS:
      return {
        ...state,
        person: action.data
      };
    case personActionType.UPDATE_PERSON_SUCCESS:
      return {
        ...state,
        person: action.data.person,
        user: action.data.user?? state.user
      }
    default:
      return {
        ...state
      };
  }
};
