import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Modal,
  
 
} from "@mui/material";
import { useSelector } from "react-redux";
import { PropTypes } from "prop-types";

import AuthKeyPopup from "../../component/authKeyComponents/authKeyPopup/authKeyPopup.js"
import { createAuthkey, updateAuthkey } from "../../api/authkeyApi";
import { selectActiveUser } from "../../store/user/userSelector.js";
// import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';


import "./createAuth.scss";
import { allOrg } from "../../store/database/databaseSelector";
import Selectaccessandscope from "./Selectaccessandscope";
import { toast } from "react-toastify";

export default function CreateAuthKey(props) {
  const id = props.id;
  const [scope, setScope] = useState({});
  const [name, setName] = useState("");
  const userDetails = useSelector((state) => selectActiveUser(state));
  const [authKey, setAuthKey] = useState("");
  const [open, setOpen] = useState(false);
  const EditAuthKeyData =  props?.authData && props?.title  ? {     authData: props?.authData,   title: props?.title, } : undefined;
 const disabled=useMemo(()=>{
  return !name ;
 },[name])

  const user = useSelector((state) => allOrg(state));
  function getCreatedByName(data) {
    var array = [];
    Object.entries(Object.values(data.updatedDoc.auth_keys)).map((key) => {
      user.map((user) => {
        user?.users?.map((id) => {
          if (id?.user_id?._id === key[1].user) {
            array.push(id?.user_id?.first_name + " " + id?.user_id?.last_name);
          }
        });
      });
    });
    props?.setCreatedBy(array);
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter"  ) {
      event.preventDefault();

      createAuth();
    }
  };
  const createAuth = async () => {
    const admin_id = localStorage.getItem("userid");
    const admin_name = userDetails?.fullName;
    if(!name || name=='')
    {
      toast.warning("Please provide a name.")
      return;
    }
    let data = {
      name: name,
      userId: admin_id,
    };
    let jsontosend={};

    
    if(scope["schema"] && scope["schema"]!='')
    {
      data.access='11';
      data.scope=scope["schema"];
    }
   else if(scope["alltables"] && scope["alltables"]!='')
    {
      data.access='1';
      data.scope=scope["alltables"];
    }
    else {
      Object.entries(scope).map(([key,value])=>{
        if(key!='schema' && key!='alltables' && (value!=''))
        {
          jsontosend[key]={scope:value};
        }
        data.access=jsontosend;
      })
    }
    if(!data.access || Object.keys(data?.access)?.length==0){ 
      toast.warning('It is required to make atleast one table accessable.')
      return;
    }
    if (!props?.authData) {
      const create = await createAuthkey(id, admin_name, data);
      setOpen(true);
      setAuthKey(create?.data?.data?.authKey);
      props?.setAuthKeys(create?.data?.data?.updatedDoc?.auth_keys);
      getCreatedByName(create?.data?.data);
      return;
    }

    const authKey = EditAuthKeyData?.title;
    const updatedAuthKey = await updateAuthkey(id, admin_id, authKey, data);
    setAuthKey(EditAuthKeyData?.title);
    setOpen(true);

    props?.setAuthKeys(updatedAuthKey?.data?.data?.auth_keys);
  };
  useEffect(() => {
    setDataforEdit(EditAuthKeyData);
  }, []);

  const setDataforEdit=(authkeydata)=>{
    if (!authkeydata) return;
    setName(authkeydata?.authData?.name);
    if (!authkeydata?.authData?.access) return;
    let obj={};
      if (authkeydata?.authData?.access == "1") {
        obj['alltables']=authkeydata?.authData?.scope;
      }
      else if(authkeydata?.authData?.access == "11"){
        obj['schema']=authkeydata?.authData?.scope;
      }
     else {Object.entries(authkeydata?.authData?.access).map(([key, value]) => {
        obj[key]=value.scope;
      });
    }
    setScope(obj);

  }

  return (
    <>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box
          className="create-auth-key-main-container"
          sx={{p:0,width:'35vw'}}
        >
            <div className="popupheader"  style={{marginBottom:'5%'}}>    <Typography sx={{ml:2}}id="title" variant="h6" component="h2">
            {props?.heading}
          </Typography><CloseIcon sx={{'&:hover': { cursor: 'pointer' }}} onClick={props?.handleClose}/></div>

          <Box className="create-auth-key-row" sx={{ml:2,pr:1}}>
            <Typography className="create-auth-key-label">Name</Typography>
            <TextField
              id="standard-basic"
              label="Name"
              variant="standard"
              value={name}
              sx={{width:'300px'}}
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
          </Box>
          <Selectaccessandscope scope={scope} setScope={setScope} alltabledata={props?.alltabledata}/>
          <Box sx={{ display: "flex", m:2,justifyContent: "space-between" }}>
            <Box>
              <Button
                variant="contained"
                onClick={() => {
                  createAuth();
                }}
                disabled={disabled}
                className={`create-auth-key-button ${disabled?'mui-button-disabled':'mui-button'}`}
              >
                {props?.authData ? "Update" : "Create"}
              </Button>
              <AuthKeyPopup
                handleClose={props?.handleClose}
                open={open}
                setOpen={setOpen}
                title={authKey}
                EditAuthKeyData={props.id}
              />
            </Box>
            <Box>
              
            </Box>
            </Box>

        </Box>
      </Modal>
    </>
  );
}

CreateAuthKey.propTypes = {
  EditAuthKeyData: PropTypes.string,
  open: PropTypes.bool,
  authData: PropTypes.any,
  heading:PropTypes.any,
  title: PropTypes.any,
  id: PropTypes.any,
  alltabledata: PropTypes.any,

  handleClose: PropTypes.func,
  setAuthKeys: PropTypes.any,
  getCreatedByName: PropTypes.func,
  setCreatedBy: PropTypes.any,
};
