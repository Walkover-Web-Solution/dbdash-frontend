import React from 'react'
import googleIcon from '../../../assets/googleIcon.png'
import { Button } from '@mui/material'
import './googleAuth.css'; // Import the CSS file
import { UserAuth } from '../../../context/authContext';

export default function GoogleAuth() {
  const user = UserAuth();
  const googleSignIn = user?.googleSignIn;

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    await googleSignIn();
  }

  return (
    <Button
      type="outlined"
      variant="outlined"
      className="google-auth-button" // Apply the CSS class to the Button component
      onClick={(e) => { handleGoogleSignIn(e) }}
    >
      <img className="google-auth-icon" src={googleIcon} alt="" /> {/* Apply the CSS class to the img element */}
      <p>Google</p>
    </Button>
  )
}
