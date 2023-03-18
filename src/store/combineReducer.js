import {combineReducers} from 'redux';
import tableReducer from './table/tableSlice';
import userReducer from './user/userSlice.js';
import dataBaseReducer from './database/databaseSlice.js'


const rootReducer = combineReducers({
    table:tableReducer,
    user:userReducer,
    dataBase:dataBaseReducer
});

export default rootReducer; 

