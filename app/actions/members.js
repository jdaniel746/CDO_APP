export const SETTING_MEMBERS = 'SETTING_MEMBERS';

export const setSelectedMembers = (members, callback) => async (dispatch) => {
  console.log('action:' + JSON.stringify(members));
  dispatch({ type: SETTING_MEMBERS, data: members });
  if (typeof callback === 'function') {
    callback({ success: true });
  }
};
