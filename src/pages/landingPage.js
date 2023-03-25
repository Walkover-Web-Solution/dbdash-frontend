import React, { useEffect } from 'react'
import { Box, Container} from '@mui/material'
import MainNavbar from '../component/mainNavbar'
import { useDispatch, useSelector } from 'react-redux';
import WorkspaceCombined from '../component/workspaceDatabase/workspaceCombined';
import "./css.css"
// import { UserAuth } from "../context/authContext.js"
import { bulkAdd } from '../store/database/databaseThunk';
import { selectActiveUser } from '../store/user/userSelector';

export default function LandingPage() {
   // const {user} = UserAuth();
   const dispatch = useDispatch();
  const emailId=useSelector((state)=>selectActiveUser(state));

   useEffect(()=>{
      if(emailId?.email)
      dispatch(bulkAdd({email:emailId.email}))
   },[])
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
