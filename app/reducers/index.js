import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import PersonReducer from './person';
import GroupReducer from './group';

export default combineReducers({
  auth: AuthReducer,
  application: ApplicationReducer,
  person: PersonReducer,
  groups: GroupReducer
});
