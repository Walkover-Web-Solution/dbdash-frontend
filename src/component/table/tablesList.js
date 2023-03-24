import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PopupModal from '../popupModal';
import FilterModal from "../filterPopUp"
import PropTypes from "prop-types";
import SingleTable from './singleTable';
import {useNavigate,useParams} from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import { bulkAddColumns } from '../../store/table/tableThunk';
import { useDispatch, useSelector } from 'react-redux';
import MainTable from '../../table/mainTable';
import { getAllTableInfo } from '../../store/allTable/allTableSelector';
import { createTable1} from '../../store/allTable/allTableThunk';

export default function TablesList({dbData}) {
  const dispatch= useDispatch();
  const params = useParams();

  const AllTableInfo = useSelector((state) => getAllTableInfo(state));


  const [value, setValue] = useState(params?.tableName || Object.keys(AllTableInfo.tables)[0]);  
  const navigate =useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
    const tableNames = Object.keys(AllTableInfo.tables);
    const selectedTableName = tableNames[newValue];
    navigate(`/db/${dbData?.db?._id}/table/${selectedTableName}`);
  };
  const [table, setTable] = useState();
  const [tabIndex,setTabIndex]= useState(-1);
  const [open, setOpen] = useState(false);
  const [openn,setOpenn] = useState(false)
  const [filter,setFilter]=useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenn = () => setOpenn(true);

  const saveTable = async () => {
    const data = {
      tableName: table
    }
    setOpen(false);
    dispatch(createTable1({"dbId":dbData?.db?._id,"data":data}));
    
  };
  function onFilterClicked(filter) {
    dispatch(bulkAddColumns({
      "dbId": dbData?.db?._id,
      "tableName": params?.tableName || Object.keys(dbData?.db?.tables)[0],
      "filter": filter
    }));
  }
  useEffect(() => {
    if(dbData?.db?.tables)
    {
      const tableNames = Object.keys(dbData.db.tables);
      const activeTabIndex = params.tableName
        ? tableNames.indexOf(params.tableName)
        : 0;

        // setTabIndex(activeTabIndex);
        setValue(activeTabIndex);
      
        dispatch(bulkAddColumns({
          "dbId":dbData?.db?._id,
          "tableName": params?.tableName|| Object.keys(dbData?.db?.tables)[0]
        }));
        // if(!(params?.tableName))
        // navigate(`/db/${dbData?.db?._id}/table/${tableNames[activeTabIndex]}}`);   
    }
  }, [dbData,dispatch, params.tableName, setValue])

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
          {AllTableInfo.tables && Object.entries(AllTableInfo.tables).map((table, index) => (
            <Box key={index} >
              {console.log()}
              <SingleTable filter={filter} setFilter = {setFilter} table={table} tabIndex={tabIndex}  setTabIndex={setTabIndex}  index={index} dbData={dbData} highlightActiveTable={()=>setValue(params.tableName)}/>
            </Box>
            ))
          }
          </Tabs>
        </Box>
        <Button onClick={() => handleOpen()} variant="contained" sx={{ width: 122 }} >
          Add Table
        </Button>                 
        </Box>
        <Box display="flex" flexWrap="nowrap">
        {filter  &&
          Object.entries(filter).map((filter, index) => (
            <Box key={index} marginRight={1}>
              <Button
                onClick={() => {
                  
                  onFilterClicked(filter[1].query);
                }}
                variant="contained"
                color="primary"
              >
                {filter[0]}
              </Button>
            </Box>
          ))}
      </Box>
        <Button onClick={() => handleOpenn()} variant="contained" sx={{ width: 122 }} >
          addFilter
        </Button> 
        <PopupModal title="create table" label="Table Name" open={open} setOpen={setOpen} submitData={saveTable} setVariable={setTable} />
        <FilterModal open={openn} setOpen={setOpenn} dbId={dbData?.db?._id} tableName={params?.tableName}/>
        
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