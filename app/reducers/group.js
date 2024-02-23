import * as groupActionType from '../actions/groupActionType';

const initialState = {
  groups: []
};
export default (state = initialState, action) => {
  console.log("reduc grupo:"+JSON.stringify(action))
  switch (action.type) {
    case groupActionType.RETRIEVE_GROUP_SUCCESS:
      return {
        ...state,
        groups: action.data
      };
    case groupActionType.UPDATE_GROUP_SUCCESS:
      return {
        ...state
      };
    default:
      return {
        ...state
      };
  }
};
