import {combineReducers} from 'redux';
import tableReducer from './table/tableSlice';
import userReducer from './user/userSlice.js';


const rootReducer = combineReducers({
    table:tableReducer,
    user:userReducer
});

export default rootReducer; 

