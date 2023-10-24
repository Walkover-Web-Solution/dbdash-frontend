import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../../dropdown";
import PopupModal from "../../popupModal/popupModal";
import SingleDatabase from "../singledatabase/singleDatabase";
import Grid from "@mui/material/Grid";
import { Box, Card, Typography, Button, IconButton, ClickAwayListener } from "@mui/material";
import ControlPointSharpIcon from '@mui/icons-material/AddSharp';
import PropTypes from "prop-types";
import { createDbThunk, removeUserInOrgThunk, renameOrgThunk, shareUserInOrgThunk, updateUserInOrgThunk } from "../../../store/database/databaseThunk";
import { useDispatch } from "react-redux";
import ShareOrgModal from "../shareOrgModal";

import { toast } from "react-toastify";
import { createDb } from "../../../api/dbApi";
import { useNavigate } from "react-router-dom";
import './orgList.scss';
import  { customUseSelector } from "../../../store/customUseSelector";
import CustomTextField from "../../../muiStyles/customTextfield";

export const OrgList = (props) => {

  const [userType, setUserType] = useState("");
  const naviagate = useNavigate();
  const handleOpen = () => setOpen(true);
  const dispatch = useDispatch()
  const allorgss = customUseSelector((state) => state.dataBase.allOrg)
  const [name, setName] = useState(false); // [show textfield and setshowtextfield]
  const [orgUsers, setOrgUsers] = useState([])
  const orgName = useRef(props.dbs[0]?.org_id?.name)
  const [open, setOpen] = useState(false); //popup model craeate db 
  const [shareOrg, setShareOrg] = useState(false); // shred org model open closse 
  const [orgId, setOrg] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  let Dbs = [];
  Object.entries(props?.dbs)?.forEach(([, value]) => {
    if (!value?.[`deleted`]) {
      Dbs.push(value);
    }
  });
  const handleOpenShareOrg = () => {
    setShareOrg(true);
  };
  useEffect(() => {
    const obj = allorgss.find(org => org?._id === props?.orgId);
    setOrgUsers(obj)
    const userId = localStorage.getItem("userid")
    if (obj?.users) {
      Object.entries(obj?.users).map((user) => {
        if (user[1]?.user_id?._id == userId && user[1]?.user_type == 1) {
          setIsOwner(true);
        }
        if (user[1]?.user_id?._id == userId && user[1]?.user_type == 11) {
          setIsAdmin(true);
        }
      });
    }
  }, [allorgss])
  const saveDb = async (dbName) => {
    const userId = localStorage.getItem("userid");  
    const data = {
      user_id: userId,
      name: dbName,
    };
    setOpen(false);
    const createDb1 = await createDb(orgId, data);
    toast.success('Database created successfully!');
    naviagate(`/db/${createDb1?.data?.data?._id}`)
    dispatch(createDbThunk({
      data: createDb1?.data?.data
    })).then(() => {
    });
  };


  const renameWorkspace = async (orgId, orgName) => {
   
    if (! orgName ||  orgName.trim() === "") {
      toast.error("Workspace name cannot be empty");
      return;
    }

    if ( orgName.length < 3) {
      toast.error("Workspace name must be at least 3 characters long");
      return;
    }

    if ( orgName.length > 30) {
      toast.error("Workspace name cannot exceed 30 characters");
      return;
    }

    if ( orgName.includes(" ")) {
      toast.error("Workspace name cannot contain spaces");
      return;
    }
    if(allorgss.some((org)=>org.name == orgName)){
      toast.error("Workspace name already exists");
    }
    const userid = localStorage.getItem("userid");
    const data = {
      name: orgName,
    };

    dispatch(renameOrgThunk({ orgId, data, user_id:userid })).then(()=>{
      toast.success("Workspace renamed successfully");
    });
  };
  const shareWorkspace = async (email, user_type,showSuccess) => {
    const adminId = localStorage.getItem("userid")
    const data = {
      email: email,
      user_type: user_type
    }
    dispatch(shareUserInOrgThunk({ orgId: props?.orgId, adminId: adminId, data: data })).then(()=>{
      showSuccess();  // author : rohitmirchandani, to show message only on success
    })
  }
  const removeUserFromWorkspace = async (email) => {
    const adminId = localStorage.getItem("userid")
    const data={
      email:email
    }
    dispatch(removeUserInOrgThunk({ orgId: props?.orgId, adminId: adminId,data}))
  }
  const updateUserTypeInOrg = async (email, user_type) => {
    const adminId = localStorage.getItem("userid")
    let obj = { ...orgUsers };
    let originalObj={...orgUsers};
    obj.users = obj.users?.map((user) => {
      if (user?.user_id.email === email) {
        return { ...user, user_type: user_type };
      }
      return user;
    });
  setOrgUsers(obj);
  const data = {
    email: email,
    user_type: user_type
  }

    dispatch(updateUserInOrgThunk({ orgId: props?.orgId, adminId: adminId, data })).then(e=>{
      if(e.type.includes('rejected'))
      {
setOrgUsers(originalObj);
      }
    });
  }


  return (
    <>
      <Box key={props?.orgId}  className="orglistbox1" >
        <ClickAwayListener onClickAway={() => { setName(false) }} >
          <Box className="orglistbox2">
            {name && props?.tabIndex === props?.index ? (
              <>
                <Box  className="orglistbox3">
                  <Box>
                    <CustomTextField
                      id="orgName"
                      name="orgName"
                      autoFocus
                      className="orglisttextfield1"
                      defaultValue={props.dbs[0]?.org_id?.name}
                      // value={orgName}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          renameWorkspace(props?.orgId,orgName?.current);
                          setName(false);
                        }
                      }}
                      onChange={(e) => { orgName.current=(e.target.value) }}
                      size="small"
                    />
                  </Box>
                </Box>
                <Button
                  onClick={() => { renameWorkspace(props?.orgId,  orgName?.current); setName(false); }}
                  variant="contained"
                  className="mui-button orgrenamebutton"
                 
                >
                  Rename
                </Button>
              </>
            ) : (
              <>
                <Typography className="titleweight" >
                  {props.dbs[0]?.org_id?.name}{" "}
                </Typography>
                {isOwner || isAdmin ? (
                  <>
                    <Box >
                      <Dropdown
                        setTabIndex={props?.setTabIndex}
                        tabIndex={props?.index}
                        first={"Rename workspace"}
                        setName={setName}
                        title="Organization"
                      />
                    </Box>
                    <Box>
                      <Box  className="orglistsharebuttonbox" >
                        <Button
                          variant="outlined"
                          className="mui-button-outlined orglistsharebutton"
                          size="small"
                          color="success"
                          onClick={handleOpenShareOrg}
                        >
                          Share
                        </Button>
                      </Box>
                      <ShareOrgModal
                        userType={userType}
                        setUserType={setUserType}
                        shareOrg={shareOrg}
                        title={'Add User to Organization'}
                        org={orgUsers}
                        setOrg={setOrgUsers}
                        setShareOrg={setShareOrg}
                        shareWorkspace={shareWorkspace}
                        removeUserFromWorkspace={removeUserFromWorkspace}
                        updateUserTypeInOrg={updateUserTypeInOrg}
                      />
                    </Box>
                  </>
                ) : null}
              </>
            )}
          </Box>
        </ClickAwayListener>
        <Box className="displayflex">
          <Box  className="displayflex">
            <Grid container spacing={2}>
              {orgUsers && Dbs.map((db, index) => (
                <Box key={db?._id} className="singledatabasebox displayflex" >
                  <SingleDatabase db={db} dblength={Dbs.length} getOrgAndDbs={props?.getOrgAndDbs} tabIndex={tabIndex} setTabIndex={setTabIndex} index={index} />
                </Box>
              ))}
              <Card className="cardinorglist singledatabasebox displayflex" >

                <IconButton 
                  onClick={(e) => {
                    if(isAdmin || isOwner){
                      handleOpen(e);
                      setOrg(props?.orgId);
                    }else{
                        toast.warn("You are not authorized to create database");
                    }
                  }}
                  
                >
                  < ControlPointSharpIcon className="icononcard" cursor="pointer"  />
                </IconButton>
              </Card>
            </Grid>
            <PopupModal
              open={open}
              setOpen={setOpen}
              title="create database"
              label="Database Name"
              submitData={saveDb}
              joiMessage={"Database name"}
              templateoption={true}
            >
            </PopupModal>

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
  tabIndex: PropTypes.number,
  setTabIndex: PropTypes.func,
  index: PropTypes.number
};