import React, { useEffect, useState } from "react";
import { Table, TableBody, Box, Paper, TableRow, TableHead, TableContainer, TableCell, Tooltip } from "@mui/material";
import { PropTypes } from 'prop-types';
import { getAuthkey, deleteAuthkey } from "../../api/authkeyApi";
import TableMenuDropdown from "./tableMenuDropdown";
import { useSelector } from "react-redux";
import { allOrg } from "../../store/database/databaseSelector";

export default function AuthKey(props) {
  const adminId = localStorage.getItem("userid");
  const [authKeys, setAuthKeys] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const user = useSelector((state) => allOrg(state));

  useEffect(async () => {
     const arrayofUser = await getAuthkeyFun();
    setCreatedBy(arrayofUser);
  }, []);

  async function getAuthkeyFun() {
    const data = await getAuthkey(props.dbId, adminId);
    setAuthKeys(data?.data?.data);
    var array = [];
    Object.entries(Object.values(data?.data?.data))?.map((key) => {
      user[0]?.users?.map((id) => {
        if (id?.user_id?._id == key[1].user) {
          array.push(id?.user_id?.first_name + " " + id?.user_id?.last_name);
        }
      });
    });
    return array;
  }

  async function deleteAuthkeyFun(authKey) {
    const data = await deleteAuthkey(props.dbId, adminId, authKey);
    const dataa = await getAuthkey(props.dbId, adminId);
    setAuthKeys(dataa?.data?.data);
    return data;
  }

  const formatDateTime = (dateTime) => {
    const currentDate = new Date();
    const createdDate = new Date(dateTime);
    const diff = currentDate - createdDate;
  
    if (diff < 60 * 1000) {
      return "Just now";
    } else if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      if (days === 1) {
        return "Yesterday";
      } else {
        return `${days} day${days !== 1 ? "s" : ""} ago`;
      }
    } else if (diff < 4 * 7 * 24 * 60 * 60 * 1000) {
      const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    } else if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
      const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diff / (12 * 30 * 24 * 60 * 60 * 1000));
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <>
      <Box sx={{ border: 1, m: 1, boxShadow: 10 }}>
        <TableContainer component={Paper} sx={{ width: "100%", maxHeight: 533 }}>
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Auth Key</TableCell>
                <TableCell>Table Access</TableCell>
                <TableCell>Scope</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authKeys &&
                Object.keys(authKeys).map((keys, index) => (
                  <TableRow key={keys} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {authKeys[keys].name}
                    </TableCell>
                    {createdBy && <TableCell>{createdBy[index]}</TableCell>}

                    <TableCell>
                      <Tooltip title={authKeys[keys].createDate} placement="top">
                        <span>{formatDateTime(authKeys[keys].createDate)}</span>
                      </Tooltip>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {keys.substring(0, 3) + "*".repeat(keys.length - 6) + keys.substring(keys.length - 3)}
                    </TableCell>

                    <TableCell>
                      {authKeys[keys].access === '1' ? (
                        <div>all</div>
                      ) : (
                        Object.keys(authKeys[keys].access).map((key) => (
                          <div key={key}>{key}</div>
                        ))
                      )}
                    </TableCell>

                    {/* <TableCell>
                      {authKeys[keys].access === '1' ? (
                        <div>all</div>
                      ) : (
                        Object.values(authKeys[keys].access).map((table) => (
                          <div key={table.scope}>{table.scope}</div>
                        ))
                      )}
                    </TableCell> */}

                    <TableCell>
                      {authKeys[keys].access === '1' ? (
                        <div>all</div>
                      ) : (
                        <div>{Object.values(authKeys[keys].access)[0]?.scope}</div>
                      )}

                    </TableCell>
                    <TableCell>
                      <TableMenuDropdown
                        authData={authKeys[keys]}
                        first={"Edit"}
                        second={"Delete"}
                        third={"Show AuthKey"}
                        title={keys}
                        deleteFunction={deleteAuthkeyFun}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

AuthKey.propTypes = {
  dbId: PropTypes.string,
  scope: PropTypes.any,
  selected: PropTypes.any
};
