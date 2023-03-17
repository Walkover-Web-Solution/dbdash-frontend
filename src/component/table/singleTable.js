import React, {useState} from 'react'
import PropTypes from "prop-types";
import { Box, TextField, Tab,Button, ClickAwayListener} from '@mui/material';
import Dropdown from '../dropdown';
import {updateTable, deleteTable } from '../../api/tableApi';
import { bulkAddColumns } from '../../store/table/tableThunk';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function SingleTable({dbData,table,setTabIndex,getAllTableName,index,tabIndex,highlightActiveTable}) {
  const navigate = useNavigate();
  
  const [tableNa, setTableNa] = useState(null);
  const [, setTableButton] = useState(false);
  const [name,setName] = useState();

  const dispatch= useDispatch();
 

  const TabWithDropdown = ({ label, dropdown }) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tab label={label} />
      {dropdown}
    </Box>
  );

  const renameTableName = async (db_id, tableName) => {
    const data1 = {
      newTableName: tableNa || table[0]
      
    };
    await updateTable(db_id,tableName, data1);
    await getAllTableName(dbData?.db?._id, dbData?.db?.org_id?._id);
    setTableNa(null);
  };
  const deleteTableName = async (tableid) => {
    await deleteTable(dbData?.db?._id, tableid);
    await getAllTableName(dbData?.db?._id, dbData?.db?.org_id?._id);
  };
  function onTableClicked() {
    navigate(`/db/${dbData?.db?._id}/table/${table[0]}`);
    dispatch(bulkAddColumns({
      "dbId":dbData?.db?._id,
      "tableName": table[0]
    }));
    setTableButton(true);
    highlightActiveTable()
  }

  return (
    <> 
    <Box
              sx={{
                p: '5px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                // minWidth: '175px',
                // maxWidth: '200px',
                width: "135px",
                textAlign: 'center',
                //textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s ease-in-out',
              }}
              
              onClick={() =>{ onTableClicked(table[0])
                dispatch(bulkAddColumns({
                  "dbId":dbData?.db?._id,
                  "tableName": table[0]
                }));
              } }
            >
              {name && tabIndex == index?
              
                  (<>
                   <ClickAwayListener onClickAway={()=>{setName(false)}} >
                   <Box>
                    <TextField
                      // onBlur={handleOpen}
                      defaultValue ={table[1]?.tableName || table[0]}
                      autoFocus sx={{ width: 75, fontWeight: 'bold' }} value={tableNa  }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          renameTableName(dbData?.db?._id,table[0]);
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
                        setName(false)
                        renameTableName(dbData?.db?._id, table[0])
                      }}
                      variant="contained" >
                      Rename
                    </Button>
                    </Box>
                      </ClickAwayListener>
                  </>) :
                  (<>
                    < Box sx={{ mt: -1 }}>
                      <TabWithDropdown sx={{width: 100}}
                       label={table[1]?.tableName || table[0]}
                        dropdown={<Dropdown  setTabIndex={setTabIndex}
                          tableId={table[0]} title={table[1]?.tableName || table[0]} tabIndex={index}
                        first="Rename" second="Delete" idToDelete={dbData?.db?._id}
                          deleteFunction={deleteTableName} setName={setName} />}
                      />
                    </Box>
                  </>)
                }
              </Box>
    </>
    
  )
}
SingleTable.propTypes = {
  dbData: PropTypes.any,
  table: PropTypes.string,
  dbId: PropTypes.string,
  label : PropTypes.any,
  dropdown:PropTypes.any,
  getAllTableName:PropTypes.func,
  highlightActiveTable:PropTypes.func,
  index:PropTypes.number,
  tabIndex:PropTypes.number,
  setTabIndex:PropTypes.func
};