import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import PersonReducer from './person';
import GroupReducer from './group';
import MemberReducer from './member';

export default combineReducers({
  auth: AuthReducer,
  application: ApplicationReducer,
  person: PersonReducer,
  groups: GroupReducer,
  members: MemberReducer
});
