import React, {useState} from 'react'
import PropTypes from "prop-types";
import { Box, TextField, Tab, Button, ClickAwayListener } from '@mui/material';
import Dropdown from '../dropdown';
// import {updateTable, deleteTable } from '../../api/tableApi';
import { bulkAddColumns } from '../../store/table/tableThunk';
import { useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { removeTableThunk, renameTableThunk } from '../../store/allTable/allTableThunk';
import { resetData } from '../../store/table/tableSlice';
// import { selectOrgandDb } from "../../store/database/databaseSelector";
// import { uploadCSV } from '../../api/rowApi';


export default function SingleTable({ dbData, table, setTabIndex,tableLength, index, tabIndex,highlightActiveTable,value ,setPage}) {
  const navigate = useNavigate();
  const [tableNa, setTableNa] = useState(null);
  const [, setTableButton] = useState(false);
  const [name, setName] = useState();
  // const alldb = useSelector((state) => selectOrgandDb(state))
  
 
  const dispatch = useDispatch();
  const TabWithDropdown = ({ label, dropdown }) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tab label={label.length > 10 ? (
        <> {`${label.slice(0, 10)}...`}
          {dropdown}
        </>) : (
        <>
          {label}
          {dropdown}
        </>
      )}
        sx={{
          minWidth: 'auto',
          overflowX: 'auto',
          flexDirection: 'row',
          textTransform: 'none' 
        }}
        title={label}
      />
    </Box>
  );


  const renameTableName = async (db_id, tableName) => {
    const data1 = {
      newTableName: tableNa || table[0]
    };
    dispatch(renameTableThunk({ "dbId": dbData?.db?._id, "tableName": tableName, "data1": data1 }));
    setTableNa(null);
  };

  const deleteTableName = async (tableid) => {

    if(Object.keys(dbData?.db?.tables).length >=2){
      dispatch(removeTableThunk({ "dbId": dbData?.db?._id, "tableid": tableid }));
    } 

    const previousIndex = value - 1;
    navigate(`/db/${dbData.db._id}/table/${Object.keys(dbData?.db?.tables)[previousIndex]}`);
    
  };
  function onTableClicked() {
    navigate(`/db/${dbData?.db?._id}/table/${table[0]}`);
    setPage(1);
    dispatch (resetData())
    dispatch(bulkAddColumns({
      //  "alldb":alldb,
      "dbId": dbData?.db?._id,
      "tableName": table[0],
      "pageNo":1
    }));

    setTableButton(true);
    highlightActiveTable()
  }

  return (
    <>
      <Box
        sx={{
          p: '2.5px',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          backgroundColor: '#fff',
          textAlign: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transition: 'transform 0.2s ease-in-out',
        }}

        onClick={() => {
          onTableClicked(table[0])

          
        }}
      >

        {name && tabIndex == index ?
         
         (<>
            <ClickAwayListener onClickAway={() => { setName(false) }} >
              <Box>
                <TextField
                  // onBlur={handleOpen}
                  defaultValue={table[1]?.tableName || table[0]}
                  autoFocus sx={{ width: 75, fontWeight: 'bold' }} value={tableNa}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      renameTableName(dbData?.db?._id, table[0]);
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
                    mt: 1 
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
            {tableLength>=2 ?< Box sx={{ mt: -1 }}>
              {<TabWithDropdown sx={{ width: 100 }}
                label={table[1]?.tableName || table[0]}
                dropdown={<Dropdown setTabIndex={setTabIndex}
                  tables={dbData?.db?.tables} tableId={table[0]} title={table[1]?.tableName || table[0]} tabIndex={index}
                  first="Rename" second="Delete" third="Upload csv" idToDelete={dbData?.db?._id}
                  deleteFunction={deleteTableName} setName={setName} />}
              />}
            </Box>:
              < Box sx={{ mt: -1 }}>
              {<TabWithDropdown sx={{ width: 100 }}
                label={table[1]?.tableName || table[0]}
                dropdown={<Dropdown setTabIndex={setTabIndex}
                  tables={dbData?.db?.tables} tableId={table[0]} title={table[1]?.tableName || table[0]} tabIndex={index}
                  first="Rename" idToDelete={dbData?.db?._id}
                  deleteFunction={deleteTableName} setName={setName} />}
              />}
            </Box>
            }
          </>)
        }
      </Box>
    </>

  )
}
SingleTable.propTypes = {
  dbData: PropTypes.any,
  table: PropTypes.array,
  dbId: PropTypes.string,
  label: PropTypes.any,
  dropdown: PropTypes.any,
  getAllTableName: PropTypes.func,
  highlightActiveTable: PropTypes.func,
  index: PropTypes.number,
  tabIndex: PropTypes.number,
  setTabIndex: PropTypes.func,
  tableLength:PropTypes.any,
  value:PropTypes.any,
  setPage:PropTypes.any
};