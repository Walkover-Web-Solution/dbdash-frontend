import React, { memo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../dropdown";
import { useDispatch } from "react-redux";
import {
  renameDBThunk,
  moveDbThunk,
  restoreDbThunk,
  deleteDbThunk,
} from "../../../store/database/databaseThunk";
import { allOrg } from "../../../store/database/databaseSelector";
import { toast } from 'react-toastify';
import variables from '../../../assets/styling.scss'
import './singleDatabase.scss';
import  { customUseSelector } from "../../../store/customUseSelector";

function SingleDatabase(props) {


  const [name, setName] = useState(false);
  const dbname = useRef(null); // Create a ref for dbname
  const [openmove, setOpenmove] = useState(false);
  const [selectedorg, setSelectedorg] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allorgss = customUseSelector((state) => allOrg(state))
  let arr = Object.entries(allorgss).filter(x => { return x[1]?._id !== props?.db?.org_id?._id });
  const handlingmove = () => {
    setOpenmove(false);
  };
  const restoreDb = async (orgId, dbId) => {
    dispatch(restoreDbThunk({ orgId, dbId }));
  };

  const handlemove = async (orgId, dbId) => {
    const data = {
      newOrgId: selectedorg._id,
    };
    dispatch(moveDbThunk({ orgId, dbId, data }));
  };

  const renameDatabase = async (orgId, id, name) => {
    if (!dbname?.current || dbname?.current?.trim() === "") {
      toast.error("Database name cannot be empty");
      // setDbname(props?.db?.name)
      dbname.current = props?.db?.name;
      return;
    }

    if (dbname?.current.length < 3) {
      toast.error("Database name must be at least 3 characters long");
      return;
    }

    if (dbname?.current.length > 30) {
      toast.error("Database name cannot exceed 30 characters");
      return;
    }

    if (dbname?.current.includes(" ")) {
      toast.error("Database name cannot contain spaces");
      return;
    }

    const data = {
      name: dbname?.current || name,
    };

    dispatch(renameDBThunk({ orgId, id, data }));
    dbname.current = "";
  };

  const handleOpen = () => {
    setName(false);
  };

  const deletDatabases = async () => {
    if (props?.db?.org_id?._id) {
      dispatch(
        deleteDbThunk({ orgId: props?.db?.org_id?._id, dbId: props?.db?._id })
      );
    } else if (props?.db?.org_id) {
      dispatch(
        deleteDbThunk({ orgId: props?.db?.org_id, dbId: props?.db?._id })
      );
    }
  };
  const arr1 = !props?.db?.deleted ? Array(props?.dblength).fill(props.db) : [];
  const orgIdForRestore = props.db?.org_id._id || props.db?.org_id;

  return (
    <Card
      className="singledatabasecard"
      onClick={() => {
        navigate("/db/" + props.db._id, { state: { db: props.db } });
      }}
    >
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        {openmove && props?.tabIndex == props?.index ? (
          <ClickAwayListener
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClickAway={handlingmove}
          >
            <Box>
              <Typography id="title" variant="h6" component="h2">
                Move {props.db.name} to
              </Typography>

              <Box sx={{ display: "flex" }}>
                <Box sx={{ mt: 2 }}>
                  {arr.length > 0 ? (
                    <Select
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      MenuProps={{ disablePortal: true }}
                      labelId="select-label"
                      id="select"
                      value={selectedorg}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handlemove(props.db.org_id?._id, props.db._id);
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenmove(false);
                        }
                      }}
                      sx={{ marginBottom: 1, marginLeft: 3, minWidth: 120 }}
                      onChange={(event) => {
                        setSelectedorg(event.target.value);
                      }}
                    >
                      {arr?.map((fields, index) => (
                        <MenuItem key={index} value={fields[1]}>
                          {fields[1].name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <div style={{ color: "red" }}>Only one org exists</div>
                  )}
                </Box>
              </Box>
              <Button
                type="submit"
                onClick={(e) => {
                  handlemove(props.db.org_id?._id, props.db._id);
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenmove(false);
                }}
                className="mui-button"
                variant="contained"
                sx={{
                  width: "8rem",
                  backgroundColor: "#1C2833",
                  fontSize: variables.editfilterbutttonsfontsize,

                  mx: 3,
                  zIndex: "555",
                  ":hover": {
                    bgcolor: "#273746",
                    color: "white",
                    border: 0,
                    borderColor: "#1C2833",
                  },
                }}
              >
                Move
              </Button>
            </Box>
          </ClickAwayListener>
        ) : name && props?.tabIndex == props?.index ? (
          <>
            <ClickAwayListener onClickAway={handleOpen}>
              <Box>
                <TextField
                  // onBlur={handleOpen}
                  autoFocus
                  sx={{ width: 120, fontWeight: "bold" }}
                  defaultValue={props?.db?.name}
                  // value={dbname}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameDatabase(
                        props.db.org_id?._id,
                        props.db._id,
                        props.db?.name
                      );
                      setName(false);
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    dbname.current = e.target.value;
                  }}
                  size="small"
                />
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setName(false);
                    renameDatabase(
                      props.db.org_id?._id,
                      props.db._id,
                      props.db?.name
                    );
                  }}
                  className="mui-button"
                  variant="contained"
                  sx={{
                    width: "8rem",
                    backgroundColor: "#1C2833",
                    fontSize: variables.editfilterbutttonsfontsize,

                    mx: 3,

                    zIndex: "555",
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
              </Box>
            </ClickAwayListener>
          </>
        ) : (
          <>
            <Typography sx={{ fontWeight: "bold" }}>
              {props.db?.name}{" "}
            </Typography>
            <Box>
              {arr1.length > 1 && !props?.db?.deleted ? (
                <Dropdown
                  setTabIndex={props?.setTabIndex}
                  tabIndex={props?.index}
                  first={"Rename"}
                  second={"Delete"}
                  third={"Move"}
                  fourth={"Duplicate"}
                  setOpenmove={setOpenmove}
                  orgid={props?.db?.org_id?._id}
                  dbid={props?.db?._id}
                  dbname={props?.db?.name}
                  setName={setName}
                  idToDelete={props?.db?._id}
                  deleteFunction={deletDatabases}
                  title={"database"}
                />
              ) : !props?.db?.deleted ? (
                <Dropdown
                  setTabIndex={props?.setTabIndex}
                  tabIndex={props?.index}
                  first={"Rename"}
                  fourth={"Duplicate"}
                  orgid={props?.db?.org_id._id}
                  dbid={props?.db?._id}
                  dbname={props?.db?.name}
                  setName={setName}
                  title={"database"}
                />
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    restoreDb(orgIdForRestore, props.db._id);
                  }}
                  className="mui-button-outlined"
                  size="small"
                  variant="outlined"
                  sx={{ display: "flex" }}
                >
                  restore
                </Button>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
SingleDatabase.propTypes = {
  db: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
    org_id: PropTypes.any,
    deleted: PropTypes.any,
  }),
  getOrgAndDbs: PropTypes.func,
  tabIndex: PropTypes.number,
  index: PropTypes.any,
  setTabIndex: PropTypes.func,
  dblength: PropTypes.number,
  orgId: PropTypes.any,
};

export default memo(SingleDatabase);
