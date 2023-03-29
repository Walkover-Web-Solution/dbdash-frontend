import React, { useEffect, useState} from "react";
import {
  Table,
  TableBody,
  Box,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
} from "@mui/material";

import { PropTypes } from 'prop-types';
import { getAuthkey,deleteAuthkey} from "../../api/authkeyApi";
import TableMenuDropdown from "./tableMenuDropdown";
import { useSelector } from "react-redux";
import { selectActiveUser } from "../../store/user/userSelector";
// import { useNavigate, useParams } from "react-router-dom";
export default function AuthKey(props) {

  const adminId = localStorage.getItem("userid");
  const[authKeys,setAuthKeys] = useState(null)
  const user=useSelector((state)=>selectActiveUser(state));
  // const navigate = useNavigate();

  // const params = useParams();

  

  useEffect(  ()=>{
    getAuthkeyFun()
  },[])

  async function getAuthkeyFun(){
  const data = await getAuthkey(props.dbId,adminId) 
  setAuthKeys(data?.data?.data)
  }

  async function deleteAuthkeyFun(authKey){
    const data = await deleteAuthkey(props.dbId,adminId,authKey)
    const dataa = await getAuthkey(props.dbId,adminId)
    setAuthKeys(dataa?.data?.data)
    return data;
  }

 
  return (
    <>
      <Box sx={{ border: 1, m: 1, boxShadow: 10 }}>
        <TableContainer
          component={Paper}
          sx={{ width: "100%", maxHeight: 533 }}
        >
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Action</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authKeys && Object.keys(authKeys).map((keys) => (
                <TableRow
                  key={keys}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {/* {keys} */}
                    {authKeys[keys].name}
                  </TableCell>
                  {/* <TableCell>{authKeys[keys].access}</TableCell> */}
                  {/* <TableCell>{authKeys[keys].scope}</TableCell> */}
                  <TableCell>{user?.first_name}</TableCell>
                  <TableCell>{authKeys[keys].createDate}</TableCell>
                  <TableCell>     
                  <TableMenuDropdown authData={authKeys[keys]} first={"Edit"} second={"Delete"} third={"Show AuthKey"} title={keys} deleteFunction={deleteAuthkeyFun}/>
                  </TableCell>
                  {/* first={"Edit"} */}
            
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
  dbId: PropTypes.string
}