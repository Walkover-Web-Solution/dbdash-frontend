import React, { useEffect } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import MainNavbar from "../component/mainNavbar/mainNavbar";
import { useDispatch } from "react-redux";
import WorkspaceCombined from "../component/workspaceDatabase/workspaceCombined/workspaceCombined";
import "./css.scss";
import { bulkAdd } from "../store/database/databaseThunk";
import SingleDatabase from "../component/workspaceDatabase/singledatabase/singleDatabase";
import variables from "../assets/styling.scss";
import  { customUseSelector } from "../store/customUseSelector";

export default function LandingPage() {
  const dispatch = useDispatch();
  const emailId = customUseSelector((state) => state.user.userEmail);
  const alldbs = customUseSelector((state) => state.dataBase.orgId || []);

  let dbs = [];
  if (alldbs && typeof alldbs === "object") {
    dbs = Object.values(alldbs)
      .flatMap((value) => (Array.isArray(value) ? value : []))
      .filter((element) => element && element.deleted);
  }

  useEffect(() => {
    if (emailId) dispatch(bulkAdd({ email: emailId }));
  }, []);

  return (
    <Container maxWidth="true" className="landingpagemaincontainer">
      <Box>
        <MainNavbar />
      </Box>
      <Box>
        <WorkspaceCombined />
      </Box>
      <Box>
        {dbs?.length > 0 && (
          <Typography
            variant={variables.landingpagetitlevariant}
            fontWeight={variables.titleweight}
            className="deletedbtitle"
          >
            Deleted Databases
          </Typography>
        )}
        <Grid className="landingpagegrid" container spacing={2}>
          {dbs.map((db, index) => (
            <Box key={db._id} className="boxfordeleteddbs">
              <SingleDatabase
                db={db}
                orgId={db.org_id}
                dblength={dbs?.length}
                index={index}
              />
            </Box>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
