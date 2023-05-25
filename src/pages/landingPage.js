import React, { useEffect } from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import MainNavbar from '../component/mainNavbar'
import { useDispatch, useSelector } from 'react-redux';
import WorkspaceCombined from '../component/workspaceDatabase/workspaceCombined';
import "./css.css"
import { bulkAdd } from '../store/database/databaseThunk';
import { selectActiveUser } from '../store/user/userSelector';
import { selectOrgandDb } from '../store/database/databaseSelector';
import SingleDatabase from '../component/workspaceDatabase/singleDatabase';

export default function LandingPage() {
   const dispatch = useDispatch();
   const emailId = useSelector((state) => selectActiveUser(state));
   const alldbs = useSelector((state) => selectOrgandDb(state)) || [];
   const dbs = [];
   Object.entries(alldbs).forEach(([, value]) => {
      if (value !== null) {
        const filteredElements = value.filter(element => "deleted" in element);
        dbs.push(...filteredElements);
      }
    });
   
   useEffect(() => {
      if (emailId?.email)
         dispatch(bulkAdd({ email: emailId.email }))
   }, [])
   return (
      <Container maxWidth='true'>

         <Box >

            <Box>
               <MainNavbar />
            </Box>

            <Box>
               <WorkspaceCombined />
            </Box>
               <Box>
               {dbs.length > 0 && (
                  <Typography variant="h5" sx={{ ml: 1, fontWeight: "bold" }}>
                     Deleted DataBase
                  </Typography>
               )}
               <Grid style={{marginLeft:"8px"}} container spacing={2}>
                  {dbs.map((db, index) => (
                     <Box key={db._id} sx={{ m:4, display: "flex" }}>
                     <SingleDatabase db={db} orgId={db.org_id} dblength={dbs?.length} index={index} />
                     </Box>
                  ))}
               </Grid>
               </Box>

         </Box>

      </Container>

   )
}
