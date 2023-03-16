import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PopupModal from '../popupModal';
import { createTable } from '../../api/tableApi';
import { getDbById } from '../../api/dbApi';
import PropTypes from "prop-types";
import SingleTable from './singleTable';
import {useNavigate} from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import { bulkAddColumns } from '../../store/table/tableThunk';
import { useDispatch } from 'react-redux';
import MainTable from '../../table/mainTable';

export default function TablesList({dbData,tables,setTables}) {
  const dispatch= useDispatch();
  const [value, setValue] = React.useState(0);  
  const navigate =useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log("new",newValue)
  };
  const [table, setTable] = useState();
  const [tabIndex,setTabIndex]= useState(-1);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  
  const saveTable = async () => {
    const dbId = dbData?.db._id;
    const data = {
      tableName: table
    }
    await createTable(dbId, data);
    setOpen(false);
    getAllTableName(dbData?.db?._id, dbData?.db?.org_id?._id);
  };
  useEffect(() => {
    if (dbData) {
      getAllTableName(dbData?.db?._id, dbData?.db?.org_id?._id);
    }
  }, [dbData]);
  useEffect(() => {
    if (Object.entries(tables)?.length >0){
      navigate(`/db/${dbData?.db?._id}/table/${Object.keys(tables)[0]}`);
      dispatch(bulkAddColumns({
        "dbId":dbData?.db?._id,
        "tableName": Object.keys(tables)[0]
      }));
    }
  }, [tables])
  const getAllTableName = async (dbId, orgId) => {
    const data = await getDbById(dbId, orgId)
    setTables(data.data.data.tables || {});
    return data;
  }
  
  return (
    <>
      <Box sx={{ width: "100%", display: "flex", height: "auto" }}>
        <Box  sx={{ display: 'flex', overflow: 'hidden', width: "100%", height: "auto"}} >
        <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
          {Object.entries(tables).map((table, index) => (
            <Box key={index} >
              <SingleTable table={table} tabIndex={tabIndex}  setTabIndex={setTabIndex} getAllTableName={getAllTableName} index={index} dbData={dbData} highlightActiveTable={()=>setValue(index)}/>
            </Box>
            ))
          }
          </Tabs>
        </Box>
        <Button onClick={() => handleOpen()} variant="contained" sx={{ width: 122 }} >
          Add Table
        </Button> </Box>
        <PopupModal title="create table" label="Table Name" open={open} setOpen={setOpen} submitData={saveTable} setVariable={setTable} />
        <MainTable/>
    </>
  );
}
TablesList.propTypes = {
  dbData: PropTypes.any,
  table: PropTypes.string,
  dbId: PropTypes.string,
  orgId: PropTypes.string,
  tables:PropTypes.any,
  dropdown:PropTypes.any,
  label : PropTypes.any,
  setTables:PropTypes.any
};