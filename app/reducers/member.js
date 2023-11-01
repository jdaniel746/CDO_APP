const initialState = null;
import * as memberAction from '../actions/members';
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case memberAction.SETTING_MEMBERS:
      return {
        ...state,
        members: action.data
      };
    default:
      return {
        ...state
      };
  }
};
