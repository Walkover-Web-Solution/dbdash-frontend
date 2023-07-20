import React, { useEffect } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import MainNavbar from '../component/mainNavbar/mainNavbar'
import { useDispatch, useSelector } from 'react-redux';
import WorkspaceCombined from '../component/workspaceDatabase/workspaceCombined/workspaceCombined';
import "./css.scss"
import { bulkAdd } from '../store/database/databaseThunk';
import { selectActiveUser } from '../store/user/userSelector';
import { selectOrgandDb } from '../store/database/databaseSelector';
import SingleDatabase from '../component/workspaceDatabase/singledatabase/singleDatabase';
import variables from '../assets/styling.scss';

export default function LandingPage() {
   const dispatch = useDispatch();
   const emailId = useSelector((state) => selectActiveUser(state));
   const alldbs = useSelector((state) => selectOrgandDb(state)) || [];
   let dbs = [];
   if (alldbs && typeof alldbs === 'object') {
      for (const value of Object.values(alldbs)) {
        if (Array.isArray(value)) {
          const filteredElements = value.filter(element => element && element.deleted);
          dbs.push(...filteredElements);
        }
      }
    }
    
   
   useEffect(() => {
      if (emailId?.email)
         dispatch(bulkAdd({ email: emailId.email }))
   }, [])
   return (
      <Container maxWidth='true' className="landingpagemaincontainer" >
            <Box> <MainNavbar /></Box>
            <Box><WorkspaceCombined /></Box>
            <Box>
               {dbs?.length > 0 && (
                  <Typography variant={variables.landingpagetitlevariant} fontWeight={variables.titleweight} className="deletedbtitle" >
                     Deleted Databases
                  </Typography>
               )}
               <Grid className='landingpagegrid'  container spacing={2}>
                  {dbs.map((db, index) => (
                     <Box key={db._id} className="boxfordeleteddbs">
                     <SingleDatabase db={db} orgId={db.org_id} dblength={dbs?.length} index={index} />
                     </Box>
                  ))}
               </Grid>
            </Box>


      </Container>

   )
}
