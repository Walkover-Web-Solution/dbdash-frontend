import React, { useEffect, useState } from "react";
import { Table, TableBody, Box, Paper, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";
import { PropTypes } from 'prop-types';
import { getAuthkey, deleteAuthkey } from "../../../api/authkeyApi";
import TableMenuDropdown from "../tableMenuDropdown/tableMenuDropdown";
import { useSelector } from "react-redux";
import { allOrg } from "../../../store/database/databaseSelector"
import './authKeyTable.css'
export default function AuthKey(props) {

  const adminId = localStorage.getItem("userid");
  const [authKeys, setAuthKeys] = useState(null)
  const [createdBy, setCreatedBy] = useState(null)
  const user = useSelector((state) => allOrg(state));

  useEffect(async() => {
    const arrayofUser = await getAuthkeyFun();
    setCreatedBy(arrayofUser)

  }, [])

  async function getAuthkeyFun() {
    const data = await getAuthkey(props.dbId, adminId)
    setAuthKeys(data?.data?.data)
    var array = [];
    Object.entries(Object.values(data?.data?.data))?.map((key) => {
      user[0]?.users?.map((id) => {
        if (id?.user_id?._id == key[1].user) {
          array.push(id?.user_id?.first_name +  " "  + id?.user_id?.last_name)
        }
      })
    });
    
    return array;

  }

  async function deleteAuthkeyFun(authKey) {
    const data = await deleteAuthkey(props.dbId, adminId, authKey)
    const dataa = await getAuthkey(props.dbId, adminId)
    setAuthKeys(dataa?.data?.data)
    return data;
  }


  return (
    <>
      <Box className="firstbox" sx={{boxShadow:10}}>
        <TableContainer
          component={Paper}
          className="container"
         
        >
          <Table  stickyHeader aria-label="sticky table">
            <TableHead >
              <TableRow className="zindex1" >
                <TableCell >Name</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Action</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authKeys && Object.keys(authKeys).map((keys,index) => (
                <TableRow
                  key={keys}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" className="zindex0" >
  {authKeys[keys].name}
</TableCell>

              
                   {createdBy && <TableCell>{createdBy[index]}</TableCell>}
                  
                 
                  <TableCell>{authKeys[keys].createDate}</TableCell>
                  <TableCell>
                  <TableMenuDropdown authData={authKeys[keys]} first={"Edit"} second={"Delete"} third={"Show AuthKey"} title={keys} deleteFunction={deleteAuthkeyFun}/>
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
  dbId: PropTypes.string
}