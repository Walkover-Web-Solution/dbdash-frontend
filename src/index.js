import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
// import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { persistor, store } from './store/index.js';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';


Sentry.init({
  dsn: process.env.REACT_APP_DSN,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
ReactDOM.render(
    <BrowserRouter>
    <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
        <App />
    </PersistGate>
  </Provider>
    </BrowserRouter> 
  ,
 document.getElementById('root')
);

const portalDiv = document.createElement('div');
portalDiv.id = 'portal';
document.body.appendChild(portalDiv);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
