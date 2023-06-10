import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Button, Modal } from "@mui/material";
// import { useSelector } from "react-redux";
import { PropTypes } from "prop-types";
import AuthAccessDropDown from "../../component/authKeyComponents/authAccessDropdown";
import AuthKeyDropdown from "../../component/authKeyComponents/authKeyDropdown/authKeyDropdown";
import AuthKeyPopup from "../../component/authKeyComponents/authKeyPopup";
import { createAuthkey, getAuthkey, updateAuthkey } from "../../api/authkeyApi";
// import { selectActiveUser } from "../../store/user/userSelector.js";
import "./createAuth.scss";

export default function CreateAuthKey(props) {
  const dbId = props.dbId;
  console.log("jhdfhjdshhjdbhj",props)

  const [selected, setSelected] = useState([]);
  const [scope, setScope] = useState("");
  const [name, setName] = useState("");
  // const userDetails = useSelector((state) => selectActiveUser(state));
  const [authKey, setAuthKey] = useState(props.title || "");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([])

  const handleOpen = () => {
    setOpen(true);
  }
  
  const isDisabled = !name || !scope || selected.length === 0;

  const createAuth = async () => {
    const adminId1 = localStorage.getItem("userid");
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
      const create = await createAuthkey(props.id, adminId1, data);
      setOpen(true);
      setAuthKey(create?.data?.data?.authKey);
      await getAuthkey(props.id, adminId1);
      return;
    }
console.log(props,)
    await updateAuthkey(props.dbId, adminId1, props.title, data);
    setAuthKey(props.title);
    await getAuthkey(props.dbId, adminId1 );
  };

  const updateValueOnEdit = () => {
    if (props?.dbId) {
      setName(props?.authData?.name);
      if (Object.values(props?.authData?.access)[0] === "1") {
        setScope(Object.values(props?.authData)[3]);
        let all = [];
        Object.entries(options).map((option) => {
          all = [...all, option[1]?.tableName];
        });
        setSelected(all);
      } else {
        setScope(Object.values(props?.authData?.access)[0]?.scope);
        const tableIds = Object.keys(props?.authData?.access);
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
      <Modal open={props.open} onClose={handleClose}>
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
              <Button variant="outlined" onClick={handleClose} className="mui-button-outlined create-auth-key-button">
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
  title: PropTypes.any,
  id: PropTypes.any,
  handleClose: PropTypes.func,
  location: PropTypes.any
};
