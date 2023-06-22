import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  Box,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  Tooltip,
} from "@mui/material";
import { PropTypes } from "prop-types";
import { getAuthkey, deleteAuthkey } from "../../api/authkeyApi";
import TableMenuDropdown from "./tableMenuDropdown";
import { useSelector } from "react-redux";
import { allOrg } from "../../store/database/databaseSelector";

export default function AuthKey(props) {
  const adminId = localStorage.getItem("userid");
  // const [createdBy, setCreatedBy] = useState(null);
  const user = useSelector((state) => allOrg(state));

  useEffect(() => {
    getAuthkeyFun();
  }, [props.dbId]);

  function getCreatedByName(data) {
    var array = [];
    Object.entries(Object.values(data)).map((key) => {
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
  async function getAuthkeyFun() {
    const data = await getAuthkey(props.dbId, adminId);
    props.setAuthKeys(data?.data?.data);
    getCreatedByName(data?.data?.data);
  }

  async function deleteAuthkeyFun(authKey) {
    const data = await deleteAuthkey(props.dbId, adminId, authKey);
    props?.setAuthKeys(data?.data?.data?.auth_keys);
    return data?.data?.data?.auth_keys;
  }

  const formatDateTime = (dateTime) => {
    const currentDate = new Date();
    const createdDate = new Date(dateTime);
    const diff = currentDate - createdDate;

    if (diff < 1000) {
      return "Just now";
    }

    if (diff < 60 * 1000) {
      const seconds = Math.floor(diff / 1000);
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }

    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);
      return `${minutes} minute${
        minutes !== 1 ? "s" : ""
      } and ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }

    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      if (days === 1) {
        return "Yesterday";
      } else {
        const sameYear =
          currentDate.getFullYear() === createdDate.getFullYear();
        if (sameYear) {
          const monthName = createdDate.toLocaleString("default", {
            month: "long",
          });
          const date = createdDate.getDate();
          return `${date} ${monthName}`;
        } else {
          const year = createdDate.getFullYear();
          const monthName = createdDate.toLocaleString("default", {
            month: "long",
          });
          return `${monthName} ${year}`;
        }
      }
    }

    if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
      const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    }

    const year = createdDate.getFullYear();
    const monthName = createdDate.toLocaleString("default", { month: "long" });
    return `${monthName} ${year}`;
  };

  return (
    <>
      <Box sx={{ my: 1, paddingLeft: "24px", paddingRight: "31px" }}>
        <TableContainer
          component={Paper}
          sx={{ width: "100%", maxHeight: "60vh", border: 1, borderRadius: 0 }}
        >
          <Table
            sx={{ minWidth: 650, overflowY: "scroll" }}
            stickyHeader
            aria-label="sticky table"
          >
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
              {props.authKeys &&
                Object.keys(props.authKeys).map((keys, index) => (
                  <TableRow
                    key={keys}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {props.authKeys[keys].name}
                    </TableCell>
                    <TableCell>
                      {props?.createdBy && props?.createdBy[index]}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={props.authKeys[keys].createDate}
                        placement="top"
                      >
                        <span>
                          {formatDateTime(props.authKeys[keys].createDate)}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {keys.substring(0, 3) +
                        "*".repeat(keys.length - 6) +
                        keys.substring(keys.length - 3)}
                    </TableCell>
                    <TableCell>
                      {props.authKeys[keys].access === "1" ||
                      props.authKeys[keys].access === "11" ? (
                        <div>all</div>
                      ) : (
                        Object.keys(props.authKeys[keys].access).map((key) => (
                          <div key={key}>{key}</div>
                        ))
                      )}
                    </TableCell>
                    <TableCell>
                      {props.authKeys[keys].access === "1" ||
                      props.authKeys[keys].access === "11" ? (
                        <div>{props.authKeys[keys].scope}</div>
                      ) : (
                        <div>
                          {Object.values(props.authKeys[keys].access)[0]?.scope}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <TableMenuDropdown
                        authData={props.authKeys[keys]}
                        getCreatedByName={getCreatedByName}
                        first={"Edit"}
                        second={"Delete"}
                        third={"Show AuthKey"}
                        title={keys}
                        dbId={props.dbId}
                        setAuthKeys={props?.setAuthKeys}
                        setAuthkeycreatedorupdated={
                          props.setAuthkeycreatedorupdated
                        }
                        deleteFunction={deleteAuthkeyFun}
                        authkeycreatedorupdated={props.authkeycreatedorupdated}
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
  authKeys: PropTypes.any,
  setAuthKeys: PropTypes.any,
  authkeycreatedorupdated: PropTypes.any,
  setAuthkeycreatedorupdated: PropTypes.any,
  selected: PropTypes.any,
  setCreatedBy: PropTypes.any,
  createdBy: PropTypes.any,
};
