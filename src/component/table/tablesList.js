import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PopupModal from '../popupModal';
import { createTable, updateTable, deleteTable } from '../../api/tableApi';
import { getDbById } from '../../api/dbApi';
import PropTypes from "prop-types";
import SingleTable from './singleTable';
import {useNavigate} from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dropdown from '../dropdown';
import { bulkAddColumns } from '../../store/table/tableThunk';
import { useDispatch } from 'react-redux';
import { TextField } from '@mui/material';

export default function TablesList({dbData,tables,setTables}) {
  // const [tables, setTables] = useState(0);
  const [tabIndex, setTabIndex] = useState(-1);
  const [tableNa, setTableNa] = useState(null);
  const [name,setName] = useState();
  const dispatch= useDispatch();
  const [value, setValue] = React.useState(0);
  
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // state to display modal
  const TabWithDropdown = ({ label, dropdown }) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tab label={label} />
      {dropdown}
    </Box>
  );
  const [table, setTable] = useState();
  const [, setTableButton] = useState(false);
  const [clickedTable, setClickedTable] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  // Object.entries(tables)[0][0]
  function onTableClicked(value) {
    navigate(`/db/${dbData?.db?._id}/table/${value}`);
    setClickedTable(value);
    setTableButton(true);
  }
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
      onTableClicked(Object.keys(tables)[0])
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
  const renameTableName = async (db_id, tableName) => {
    const data1 = {
      newTableName: tableNa || table[0]
    };
    await updateTable(db_id,tableName, data1);
    await getAllTableName(dbData?.db?._id, dbData?.db?.org_id?._id);
  };
  const deleteTableName = async (tableid) => {
    // console.log("deltetb",tableid);
    await deleteTable(dbData?.db?._id, tableid);
    await getAllTableName(dbData?.db?._id, dbData?.db?.org_id?._id);
  };
  
  return (
    <>
      <Box sx={{ width: "100%", display: "flex", height: "33px" }}>
        <Box  sx={{ display: 'flex', overflow: 'hidden', width: "100%", height: "47px"}}>
        <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
          {Object.entries(tables).map((table, index) => (
            <Box
              key={index}
              sx={{
                p: '5px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                minWidth: '175px',
                maxWidth: '200px',
                textAlign: 'center',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s ease-in-out',
              }}
              
              onClick={() =>{ onTableClicked(table[0]  )
                dispatch(bulkAddColumns({
                  "dbId":dbData?.db?._id,
                  "tableName": table[0]
                }));
              } }
            >

              {name && tabIndex == index ?
                  (<>
                    <TextField
                      // onBlur={handleOpen}
                      defaultValue ={table[1]?.tableName || table[0]}
                      autoFocus sx={{ width: 75, fontWeight: 'bold' }} value={tableNa  }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          renameTableName(dbData?.db?._id,table[0]);
                          setTabIndex(-1);
                          setName(false)
                        }
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                       
                      }}
                      onChange={(e) => { setTableNa(e.target.value) }} size="small" />
                    <Button
                      sx={{
                        width: 2,
                        fontSize: 8,
                      }}
                      type='submit' onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTabIndex(-1);
                        setName(false)
                        renameTableName(dbData?.db?._id, table[0])
                      }}
                      variant="contained" >
                      Rename
                    </Button>
                  </>) :
                  (<>
                    < Box sx={{ mt: -1 }}>
                      <TabWithDropdown
                       label={table[1]?.tableName || table[0]}
                        dropdown={<Dropdown tableId={table[0]} title={table[1]?.tableName || table[0]} 
                        tabIndex={index} setTabIndex={setTabIndex} 
                        first="Rename" second="Delete" idToDelete={dbData?.db?._id}
                          deleteFunction={deleteTableName} setName={setName} />}
                      />
                    </Box>
                  </>)
                }
              </Box>
            ))}
          </Tabs>
        </Box>
        <Button onClick={() => handleOpen()} variant="contained" sx={{ width: 122 }} >
          Add Table
        </Button> </Box>
              {/* <TabWithDropdown
      label={table[1]?.tableName || table[0]}
      dropdown={<Dropdown />}
    />
            </Box>
          ))}
          </Tabs>
        </Box>
        <Button onClick={handleOpen} variant="contained" sx={{width:122}} >
          Add Table
        </Button> </Box> */}
        <PopupModal title="create table" label="Table Name" open={open} setOpen={setOpen} submitData={saveTable} setVariable={setTable} />
      <Box>
          <SingleTable  table={clickedTable} />
      </Box>
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