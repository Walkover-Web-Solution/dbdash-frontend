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
  const dbId = null;

  const [selected, setSelected] = useState([]);
  const [scope, setScope] = useState("");
  const [name, setName] = useState("");
  const userDetails = useSelector((state) => selectActiveUser(state));
  const [authKey, setAuthKey] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions ] = useState([])
  const handleOpen = () => setOpen(true)
  const isDisabled = !name || !scope || selected.length === 0;

  const createAuth = async () => {
    const adminId1 = localStorage.getItem("userid");
    const adminId = userDetails?.fullName;
    let data = {
      name: name,
      scope: scope,
      access: selected,
      userId: adminId1,
    };

    if (selected?.length === Object.entries(options)?.length) {
      data.access = "1";
    }

    if (!dbId) {
      const create = await createAuthkey(props.id, adminId, data);
      setOpen(true);
      setAuthKey(create?.data?.data?.authKey);
      await getAuthkey(props.id, adminId);
      return;
    }

    const authKey = dbId.title;
    await updateAuthkey(props.id, adminId1, authKey, data);
    setAuthKey(dbId.title);
    await getAuthkey(props.id, adminId);
  };

  const updateValueOnEdit = () => {
    if (dbId) {
      setName(dbId?.authData?.name);
      if (Object.values(dbId?.authData?.access)[0] === "1") {
        setScope(Object.values(dbId?.authData)[3]);
        let all = [];
        Object.entries(options).map((option) => {
          all = [...all, option[1]?.tableName];
        });
        setSelected(all);
      } else {
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

  const handleClose = () => {
    
    props.handleClose(); // Call the handleClose function from props to close the modal
  };
  useEffect(() => {
    updateValueOnEdit();
  }, [dbId, options]);

  return (
    <>
     {console.log("inter",props   )}
     <Modal open={props.open} onClose={handleClose}>
      
        <Box className="create-auth-key-content-container">
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
              <AuthKeyPopup  handleClose={props.handleClose} open={open} state={props.location} setOpen={setOpen} title={authKey} dbId={props.id} />
            </Box>
            <Box>
                <Button variant="outlined" onClick={handleClose} className=" mui-button-outlined create-auth-key-button">
                  Cancel
                </Button>
            </Box>
          </Box>
          </Modal>
    </>
  );
}

CreateAuthKey.propTypes = {
  dbId: PropTypes.string,
  open:PropTypes.any,
  id:PropTypes.any,
  handleClose:PropTypes.any,
  location:PropTypes.any
};
