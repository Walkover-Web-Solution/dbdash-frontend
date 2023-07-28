import React from 'react'
import googleIcon from '../../../assets/googleIcon.png'
import { Button } from '@mui/material'
import './googleAuth.scss'; // Import the CSS file
import { UserAuth } from '../../../context/authContext';

export default function GoogleAuth() {
  const user = UserAuth();
  const googleSignIn = user?.googleSignIn;

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    await googleSignIn();
  }

    return (
      <Button className='googleBtn' onClick={(e) => { handleGoogleSignIn(e) }}>
        <img width={"16px"} className='mr-1' src={googleIcon} alt="" />
        <span>Google</span>
      </Button>
    )
}
