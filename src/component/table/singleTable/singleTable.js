import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Box, TextField, Tab, Button, ClickAwayListener } from '@mui/material';
import Dropdown from '../../dropdown';
import { bulkAddColumns } from '../../../store/table/tableThunk';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeTable1, updateTable1 } from '../../../store/allTable/allTableThunk';
import { resetData } from '../../../store/table/tableSlice';
import { deleteTable, exportCSV } from '../../../api/tableApi';
import { selectActiveUser } from '../../../store/user/userSelector.js';
import { toast } from 'react-toastify';

import './singleTable.scss';

export default function SingleTable({ dbData, table, setTabIndex, tableLength, index, tabIndex, setPage }) {
  const navigate = useNavigate();
  const [tableNa, setTableNa] = useState(null);
  const [name, setName] = useState();
  const AllTableInfo = useSelector((state) => state.tables.tables);
  const userDetails = useSelector((state) => selectActiveUser(state));

  const dispatch = useDispatch();

  const TabWithDropdown = ({ label, dropdown }) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tab
        label={
          label.length > 10 ? (
            <>
              {`${label.slice(0, 10)}...`}
              {dropdown}
            </>
          ) : (
            <>
              {label}
              {dropdown}
            </>
          )
        }
        sx={{
          minWidth: 'auto',
          overflowX: 'auto',
          flexDirection: 'row',
          textTransform: 'none',
          height: '10px'
        }}
        title={label}
      />
    </Box>
  );

  const renameTableName = async (db_id, tableName) => {
    const data1 = {
      newTableName: tableNa !== null ? tableNa : table[0]
    };
    if (tableName === data1.newTableName) {
      return;
    }
    dispatch(updateTable1({ "dbId": dbData?.db?._id, "tableName": tableName, "data1": data1 }));
    setTableNa(null);
  };

  const deleteTableName = async (tableid) => {
    const keys = Object.keys(AllTableInfo);
    let i = 0;
    for (; i < keys.length; i++) {
      if (keys[i] === tableid) {
        break;
      }
    }
    i = (i === keys.length - 1) ? 0 : i + 1;
    let last = keys[i];

    const deleteTableData = await deleteTable(dbData?.db?._id, tableid);
    dispatch(removeTable1({ "tableData": deleteTableData?.data?.data?.tables }));
    navigate(`/db/${dbData.db._id}/table/${last}`);
  };

  const exportCSVTable = async (tableid) => {
    const data = {
      query: `select * from ${tableid}`,
      userName: userDetails?.fullName,
      email: userDetails?.email
    };
    await exportCSV(dbData?.db?._id, tableid, data);
    toast.success("Your CSV file has been mailed successfully");
  };

  function onTableClicked() {
    navigate(`/db/${dbData?.db?._id}/table/${table[0]}`);
    setPage(1);
    dispatch(resetData());
    dispatch(bulkAddColumns({
      "dbId": dbData?.db?._id,
      "tableName": table[0],
      "pageNo": 1,
    }));
  }

  const location = useLocation();
  

  return (
    <>
      <Box
        className={`single-table ${location.pathname.includes(`table/${table[0]}`) ? 'active' : ''}`}
        onClick={() => {
          onTableClicked(table[0]);
        }}
      >
        {name && tabIndex === index ? (
          <>
            <ClickAwayListener onClickAway={() => { setName(false) }}>
              <Box>
                <TextField
                  defaultValue={table[1]?.tableName || table[0]}
                  autoFocus
                  sx={{ width: 75, fontWeight: 'bold' ,backgroundColor: 'white'}}
                  value={tableNa}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      renameTableName(dbData?.db?._id, table[0]);
                      setName(false);
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={(e) => { setTableNa(e.target.value) }}
                  size="small"
                />
                <Button
                  sx={{
                    width: 2,
                    fontSize: 8,
                    mt: 1
                  }}
                  type='submit'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setName(false);
                    renameTableName(dbData?.db?._id, table[0]);
                    
                  }}
                  variant="contained"
                  className="mui-button"
                 // style={{color:'white'}}
                  
                >
                  Rename
                </Button>
              </Box>
            </ClickAwayListener>
          </>
        ) : (
          <>
            {tableLength >= 2 ? (
              <Box sx={{ mt: -1 }}>
                <TabWithDropdown
                  sx={{ width: 100 }}
                  
                  label={table[1]?.tableName || table[0]}
                  dropdown={
                    <Dropdown
                      setTabIndex={setTabIndex}
                      tables={dbData?.db?.tables}
                      tableId={table[0]}
                      title={table[1]?.tableName || table[0]}
                      tabIndex={index}
                      first="Rename"
                      second="Delete"
                      exportCSV="Export CSV"
                      idToDelete={dbData?.db?._id}
                      deleteFunction={deleteTableName}
                      setName={setName}
                      exportCSVTable={exportCSVTable}
                    />
                  }
                />
              </Box>
            ) : (
              <Box sx={{ mt: -1 }}>
                <TabWithDropdown
                
                  sx={{ width: 100 }}
                  label={table[1]?.tableName || table[0]}
                  dropdown={
                    <Dropdown
                      setTabIndex={setTabIndex}
                      tables={dbData?.db?.tables}
                      tableId={table[0]}
                      title={table[1]?.tableName || table[0]}
                      tabIndex={index}
                      first="Rename"
                      second=""
                      exportCSV="Export CSV"
                      idToDelete={dbData?.db?._id}
                      deleteFunction={deleteTableName}
                      setName={setName}
                      exportCSVTable={exportCSVTable}
                    />
                  }
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
}

SingleTable.propTypes = {
  dbData: PropTypes.any,
  table: PropTypes.array,
  setTabIndex: PropTypes.func,
  tableLength: PropTypes.any,
  index: PropTypes.number,
  tabIndex: PropTypes.number,
  setPage: PropTypes.any,
  label: PropTypes.string,       
  dropdown: PropTypes.node,      
};
