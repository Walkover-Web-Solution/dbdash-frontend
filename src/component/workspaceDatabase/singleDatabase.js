import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Select, MenuItem, TextField, Button } from "@mui/material";
import ClickAwayListener from '@mui/base/ClickAwayListener';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Dropdown from "../dropdown";
import { useDispatch, useSelector } from "react-redux";
import { removeDbThunk, renameDBThunk, moveDbThunk } from "../../store/database/databaseThunk";
import { allOrg } from "../../store/database/databaseSelector";
export default function SingleDatabase(props) {

  const [name, setName] = useState(false);
  const [dbname, setDbname] = useState();
  const [openmove, setOpenmove] = useState(false);
  const [selectedorg, setSelectedorg] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allorgss = useSelector((state) => allOrg(state))
  let arr = Object.entries(allorgss).filter(x => { return x[1]?._id !== props?.db?.org_id?._id });

  const handlingmove = () => {
    setOpenmove(false);
  }
  const handlemove = async (orgid, dbid) => {
    const data = {
      newOrgId: selectedorg._id
    }
    dispatch(moveDbThunk({ orgid, dbid, data }))
  };

  const renameDatabase = async (orgId, id, name) => {
    const data = {
      name: dbname || name,
    };
    dispatch(renameDBThunk({ orgId, id, data }))
    setDbname();
  };
  const handleOpen = () => {
    setName(false);
  };

  const deletDatabases = async () => {
    if (props?.db?.org_id?._id) {
      dispatch(removeDbThunk({ orgId: props?.db?.org_id?._id, dbId: props?.db?._id }));
    }
    else if (props?.db?.org_id) {
      dispatch(removeDbThunk({ orgId: props?.db?.org_id, dbId: props?.db?._id }));
    }

  };
  return (
    <Card sx={{ minWidth: 250, minHeight: 200, boxShadow: 2, cursor: 'pointer' }} onClick={() => {

      navigate("/db/" + props.db._id, { state: { db: props.db } });
    }}>
      <CardContent sx={{ display: "flex" }}>
        {openmove && props?.tabIndex == props?.index ? (<ClickAwayListener onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

        }} onClickAway={handlingmove} >
          <Box  >
            <Typography id="title" variant="h6" component="h2">
              Move {props.db.name} to
            </Typography>

            <Box sx={{ display: "flex" }}>
              <Box sx={{ mt: 2 }}>
                {arr.length > 0 ? <Select
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
                      handlemove(props.db.org_id?._id,
                        props.db._id);
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenmove(false)
                    }}
                  }
                  sx={{marginBottom: 1,marginLeft: 3,minWidth: 120}}
                  onChange={(event) => {
                    setSelectedorg(event.target.value);
                  }}
                >

                  {arr?.map((fields, index) => (
                    <MenuItem key={index} value={fields[1]} >
                      {fields[1].name}
                    </MenuItem>
                  ))}
                </Select> : <div style={{ color: "red" }}>Only one org exists</div>}
              </Box>

            </Box>
            <Button
              type="submit"
              onClick={(e) => {
                handlemove(props.db.org_id?._id,
                  props.db._id);
                e.preventDefault();
                e.stopPropagation();
                setOpenmove(false)
              }}
              variant="contained"
              sx={{
                width: "8rem",
                backgroundColor: "#1C2833",
                fontSize: "12px",
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
        </ClickAwayListener>) : name && props?.tabIndex == props?.index ? (
          <>

            <ClickAwayListener onClickAway={handleOpen} >
              <Box>
                <TextField
                  // onBlur={handleOpen}
                  autoFocus
                  sx={{ width: 120, fontWeight: "bold" }}
                  defaultValue={props?.db?.name}
                  value={dbname}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameDatabase(
                        props.db.org_id?._id,
                        props.db._id,
                        props.db.name

                      );
                      setName(false);
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    setDbname(e.target.value);
                  }}
                  size="small"
                />
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setName(false)
                    renameDatabase(
                      props.db.org_id?._id,
                      props.db._id,
                      props.db.name
                    );

                  }}
                  variant="contained"
                  sx={{
                    width: "8rem",
                    backgroundColor: "#1C2833",
                    fontSize: "12px",
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
              {props.db.name}{" "}
            </Typography>
            <Box sx={{ mt: -1 }}>
              {props?.dblength > 1 ? <Dropdown
                setTabIndex={props?.setTabIndex}
                tabIndex={props?.index}
                first={"Rename Database"}
                second={"Delete Database"}
                third={"Move"}
                setOpenmove={setOpenmove}
                orgid={props?.db?.org_id?._id}
                dbid={props?.db?._id}
                setName={setName}
                idToDelete={props?.db?._id}
                deleteFunction={deletDatabases}
                title={"Database"}
              /> : <Dropdown
                setTabIndex={props?.setTabIndex}
                tabIndex={props?.index}
                first={"Rename Database"}
                second={""}
                third={""}
                orgid={props?.db?.org_id?._id}
                dbid={props?.db?._id}
                setName={setName}
                title={"Database"}
              />}

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
  }),
  getOrgAndDbs: PropTypes.func,
  tabIndex: PropTypes.number,
  index: PropTypes.any,
  setTabIndex: PropTypes.func,
  dblength: PropTypes.number
};
