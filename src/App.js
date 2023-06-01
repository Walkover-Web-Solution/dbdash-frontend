import React from 'react';
import './App.scss';
import {Navigate, Route, Routes} from 'react-router-dom';
import Authpage from './pages/authPage';
import LandingPage from './pages/landingPage';
import { AuthContextProvider } from './context/authContext';
import "./pages/css.scss"
import DbDetail from './pages/dbDetail';
import ApiDocPage from './pages/apidocPage';
import Protected from './component/protected';
import WithAuth from './component/withAuth';
import Notfoundpage from './component/notFoundPage';
import AuthKeyPage from './pages/authKeyPage';
import CreateAuth from './pages/createAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



  

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

    </Routes>

    </AuthContextProvider>


   </>
  );
}

export default App;
