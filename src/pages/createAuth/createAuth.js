import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { PropTypes } from "prop-types";
import MainNavbar from "../../component/mainNavbar/mainNavbar";
import AuthKeyHeader from "../../component/authKeyComponents/authKeyHeader";
import AuthAccessDropDown from "../../component/authKeyComponents/authAccessDropdown";
import AuthKeyDropdown from "../../component/authKeyComponents/authKeyDropdown/authKeyDropdown";
import AuthKeyPopup from "../../component/authKeyComponents/authKeyPopup";
import { createAuthkey, getAuthkey, updateAuthkey } from "../../api/authkeyApi";
import { selectActiveUser } from "../../store/user/userSelector.js";
import "./createAuth.css";

export default function CreateAuthKey() {
  const location = useLocation();
  const { id } = useParams();
  const dbId = location.state;

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
      const create = await createAuthkey(id, adminId, data);
      setOpen(true);
      setAuthKey(create?.data?.data?.authKey);
      await getAuthkey(id, adminId);
      return;
    }

    const authKey = dbId.title;
    await updateAuthkey(id, adminId1, authKey, data);
    setAuthKey(dbId.title);
    await getAuthkey(id, adminId);
  };

  const updateValueOnEdit = () => {
    if (dbId) {
      setName(dbId?.authData?.name);
      if (Object.values(dbId?.authData?.access)[0] === "1") {
        setScope(Object.values(dbId?.authData)[3]);
        let all = [];
        Object.entries(options).map((option) => {
          all = [...all, option[1].tableName];
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

  useEffect(() => {
    updateValueOnEdit();
  }, [dbId, options]);

  return (
    <>
      <Box >
        <MainNavbar />
      </Box>
      <Box className="create-auth-key-main-container">
        <AuthKeyHeader id={id} />
      <Box className="create-auth-key-container">
    
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
                dbId={id}
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
                className="create-auth-key-button"
              >
                {dbId ? "Update" : "Create"}
              </Button>
              <AuthKeyPopup open={open} setOpen={setOpen} title={authKey} dbId={id} />
            </Box>
            <Box>
              <Link to={`/authkeypage/${id}`} className="create-auth-key-link">
                <Button variant="outlined" className="create-auth-key-button">
                  Cancel
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

CreateAuthKey.propTypes = {
  dbId: PropTypes.string,
};
