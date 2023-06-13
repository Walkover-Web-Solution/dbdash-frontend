import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Button, Modal } from "@mui/material";
import { useSelector } from "react-redux";
import { PropTypes } from "prop-types";
import AuthAccessDropDown from "../../component/authKeyComponents/authAccessDropdown";
import AuthKeyDropdown from "../../component/authKeyComponents/authKeyDropdown/authKeyDropdown";
import AuthKeyPopup from "../../component/authKeyComponents/authKeyPopup";
import { createAuthkey, updateAuthkey } from "../../api/authkeyApi";
import { selectActiveUser } from "../../store/user/userSelector.js";
import { toast } from 'react-toastify';

import "./createAuth.scss";
import { allOrg } from "../../store/database/databaseSelector";

export default function CreateAuthKey(props) {
  const id  = props.id;
  const [selected, setSelected] = useState([]);
  const [scope, setScope] = useState("");
  const [name, setName] = useState("");
  const userDetails = useSelector((state) => selectActiveUser(state));
  const [authKey, setAuthKey] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [options, setOptions] = useState({});
  const [dbId, ] = useState({
    authData:props?.authData,
    title:props?.title
  });
  const user = useSelector((state) => allOrg(state));
  function getCreatedByName (data){
    var array = [];
    Object.entries(Object.values(data.updatedDoc.auth_keys)).map((key) => {
      user.map((user)=>{
        user?.users?.map((id) => {
          if (id?.user_id?._id === key[1].user) {
            array.push(id?.user_id?.first_name + " " + id?.user_id?.last_name);
          }
        });
      })
    });
    props?.setCreatedBy(array);
   }
 
  const isDisabled = !name || !scope || selected.length === 0;
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  const createAuth = async () => {
    const adminId1 = localStorage.getItem("userid");
    const adminId = userDetails?.fullName;
    let data = {
      name: name,
      scope: scope,
      access: selected,
      userId: adminId1,
    };
    if (selected?.length === Object.entries(options)?.length) 
    {
      data.access = "1";
    }
    if (!props?.authData ) {
      const create = await createAuthkey(id, adminId, data);
      setOpen(true);
      setAuthKey(create?.data?.data?.authKey);     
      props?.setAuthKeys(create?.data?.data?.updatedDoc?.auth_keys);
      getCreatedByName(create?.data?.data);
      // props.setAuthkeycreatedorupdated(props.authkeycreatedorupdated+1);  
      return;
    }

    if (
      name === dbId?.authData?.name &&scope === dbId?.authData?.scope && selected.length === Object.keys(dbId?.authData?.access || {}).length) 
    {
      toast.error("Nothing is Change");
      return;
    }
    const authKey = dbId.title;
    const updatedAuthKey = await updateAuthkey(id, adminId1, authKey, data);
    setAuthKey(dbId.title);
    handleOpen();
    props?.setAuthKeys(updatedAuthKey?.data?.data?.auth_keys)
  };
  
useEffect(() => {
  if (dbId && Object.keys(options).length > 0) {
    setName(dbId?.authData?.name);
    if (dbId?.authData?.access && Object.values(dbId.authData.access)[0] === "1") {
      setScope(dbId?.authData.scope);

      let all = [];
      Object.entries(options).map((option) => {
        all = [...all, option[1].tableName];
      });
      setSelected(all);
    } else {
      setScope(dbId?.authData?.access && Object.values(dbId.authData.access)[0]?.scope || "");
      const tableIds = Object.keys(dbId?.authData?.access || "");
      const optionList = Object.entries(options).map(([id, { tableName }]) => ({
        id,
        tableName,
      }));
      const selectedTables = [];
      for (let i = 0; i < optionList.length; i++) {
        const { id, tableName } = optionList[i];
        if (tableIds.includes(id)) {
          selectedTables.push(tableName);
        }
      }
      setSelected(selectedTables);
    }
  }
}, [dbId, options]);

  
  return (
    <>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="create-auth-key-main-container"
        >
          <Box className="create-auth-key-row">
            <Typography className="create-auth-key-label">Name</Typography>
            <TextField
              id="standard-basic"
              label="Standard"
              variant="standard"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
          </Box>
          <Box className="create-auth-key-row">
            <Typography className="create-auth-key-label">Table Access</Typography>
            <Box className="create-auth-key-dropdown">
              <AuthAccessDropDown
              dbIds={dbId}
                selected={selected}
                setSelected={setSelected}
                dbId={props.id}
                options={options}
                setOptions={setOptions}
              />
            </Box>
          </Box>
          <Box className="create-auth-key-row">
            <Typography className="create-auth-key-label">Scope</Typography>
            <Box className="create-auth-key-dropdown">
              <AuthKeyDropdown scope={scope} setScope={setScope} />
            </Box>
          </Box>

          <Box className="create-auth-key-actions">
            <Box>
              <Button
                variant="contained"
                 disabled={isDisabled}
                onClick={() => {
                  createAuth();
                }}
                className="create-auth-key-button mui-button"
              >
                {props?.authData ? "Update" : "Create"}
              </Button>
              <AuthKeyPopup handleClose={props?.handleClose} open={open}  setOpen={setOpen} title={authKey} dbId={props.id} />
            </Box>
            <Box>
              <Button variant="outlined" onClick={props.handleClose} className="mui-button-outlined create-auth-key-button">
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

CreateAuthKey.propTypes = {
  dbId: PropTypes.string,
  open: PropTypes.bool,
  authData: PropTypes.any,
  authkeycreatedorupdated:PropTypes.any,
  setAuthkeycreatedorupdated:PropTypes.any,
  title: PropTypes.any,
  id: PropTypes.any,
  handleClose: PropTypes.func,
  location: PropTypes.any,
  setAuthKeys:PropTypes.any,
  getCreatedByName:PropTypes.func,
  setCreatedBy:PropTypes.any
};