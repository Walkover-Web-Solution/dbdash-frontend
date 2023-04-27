import React from 'react'
import googleIcon from '../../../assets/googleIcon.png'
import { Button } from '@mui/material'
import {UserAuth} from '../../../context/authContext'
import './googleAuth.css'
export default function GoogleAuth() {

  const user = UserAuth();
  const googleSignIn = user?.googleSignIn;
  
  const handleGoogleSignIn = async (e)=>{
    e.preventDefault();
    await googleSignIn();
  }

  return (
    <Button
    type="outlined" variant="outlined" className="button" 
     onClick={(e)=>{handleGoogleSignIn(e)}}>
        <img  className="img"  src={googleIcon} alt=""/>
        <p>Google</p>
    </Button>
  )
}
