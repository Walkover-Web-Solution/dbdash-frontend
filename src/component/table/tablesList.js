import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PopupModal from '../popupModal';
import PropTypes from "prop-types";
import SingleTable from './singleTable';
import {useNavigate} from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import { bulkAddColumns } from '../../store/table/tableThunk';
import { useDispatch, useSelector } from 'react-redux';
import MainTable from '../../table/mainTable';
import { getAllTableInfo } from '../../store/allTable/allTableSelector';
import { createTable1} from '../../store/allTable/allTableThunk';

export default function TablesList({dbData}) {
  const dispatch= useDispatch();
  const [value, setValue] = React.useState(0);  
  const navigate =useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [table, setTable] = useState();
  const [tabIndex,setTabIndex]= useState(-1);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));

  const saveTable = async () => {
    const data = {
      tableName: table
    }
    setOpen(false);
    dispatch(createTable1({"dbId":dbData?.db?._id,"data":data}));
    
  };
  useEffect(() => {
    if(dbData?.db?.tables)
    {
        dispatch(bulkAddColumns({
          "dbId":dbData?.db?._id,
          "tableName": Object.keys(dbData?.db?.tables)[0]
        }));
        navigate(`/db/${dbData?.db?._id}/table/${Object.keys(dbData?.db?.tables)[0]}`);   
    }
  }, [dbData])
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
          {Object.entries(AllTableInfo.tables).map((table, index) => (
            <Box key={index} >
              <SingleTable table={table} tabIndex={tabIndex}  setTabIndex={setTabIndex}  index={index} dbData={dbData} highlightActiveTable={()=>setValue(index)}/>
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