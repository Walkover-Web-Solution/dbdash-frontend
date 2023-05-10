import React, { useEffect, useState } from "react";
import Dropdown from "../dropdown";
import PopupModal from "../popupModal";
import SingleDatabase from "./singleDatabase";
import Grid from "@mui/material/Grid";
import { Box, Card, Typography, TextField, Button, IconButton, ClickAwayListener } from "@mui/material";
import ControlPointSharpIcon from '@mui/icons-material/AddSharp';
import PropTypes from "prop-types";
import { createDbThunk, deleteOrgThunk, removeUserInOrgThunk, renameOrgThunk, shareUserInOrgThunk } from "../../store/database/databaseThunk";
import { useDispatch, useSelector } from "react-redux";
import ShareOrgModal from "./shareOrgModal";
import { allOrg } from "../../store/database/databaseSelector";
import { toast } from "react-toastify";

export const OrgList = (props) => {

  const handleOpen = () => setOpen(true);
  const dispatch = useDispatch()
  const allorgss = useSelector((state) => allOrg(state)) 
  const [name, setName] = useState(false); // [show textfield and setshowtextfield]
  const [orgUsers, setOrgUsers] = useState([])
  const [orgName, setOrgName] = useState();
  const [db, setDb] = useState(false);
  const [open, setOpen] = useState(false); //popup model craeate db 
  const [shareOrg, setShareOrg] = useState(false); // shred org model open closse 
  const [orgId, setOrg] = useState();
  const[,setOpenmove]=useState(false);
  const [tabIndex, setTabIndex] = useState(0);


  //shared model whaha hoga
  const [isAdmin, setIsAdmin] = useState(false);
 
  // const schema = Joi.object({
  //   orgName: Joi.string()
  //     .min(3)
  //     .max(15)
  //     .pattern(/^\S+$/)
  //     .messages({
  //       'string.pattern.base': 'Field name should not contain spaces',
  //     })
  //     .required(),
  // });
  
  // const handleTextChange = (e) => {
  //   const { error } = schema.validate({ orgName: e.target.value });
  //   if (error) {
  //     setErrors({ orgName: error.details[0].message });
  //   } else {
  //     setErrors({});
  //   }
  //   setOrgName(e.target.value);
  // };


  const handleOpenShareOrg = () => {
    setShareOrg(true);
  };
  useEffect(() => {
    const obj = allorgss.find(org => org._id === props?.orgId);
    setOrgUsers(obj)
    const userId = localStorage.getItem("userid")
    if (obj?.users) {
      Object.entries(obj?.users).map((user) => {
        if (user[1].user_id._id == userId && user[1].user_type == "admin") {
          setIsAdmin(true);
        }
      });
    }
  }, [allorgss])
  const saveDb = async () => {
    const userId = localStorage.getItem("userid");
    const data = {
      user_id: userId,
      name: db,
    };
    setOpen(false);
    dispatch(createDbThunk({ orgId, data })).then(()=>{
      toast.success('Database created successfully!');
    });
  };
  const renameWorkspace = async (orgId) => {
    const userid = localStorage.getItem("userid");
    const data = {
      name: orgName || name,
    };
    dispatch(renameOrgThunk({ orgId, data, userid }))
  };
  const deleteOrganization = async () => {
    const userid = localStorage.getItem("userid");
    dispatch(deleteOrgThunk({ orgId: props?.orgId, userid }))
  };
  const shareWorkspace = async (email) => {
    const adminId = localStorage.getItem("userid")
    dispatch(shareUserInOrgThunk({ orgId: props?.orgId, adminId: adminId, email: email }))
  }
  const removeUserFromWorkspace = async (email) => {
    const adminId = localStorage.getItem("userid")
    dispatch(removeUserInOrgThunk({ orgId: props?.orgId, adminId: adminId, email: email }))
  }
  return (
    <>
      <Box key={props?.orgId} sx={{ m: 3 }}>
        <ClickAwayListener onClickAway={() => { setName(false) }} >
          <Box sx={{ my: 7, display: "flex" }}>
           
            {name && props?.tabIndex==props?.index ? (
              <>
              <Box sx={{display:'flex', flexDirection:'column'}}>
              <Box>
                <TextField
                id="orgName"
                name="orgName"
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
                  onChange={(e) => {setOrgName(e.target.value)}}
                  size="small"
                />
                </Box>

                <Box>
                {/* {errors.orgName && (
                    <Typography variant="body2" color="error" fontSize={12}>
                      {errors.orgName}
                    </Typography>)} */}
                </Box>
                </Box>

                <Button onClick={() => { renameWorkspace(props?.orgId);  setName(false); }}
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
                {isAdmin && <Box sx={{ mt: -1 }}>
                  <Dropdown
                  setTabIndex={props?.setTabIndex}
                  tabIndex={props?.index}
                  setOpenmove={setOpenmove}
                    first={"Rename workspace"}
                    second={"Delete workspace"}
                    setName={setName}
                    idToDelete={props?.orgId}
                    deleteFunction={deleteOrganization}
                    title="Organization"
                  />
                </Box>}
              </>
            )}
            {isAdmin && <Box>
              <Box sx={{ right: "10px", display: "flex" }}>
                <Button
                  variant="contained" size="small" color="success" sx={{ display: "flex" }} onClick={handleOpenShareOrg}>
                  Share
                </Button>
              </Box>
              <ShareOrgModal
                shareOrg={shareOrg} org={orgUsers} setShareOrg={setShareOrg} shareWorkspace={shareWorkspace}
                removeUserFromWorkspace={removeUserFromWorkspace} />
            </Box>
            }
          </Box>
        </ClickAwayListener>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: "flex" }}>
            <Grid container spacing={2}>
              {props.dbs.map((db,index) => (
                <Box key={db._id} sx={{ m: 4, display: "flex" }}>
                  <SingleDatabase db={db} dblength={props?.dbs?.length} getOrgAndDbs={props?.getOrgAndDbs} tabIndex={tabIndex} setTabIndex={setTabIndex} index={index} />
                </Box>
              ))}
              <Card sx={{ m: 4, minWidth: 250, minHeight: 200, boxShadow: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>

                <IconButton sx={{ color: "black" }}
                  onClick={(e) => {
                    handleOpen(e);
                    setOrg(props?.orgId);
                  }}
                >
                  < ControlPointSharpIcon cursor="pointer" sx={{ fontSize: "50px" }} />
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
  dbs: PropTypes.any,
  orgId: PropTypes.string,
  getOrgAndDbs: PropTypes.func,
  tabIndex:PropTypes.number,
  setTabIndex:PropTypes.func,
  index:PropTypes.number
};