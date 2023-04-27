import React, { useEffect, useState } from "react";
import AuthKeyHeader from "../../component/authKeyComponents/authKeyHeader/authKeyHeader";
import { Link, useLocation, useParams } from "react-router-dom";
import {Box, TextField, Typography, Button } from "@mui/material";
import AuthAccessDropDown from "../../component/authKeyComponents/authAccessDropdown/authAccessDropdown";
// import AuthKeyPopup from "../component/authKeyComponents/authKeyPopup";
import AuthKeyDropdown from "../../component/authKeyComponents/authKeyDropdown/authKeyDropdown";
import { PropTypes } from "prop-types";
import { createAuthkey, getAuthkey, updateAuthkey } from "../../api/authkeyApi";
import MainNavbar from "../../component/mainNavbar/mainNavbar";
// import DisplayAuthKeyPopup from "../component/authKeyComponents/authKeyTablePopup/displayAuthkeyPopup";
import AuthKeyPopup from "../../component/authKeyComponents/authKeyPopup/authKeyPopup";
import { useSelector } from "react-redux";
import { selectActiveUser } from "../../store/user/userSelector.js";
import './createAuth.css'
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
  const handleOpen = () => setOpen(true);
  const [options, setOptions] = useState([]);


  const isDisabled = !name || !scope || selected.length === 0;
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  const createAuth = async () => {
    // e.preventDefault();
    const adminId1 = localStorage.getItem("userid");
    const adminId = userDetails?.fullName;
    const data = {
      name: name,
      scope: scope,
      access: selected,
      userId: adminId1,
    };
    if (!dbId) {
     
      const create = await createAuthkey(id, adminId, data);
      setOpen(true);
      setAuthKey(create?.data?.data?.authKey);
      await getAuthkey(id, adminId);
      return;
    }
     const authKey = dbId.title
     await updateAuthkey(id,adminId1,authKey,data)
     setAuthKey(dbId.title);
      await getAuthkey(id, adminId);

  };

  const updateValueOnEdit = () => {
    if (dbId) {
      setName(dbId?.authData?.name);
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
  };
 
  useEffect(() => {
    updateValueOnEdit();
  }, [dbId, options]);
  return (
    <>
      <Box>
        <MainNavbar />
      </Box>
      <Box>
        <AuthKeyHeader id={id}/>
      </Box>
      <Box className="firstbox" >
        <Box className="secondbox" >
          <Box className="thirdbox" >
            <Typography className="texto" >Name</Typography>
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
          <Box className="fourbox">
            <Typography className="scope" >Scope</Typography>
            <Box className="mt10" >
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
          <Box className="fifthbox">
            <Typography className="access" >Access</Typography>
            <Box className="mt35" >
              <AuthKeyDropdown scope={scope} setScope={setScope} />
            </Box>
          </Box>
        </Box>
        <Box
        className="sixthbox"
        
        >
          <Box className="m1" >
            <Button
              variant="contained"
              disabled={isDisabled}
              onClick={() => {
                createAuth();
                handleOpen();
              }}
            >
              {dbId ? "Update" : "Create"}
            </Button>
            {/* <AuthKeyPopup open={open}
              setOpen={setOpen} authKey={authKey}/> */}
            <AuthKeyPopup
              open={open}
              setOpen={setOpen}
              title={authKey}
              dbId={id}
            />
          </Box>
          <Box className='m1'>
            <Link to={`/authkeypage/${id}`} className="dontdecorate">
              <Button variant="outlined">Cancel</Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
}
CreateAuthKey.propTypes = {
  dbId: PropTypes.string,
};
