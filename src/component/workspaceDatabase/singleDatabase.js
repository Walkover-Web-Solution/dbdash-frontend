import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, TextField ,Button} from "@mui/material";
import ClickAwayListener from '@mui/base/ClickAwayListener';
import PropTypes from "prop-types";
import {  useNavigate } from "react-router-dom";
import Dropdown from "../dropdown";
import { renameDb, deleteDb } from "../../api/dbApi";

// import {deleteDb} from '../api/dbApi.js';
export default function SingleDatabase(props) {
  const [name, setName] = useState(false);
  const [dbname, setDbname] = useState();
  const navigate = useNavigate();
  // const [open, setOpen] = useState(false);
  const renameDatabase = async (orgId, id, name) => {
    const data = {
      name: dbname || name,
    };
    await renameDb(orgId, id, data);
    await props.getOrgAndDbs();
  };
  const handleOpen = () => {
    setName(false);
  };
  useEffect(() => {});
  const deletDatabases = async () => {
    await deleteDb(props?.db?.org_id?._id, props?.db._id);
    await props.getOrgAndDbs();
  };
  return (
    // <Link
    //   to={{ pathname: "/db/" + props.db._id }}
    //   style={{ textDecoration: "none" }}
    //   state={{ db: props.db }}
    // >
      <Card sx={{ minWidth: 250, minHeight: 200, boxShadow: 2 }} onClick={()=>{
    
        navigate("/db/"+ props.db._id , {state : { db: props.db }});
      }}>
        <CardContent sx={{ display: "flex" }}>
          {name ? (
            <>
            <ClickAwayListener onClickAway={handleOpen} >
              <Box>
              <TextField
                // onBlur={handleOpen}
                autoFocus
                sx={{ width: 120, fontWeight: "bold" }}
                defaultValue={props.db.name}
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
                  zIndex :"555",
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
                <Dropdown
                  first={"Rename Database"}
                  second={"Delete Database"}
                  setName={setName}
                  idToDelete={props?.db?._id}
                  deleteFunction={deletDatabases}
                  title={"Database"}
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    // </Link>
  );
}
SingleDatabase.propTypes = {
  db: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
    org_id: PropTypes.any,
  }),
  getOrgAndDbs: PropTypes.func,
};
