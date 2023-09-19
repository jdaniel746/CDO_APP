const initialState = null;
import * as personActionType from '../actions/personActionTypes';

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case personActionType.FETCH_PERSON_SUCCESS:
      return {
        ...state,
        person: action.data
      };
    default:
      return {
        ...state
      };
  }
};
