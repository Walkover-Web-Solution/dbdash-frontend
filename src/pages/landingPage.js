import React, { useEffect } from 'react'
import { Box, Container} from '@mui/material'
import MainNavbar from '../component/mainNavbar'
import { useDispatch } from 'react-redux';
import WorkspaceCombined from '../component/workspaceDatabase/workspaceCombined';
import "./css.css"
import { UserAuth } from "../context/authContext.js"
import { bulkAdd } from '../store/database/databaseThunk';

export default function LandingPage() {
   const {user} = UserAuth();
   const dispatch = useDispatch();
   useEffect(()=>{
      if(user?.email)
     {
       dispatch(bulkAdd({email:user?.email}))
      }
   },[user])
  return (
    <Container maxWidth='true'>

    <Box >

       <Box>
          <MainNavbar/>
       </Box>

       <Box>
            <WorkspaceCombined/>
       </Box>

    </Box>

    </Container>
  
    )
}
