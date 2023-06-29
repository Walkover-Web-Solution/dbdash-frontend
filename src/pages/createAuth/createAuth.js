import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Modal,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useSelector } from "react-redux";
import { PropTypes } from "prop-types";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import AuthAccessDropDown from "../../component/authKeyComponents/authAccessDropdown";
// import AuthKeyDropdown from "../../component/authKeyComponents/authKeyDropdown/authKeyDropdown";
import AuthKeyPopup from "../../component/authKeyComponents/authKeyPopup";
import { createAuthkey, updateAuthkey } from "../../api/authkeyApi";
import { selectActiveUser } from "../../store/user/userSelector.js";
// import { toast } from 'react-toastify';

import "./createAuth.scss";
import { allOrg } from "../../store/database/databaseSelector";

export default function CreateAuthKey(props) {
  const id = props.id;
  const [scope, setScope] = useState([]);
  const [name, setName] = useState("");
  const userDetails = useSelector((state) => selectActiveUser(state));
  const [authKey, setAuthKey] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [dbId] = useState(
    props?.authData && props?.title
      ? {
          authData: props?.authData,
          title: props?.title,
        }
      : undefined
  );

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

  const isDisabled = !name || scope == "" || scope == [] || !scope;
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  const createAuth = async () => {
    const adminId1 = localStorage.getItem("userid");
    const adminId = userDetails?.fullName;
    let jsontosend = {};
    let accesstosend = null;
    let scopetosend = null;

    if (Array.isArray(scope)) {
      scope.forEach((element) => {
        const lastIndex = element.lastIndexOf("_");
        const tableid = element.substring(0, lastIndex);
        const scope1 = element.substring(lastIndex + 1);
        jsontosend[tableid] = { scope: scope1 };
      });
    } else if (typeof scope === "string") {
      const lastIndex = scope.lastIndexOf("_");
      accesstosend = scope.substring(0, lastIndex) === "schema" ? "11" : "1";
      scopetosend = scope.substring(lastIndex + 1);
    }

    const data = {
      name: name,
      access: accesstosend === null ? jsontosend : accesstosend,
      ...(accesstosend !== null && { scope: scopetosend }),
      userId: adminId1,
    };

    if (!props?.authData) {
      const create = await createAuthkey(id, adminId, data);
      setOpen(true);
      setAuthKey(create?.data?.data?.authKey);
      props?.setAuthKeys(create?.data?.data?.updatedDoc?.auth_keys);
      getCreatedByName(create?.data?.data);
      return;
    }

    const authKey = dbId?.title;
    const updatedAuthKey = await updateAuthkey(id, adminId1, authKey, data);
    setAuthKey(dbId?.title);
    handleOpen();
    props?.setAuthKeys(updatedAuthKey?.data?.data?.auth_keys);
  };
  useEffect(() => {
    if (!dbId) return;
    setName(dbId?.authData?.name);
    if (!dbId?.authData?.access) return;
    if (typeof dbId?.authData?.access == "string") {
      if (dbId?.authData?.access == "1") {
        setScope(`alltables_${dbId?.authData?.scope}`);
      } else setScope(`schema_${dbId?.authData?.scope}`);
    } else {
      let arr = [...scope];
      Object.entries(dbId?.authData?.access).map(([key, value]) => {
        arr.push(`${key}_${value?.scope}`);
      });
      setScope(arr);
    }
  }, [dbId]);

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
            <Typography className="create-auth-key-label">Scope</Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "300px" }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingRight: "5px",
                  }}
                >
                  <div>
                    <Typography className="create-auth-key-label">
                      All Tables
                    </Typography>
                  </div>
                  <div>
                    <RadioGroup row>
                      <FormControlLabel
                        value="alltables_read"
                        control={
                          <Radio
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                          />
                        }
                        label="Read"
                        checked={scope == "alltables_read"}
                        onClick={(e) => {
                          if (
                            typeof scope != "string" ||
                            scope != e.target.value
                          ) {
                            setScope(e.target.value);
                          } else setScope("");
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="alltables_write"
                        control={
                          <Radio
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                          />
                        }
                        label="Write" 
                        checked={scope == "alltables_write"}
                        onClick={(e) => {
                          if (
                            typeof scope != "string" ||
                            scope != e.target.value
                          ) {
                            setScope(e.target.value);
                          } else setScope("");
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </div>
                </Box>
              </Box>
              <Box
                sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  borderTop: "1px solid #ccc",
                  borderBottom: "1px solid black",
                  my: 1,
                  paddingRight: "5px",
                }}
              >
                {props?.alltabledata &&
                  Object.entries(props?.alltabledata).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Typography className="create-auth-key-label">
                            {value.tableName}
                          </Typography>
                        </div>
                        <div>
                          <RadioGroup row>
                            <FormControlLabel
                              value={`${key}_read`}
                              control={
                                <Radio
                                  icon={
                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                  }
                                  checkedIcon={
                                    <CheckBoxIcon fontSize="small" />
                                  }
                                />
                              }
                              label="Read"
                              checked={
                                Array.isArray(scope) &&
                                scope.includes(`${key}_read`)
                              }
                              onClick={(e) => {
                                console.log("heellff");
                                let arr = [];
                                if (typeof scope == "string") {
                                  arr.push(e.target.value);
                                  setScope([...arr]);

                                  return;
                                }
                                arr = scope;

                                if (
                                  e.target.value == `${key}_read` &&
                                  Array.isArray(scope) &&
                                  !scope.includes(e.target.value)
                                ) {
                                  arr.push(e.target.value);
                                  let index = arr.indexOf(`${key}_write`);
                                  if (index != -1) arr.splice(index, 1);
                                } else if (scope.includes(e.target.value)) {
                                  arr.splice(arr.indexOf(e.target.value), 1);
                                }

                                setScope([...arr]);
                              }}
                              labelPlacement="end"
                            />
                            <FormControlLabel
                              value={`${key}_write`}
                              control={
                                <Radio
                                  icon={
                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                  }
                                  checkedIcon={
                                    <CheckBoxIcon fontSize="small" />
                                  }
                                />
                              }
                              label="Write"
                              checked={
                                Array.isArray(scope) &&
                                scope.includes(`${key}_write`)
                              }
                              onClick={(e) => {
                                console.log("heellff");
                                let arr = [];
                                if (typeof scope == "string") {
                                  arr.push(e.target.value);
                                  setScope([...arr]);

                                  return;
                                }
                                arr = scope;

                                if (
                                  e.target.value == `${key}_write` &&
                                  Array.isArray(scope) &&
                                  !scope.includes(e.target.value)
                                ) {
                                  arr.push(e.target.value);
                                  let index = arr.indexOf(`${key}_read`);
                                  if (index != -1) {
                                    arr.splice(index, 1);
                                  }
                                } else if (scope.includes(e.target.value)) {
                                  arr.splice(arr.indexOf(e.target.value), 1);
                                }
                                setScope([...arr]);
                              }}
                              labelPlacement="end"
                            />
                          </RadioGroup>
                        </div>
                      </Box>
                    </React.Fragment>
                  ))}
              </Box>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <Typography className="create-auth-key-label">
                      Schema
                    </Typography>
                  </div>
                  <div>
                    <RadioGroup row>
                      <FormControlLabel
                        value="schema_read"
                        control={
                          <Radio
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                          />
                        }
                        checked={scope == "schema_read"}
                        label="Read"
                        onClick={(e) => {
                          if (
                            typeof scope != "string" ||
                            scope != e.target.value
                          ) {
                            setScope(e.target.value);
                          } else setScope("");
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="schema_write"
                        control={
                          <Radio
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                          />
                        }
                        checked={scope == "schema_write"}
                        label="Write"
                        onClick={(e) => {
                          if (
                            typeof scope != "string" ||
                            scope != e.target.value
                          ) {
                            setScope(e.target.value);
                          } else setScope("");
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* <Box className="create-auth-key-row">
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
          </Box> */}

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
              <AuthKeyPopup
                handleClose={props?.handleClose}
                open={open}
                setOpen={setOpen}
                title={authKey}
                dbId={props.id}
              />
            </Box>
            <Box>
              <Button
                variant="outlined"
                onClick={props.handleClose}
                className="mui-button-outlined create-auth-key-button"
              >
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
  authkeycreatedorupdated: PropTypes.any,
  setAuthkeycreatedorupdated: PropTypes.any,
  title: PropTypes.any,
  id: PropTypes.any,
  alltabledata: PropTypes.any,

  handleClose: PropTypes.func,
  location: PropTypes.any,
  setAuthKeys: PropTypes.any,
  getCreatedByName: PropTypes.func,
  setCreatedBy: PropTypes.any,
};
