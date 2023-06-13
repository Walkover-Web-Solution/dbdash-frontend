import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Button, Modal } from "@mui/material";
import { useSelector } from "react-redux";
import { PropTypes } from "prop-types";
import AuthAccessDropDown from "../../component/authKeyComponents/authAccessDropdown";
import AuthKeyDropdown from "../../component/authKeyComponents/authKeyDropdown/authKeyDropdown";
import AuthKeyPopup from "../../component/authKeyComponents/authKeyPopup";
import { createAuthkey, getAuthkey, updateAuthkey } from "../../api/authkeyApi";
import { selectActiveUser } from "../../store/user/userSelector.js";
import "./createAuth.scss";

export default function CreateAuthKey(props) {
  const id  = props.id;
  let dbId=null;
  if(props.authData && props.title)
  {
   dbId = {
    authData:props?.authData,
    title:props?.title
  };
}

  const [selected, setSelected] = useState([]);
  const [scope, setScope] = useState("");
  const [name, setName] = useState("");
  const userDetails = useSelector((state) => selectActiveUser(state));
  const [authKey, setAuthKey] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [options, setOptions] = useState([]);


  const isDisabled = !name || !scope || selected.length === 0;
  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
  //   }
  // };
  const createAuth = async () => {
    // e.preventDefault();
    const adminId1 = localStorage.getItem("userid");
    const adminId = userDetails?.fullName;
    let data = {
      name: name,
      scope: scope,
      access: selected,
      userId: adminId1,
    };
    if(selected?.length === Object.entries(options)?.length){
      data.access = "1";
    }
    if (!dbId) {    
      const create = await createAuthkey(id, adminId, data);
      setOpen(true);
      setAuthKey(create?.data?.data?.authKey);
      await getAuthkey(id, adminId);
      props.setAuthkeycreatedorupdated(props.authkeycreatedorupdated+1);

      return;
    }
     const authKey = dbId.title
     await updateAuthkey(id,adminId1,authKey,data)
     setAuthKey(dbId.title);
      await getAuthkey(id, adminId);
      props.setAuthkeycreatedorupdated(props.authkeycreatedorupdated+1);


  };

  const updateValueOnEdit = () => {
    if (dbId) {
      setName(dbId?.authData?.name);
      if(Object.values(dbId?.authData?.access)[0] == "1"){
        setScope(Object.values(dbId?.authData)[3]);
        let all = []
        Object.entries(options).map((option) => {
          all = [...all, option[1].tableName]
        })
        setSelected(all);
      }
      else
      {
        setScope(Object.values(dbId?.authData?.access)[0]?.scope);
        const tableIds = Object.keys(dbId?.authData?.access);
        const optionList = Object.entries(options).map(([id, { tableName }]) => ({
          id,
          tableName,
        }));
 
        const selectedTables = optionList
          .filter(({ id }) => tableIds.includes(id))
          .map(({ tableName }) => tableName);
        setSelected(selectedTables);
      }
      }
  };
 
  useEffect(() => {
    if (dbId !== null && options.length > 0) {
      updateValueOnEdit();
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
            />
          </Box>
          <Box className="create-auth-key-row">
            <Typography className="create-auth-key-label">Table Access</Typography>
            <Box className="create-auth-key-dropdown">
              <AuthAccessDropDown
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
                  handleOpen();
                }}
                className="create-auth-key-button mui-button"
              >
                {dbId ? "Update" : "Create"}
              </Button>
              <AuthKeyPopup handleClose={props.handleClose} open={open} state={props.location} setOpen={setOpen} title={authKey} dbId={props.id} />
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
  location: PropTypes.any
};
