import React, { useEffect } from 'react'
import { Box, Container} from '@mui/material'
import MainNavbar from '../component/mainNavbar/mainNavbar'
import { useDispatch, useSelector } from 'react-redux';
import WorkspaceCombined from '../component/workspaceDatabase/workspaceCombined';
import "./css.css"
import { bulkAdd } from '../store/database/databaseThunk';
import { selectActiveUser } from '../store/user/userSelector';

export default function LandingPage() {
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
