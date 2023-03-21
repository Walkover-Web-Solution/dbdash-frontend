import {combineReducers} from 'redux';
import tableReducer from './table/tableSlice';
import userReducer from './user/userSlice.js';
import dataBaseReducer from './database/databaseSlice.js'

import  allTableReducer  from './allTable/allTableSlice';

const rootReducer = combineReducers({
    table:tableReducer,
    user:userReducer,
    dataBase:dataBaseReducer,
    tables:allTableReducer
});

export default rootReducer; 

