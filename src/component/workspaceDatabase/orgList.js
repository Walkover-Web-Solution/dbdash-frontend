import React, { useState } from "react";
import Dropdown from "../dropdown";
import PopupModal from "../popupModal";
import SingleDatabase from "./singleDatabase";
import Grid from "@mui/material/Grid";
import { Box,Card, Typography, TextField, Button, IconButton} from "@mui/material";
import ControlPointSharpIcon  from '@mui/icons-material/AddSharp';
import { createDb } from "../../api/dbApi";
import { updateOrg, deleteOrg } from "../../api/orgApi";
import PropTypes from "prop-types";



export const OrgList = (props) => {
  const [name, setName] = useState(false);
  const [orgName, setOrgName] = useState();
  const [db, setDb] = useState(false);
  const [open, setOpen] = useState(false);
  const [orgId, setOrg] = useState();
  const handleOpen = () => setOpen(true);

  const saveDb = async () => {
    // e.preventDefault();
    const userId = localStorage.getItem("userid");
    const data = {
      user_id: userId,
      name: db,
    };
    setOpen(false);
    await createDb(orgId, data);
    await props?.getOrgAndDbs();
  };

  const renameWorkspace = async (orgId) => {
    const userid = localStorage.getItem("userid");
    const data = {
      name: orgName,
    };
    await updateOrg(orgId, data,userid);
    await props?.getOrgAndDbs();
  };

  const deleteOrganization = async () => {
      
    const userid = localStorage.getItem("userid");

    await deleteOrg(props?.orgId,userid);
    await props?.getOrgAndDbs();
  };

  return (
    <>
      <Box key={props?.orgId} sx={{ m: 3 }}>
        <Box sx={{ my: 7, display: "flex" }}>
          {name ? (
            <>
              <TextField 
                autoFocus
                sx={{ width: 120, fontWeight: "bold" }}
                defaultValue={props.dbs[0]?.org_id?.name}
                value={orgName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    renameWorkspace(props?.orgId);
                    setName(false);
                  }
                }}
                onChange={(e) => setOrgName(e.target.value)}
                size="small"
              />

              <Button onClick={() => { setName(false); renameWorkspace(props?.orgId); }}
                variant="contained"
                sx={{
                  width: "8rem",
                  backgroundColor: "#1C2833",
                  fontSize: "12px",
                  mx: 3,
                  ":hover": {
                    bgcolor: "#273746",
                    color: "white",
                    border: 0,
                    borderColor: "#1C2833",
                  },
                }}
              >
                Rename
              </Button>
            </>
          ) : (
            <>
              <Typography sx={{ fontWeight: "bold" }}>
                {props.dbs[0]?.org_id?.name}{" "}
              </Typography>

              <Box sx={{ mt: -1 }}>
                <Dropdown
                  first={"Rename workspace"}
                  second={"Delete workspace"}
                  setName={setName}
                  idToDelete={props?.orgId}
                  deleteFunction={deleteOrganization}
                  title= "Organization"
                />
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: "flex" }}>
            <Grid container spacing={2}>
              {props.dbs.map((db) => (
                <Box key={db._id} sx={{ m: 4, display: "flex" }}>
                  <SingleDatabase db={db} getOrgAndDbs={props?.getOrgAndDbs} />
                </Box>
              ))}

            {/* <Curl dbs={props?.dbs}/> */}
             

              <Card sx={{m: 4, minWidth: 250, minHeight: 200, boxShadow: 2 ,display: "flex" ,alignItems:"center",justifyContent:"center" }}>
               
                  {/* <Button 
                    onClick={(e) => {
                      handleOpen(e);
                      setOrg(props?.orgId);
                    }}
                    variant="contained" >
                    Create Db
                  </Button> */}

                <IconButton sx={{color: "black"}}
                onClick={(e) => {
                    handleOpen(e);
                    setOrg(props?.orgId);
                  }} 
                >
                    < ControlPointSharpIcon  cursor="pointer" sx={{ fontSize: "50px" }} />
                </IconButton>
                
              </Card>
            </Grid>
            <PopupModal
              open={open}
              setOpen={setOpen}
              title="create Database"
              label="Database Name"
              submitData={saveDb}
              setVariable={setDb}
            />
          </Box>
          
        </Box>
      </Box>
    
    </>
  );
};
OrgList.propTypes = {
  dbs: PropTypes.array,
  orgId: PropTypes.string,
  getOrgAndDbs: PropTypes.func,
};

