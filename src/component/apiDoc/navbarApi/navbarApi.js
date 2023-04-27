import React, { useEffect, useState } from 'react'
import { Link,useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Box,Button, Select, MenuItem, FormControl, InputLabel, ListSubheader } from "@mui/material";
import ApiCrudTablist from '../apiCrudTab/apiCrudTablist/apiCrudTablist';
import { getDbById } from '../../../api/dbApi';
import PropTypes from "prop-types";
import './navbarApi.css'
import { selectOrgandDb } from '../../../store/database/databaseSelector.js';
export default function Navbar() {
  const [tables, setTables] = useState({});
  const [dbId, setDbId] = useState("")
  const navigate = useNavigate()
  const params = useParams()
  const [selectedOption, setSelectedOption] = useState();
  const [selectedDb, setSelectedDb] = useState(false);
  const [selectTable, setSelectTable] = useState(false);
  const alldb = useSelector((state) => selectOrgandDb(state))
  const [loading,setLoading] = useState(false);
  const handleChange = async (event) => {
    setSelectedDb(event.target.value);
    setSelectedOption(event.target.value);
    setDbId(event.target.value)
    setLoading(false)
    await getAllTableName(event.target.value)
    navigate(`/apiDoc/db/${selectedDb}`);
  };
  const handleChangeTable = async (event) => {
    setSelectTable(event.target.value);
  };
  const filterDbsBasedOnOrg = async () => {
    Object.keys(alldb).forEach(async(orgId) =>{
      const dbObj = alldb[orgId].find(db=>db?._id === params.dbId)
      if(dbObj){
       
        setSelectedOption(dbObj._id);
        setSelectedDb(dbObj._id)
        setDbId(dbObj._id)
        await getAllTableName(dbObj._id)

      }
    })
  }
 
  useEffect(() => {
    filterDbsBasedOnOrg();
  }, [alldb])

  const getAllTableName = async (dbId) => {
    const data = await getDbById(dbId)
    setTables(data.data.data.tables || {});
    if (data.data.data.tables) {
      setSelectTable(Object.keys(data.data.data.tables)[0])
      setLoading(true)
    }
  }

  return (
    <>
      <Box align="center">
       
        {Object.keys(tables).length >= 1 && <Box  className="flexcentercenter" >
          <Button variant="contained" color="primary" className="button"  disabled>APIs Documentation</Button>
          <Link to={`/authkeypage/${dbId}`} state={selectedOption} className=" dontdecorate">
            <Button variant="contained" className='button' color="primary">Auth Key</Button>
          </Link>
        </Box>}
      </Box>
      <Box >
      {alldb && selectedDb && <FormControl className="selectbox">
          <InputLabel htmlFor="grouped-select">Organization-db</InputLabel>
          <Select id="grouped-select" label="Organization and dbs" value={selectedDb} onChange={handleChange}>
            {Object.entries(alldb).map(([orgId, dbs]) => [
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

      {Object.keys(tables).length >= 1 && <Box >
        <FormControl className="selectbox">
          <InputLabel htmlFor="grouped-select">Tables-Name</InputLabel>
          <Select value={selectTable} label= "Tables-Name"
            onChange={handleChangeTable} >
            {Object.entries(tables)?.map((table) => (
              <MenuItem key={table[0]} value={table[0]} >
                {table[1].tableName || table[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>}
      <Box>

       {loading &&  <ApiCrudTablist db={selectedOption} table={selectTable} />}
      </Box>
    </>
  )
}
Navbar.propTypes = {
  dbData: PropTypes.any,
  dbId: PropTypes.string,
  orgId: PropTypes.string,
};