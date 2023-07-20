import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// reducer imports
import rootReducer from "./combineReducer.ts";
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25});
const persistConfig = {
  blacklist: ["table"],
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// const composedEnhancer = composeWithDevTools(
//   applyMiddleware(thunkMiddleware),
//   // other store enhancers if any
//   { trace: true, traceLimit: 25}
// );
export const store = createStore(persistedReducer,   composeEnhancers(applyMiddleware(thunkMiddleware)));
export const persistor = persistStore(store);

