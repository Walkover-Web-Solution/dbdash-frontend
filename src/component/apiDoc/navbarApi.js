import { Box } from '@mui/material'
import { Link,useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { UserAuth } from "../../context/authContext.js"
import { findUserByEmail } from "../../api/userApi"
import { Button, Select, MenuItem, FormControl, InputLabel, ListSubheader } from "@mui/material";
import ApiCrudTablist from './apiCrudTab/apiCrudTablist';
import { getDbById } from '../../api/dbApi';
import PropTypes from "prop-types";
export default function Navbar() {
  const [alldbs, setAllDbs] = useState(false);
  const [tables, setTables] = useState({});
  const [dbId,setDbId] = useState("")
  const navigate = useNavigate()
  // const [open,setOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState();
  const [selectedDb,setSelectedDb] = useState(null);
  const [selectTable, setSelectTable] = useState('');
  const handleChange = async (event) => {
    setSelectedDb(event.target.value);
    setSelectedOption(event.target.value);
    setDbId(event.target.value)
    await getAllTableName(event.target.value)
    navigate(`/apiDoc/db/${selectedDb}`);
  };
  const handleChangeTable = async (event) => {
    setSelectTable(event.target.value);
  };
  const { user } = UserAuth();
  useEffect(() => {
    if (user?.email)
      getOrgAndDb();
  }, [user])
  const filterDbsBasedOnOrg = async (allDbs) => {
    var result = {};
    allDbs.map((item) => {
      result[item.org_id._id] = result[item.org_id._id] ? [...result[item.org_id._id], item] : [item]
    })
    setSelectedOption(result?.[Object.keys(result)?.[0]]?.[0]._id);
    setSelectedDb(result?.[Object.keys(result)?.[0]]?.[0]._id)
    setDbId(result?.[Object.keys(result)?.[0]]?.[0]._id)
    await getAllTableName(result?.[Object.keys(result)?.[0]]?.[0]._id)
    setAllDbs(result);
    
  }
  const getOrgAndDb = async () => {
    const data = await findUserByEmail(user?.email);
    localStorage.setItem("userid", data?.data?.data?._id);
    filterDbsBasedOnOrg(data?.data?.data?.dbs)
  }
  const getAllTableName = async (dbId) => {
    
    const data = await getDbById(dbId)

    setTables(data.data.data.tables || {});
    if(data.data.data.tables){
      setSelectTable(Object.keys(data.data.data.tables)[0])
    }
    
  }
  
  return (
    <>
   <Box align="center">
        {/* <navbarApi/> */}
        {Object.keys(tables).length >=1 && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button variant="contained" color="primary" sx={{m:1}} disabled>APIs Documentation</Button>
          <Link to= {`/authkeypage/${dbId}`} state={selectedOption} style={{textDecoration:'none'}}>
          <Button variant="contained" color="primary">Auth Key</Button>
          </Link>
        </Box>}
   </Box>
      <Box >
        {alldbs && <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-select">Organization-db</InputLabel>
          <Select id="grouped-select" label="Organization and dbs"  value={selectedDb}  onChange={handleChange}>
            {Object.entries(alldbs).map(([orgId, dbs]) => [
              <ListSubheader key={`${orgId}-header`} name={orgId}>{dbs[0].org_id.name}</ListSubheader>,
              dbs?.map((db,index) => (
                <MenuItem key={index} value={db?._id}>{db?.name} </MenuItem>
              ))
            ]
            )}
            {/* defaultValue={selectedOption} */}
          </Select>
        </FormControl>}
      </Box>
      <br></br>
  
      {Object.keys(tables).length >=1 && <Box >
         <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-select">Tables-Name</InputLabel>
          <Select value={selectTable}
            onChange={handleChangeTable} >
            {Object.entries(tables)?.map((table) => (
              <MenuItem key={table[0]} value={table[0]} >
                {table[1].tableName || table[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>}
      {Object.keys(tables).length >=1 ? <Box>
  
        <ApiCrudTablist db={selectedOption} table={selectTable}/>
      </Box>:"Please make the table first"}
    </>
  )
}
Navbar.propTypes = {
  dbData: PropTypes.any,
  dbId: PropTypes.string,
  orgId: PropTypes.string,
};