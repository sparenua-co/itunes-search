import { combineReducers } from 'redux';
import searchReducer from '../store/searchReducer';

const rootReducer = combineReducers({
  search: searchReducer,
});

export default rootReducer;
