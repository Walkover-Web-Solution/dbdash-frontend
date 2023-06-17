import React from 'react';
import './App.scss';
import {Navigate, Route, Routes} from 'react-router-dom';
import Authpage from './pages/authPage';
import LandingPage from './pages/landingPage';
import { AuthContextProvider } from './context/authContext';
import "./pages/css.css"
import DbDetail from './pages/dbDetail';
import ApiDocPage from './pages/apidocPage';
import Protected from './component/protected';
import WithAuth from './component/withAuth';
import Notfoundpage from './component/notFoundPage';
import AuthKeyPage from '../src/pages/authKeyPage/authKeyPage';
import CreateAuth from './pages/createAuth/createAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chat from './component/Chat/Chat';

import ViewTable from './pages/viewTable/viewTable';


  

function App() {
  return (
   <>
   <AuthContextProvider>
   <ToastContainer />
    <Routes>
      <Route exact path ="/" element ={<WithAuth><Authpage/></WithAuth>} />
      <Route exact path ="/dashboard" element ={<Protected><LandingPage/></Protected>} />
      <Route exact path="/notFound" element={<Notfoundpage/>} />
      <Route exact path ="/db/:dbId" element ={<Protected><DbDetail/></Protected>}/>
      <Route exact path ="/db/:dbId/table/:tableName" element ={<Protected><DbDetail/></Protected>}/>
      <Route exact path ="/authkeypage/:id" element ={<Protected><AuthKeyPage/></Protected>}/>
      <Route exact path ="/authKeyCreate/:id" element ={<Protected><CreateAuth/></Protected>}/>
      <Route exact path ="/apiDoc/db/:dbId" element ={<Protected><ApiDocPage /></Protected>}/>
      <Route exact path="*" element={<Navigate to="/notFound" />} />
      <Route exact path ="/db/:dbId/table/:tableName/filter/:filterName" element ={<Protected><DbDetail/></Protected>}/>
      <Route exact path = "/msg91bi" element = {<Chat />} />
      <Route exact path ="/:viewid" element ={<ViewTable/>}/>
    </Routes>

    </AuthContextProvider>


   </>
  );
}

export default App;
