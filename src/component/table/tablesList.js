import React, { useState, useEffect } from "react";
import {Box,Button,Tabs,IconButton,Menu,MenuItem,CircularProgress,} from "@mui/material";
import PopupModal from "../popupModal";
import FilterModal from "../filterPopUp";
import PropTypes from "prop-types";
import SingleTable from "./singleTable";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { bulkAddColumns } from "../../store/table/tableThunk";
import { useDispatch, useSelector } from "react-redux";
import MainTable from "../../table/mainTable";
import { createTable1 } from "../../store/allTable/allTableThunk";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteFilter } from "../../api/filterApi";
import { setTableLoading } from "../../store/table/tableSlice";
import { setAllTablesData } from "../../store/allTable/allTableSlice";
import { createTable } from "../../api/tableApi";
import './tablesList.scss'
export default function TablesList({ dbData }) {
  
  const isTableLoading = useSelector((state) => state.table?.isTableLoading);
  const dispatch = useDispatch();
  const params = useParams();
  const AllTableInfo = useSelector((state) => state.tables.tables);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [page, setPage] = useState(1);
  const [table, setTable] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [openn, setOpenn] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenn = () => setOpenn(true);
  const [edit, setEdit] = useState(false);
  const [filterId, setFilterId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const tableLength = Object.keys(AllTableInfo).length;
  const [underLine, setUnderLine] = useState(null)
  const [currentTable, setcurrentTable] = useState(null)

  const handleClick = (event, id) => {
    setcurrentTable(id)
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const saveTable = async () => {
    const data = {
      tableName: table,
    };
    
    setOpen(false);
    const apiCreate = await createTable(dbData?.db?._id, data);
    
    
    dispatch(createTable1({ tables: apiCreate.data.data.tables }));

    const matchedKey = Object.keys(apiCreate?.data?.data?.tables).find(key => {
      return apiCreate?.data?.data?.tables[key].tableName === table;
    });
    if (matchedKey) {
      navigate(`/db/${dbData?.db?._id}/table/${matchedKey}`);
    }

    const newTableIndex = Object.keys(AllTableInfo).length;
    setValue(newTableIndex);
  };

  const handleEdit = async () => {
    setEdit(true);
    setOpenn(true);
  };

  function onFilterClicked(filter, id) {
    setUnderLine(id)
    setFilterId(id);
    // setPage(1);
    dispatch(
      bulkAddColumns({
        dbId: dbData?.db?._id,
        tableName: params?.tableName || Object.keys(dbData?.db?.tables)[0],
        filter: filter,
        org_id: dbData?.db?.org_id,
        pageNo: 1,
        filterId : id,
        fields:dbData?.db?.tables[params?.tableName]?.fields 
      })
    );
    navigate(`/db/${dbData?.db?._id}/table/${params?.tableName}/filter/${id}`);
  }

  const deleteFilterInDb = async (filterId) => {
    const data = {
      filterId: filterId,
    };
    const deletedFilter = await deleteFilter(
      dbData?.db?._id,
      params?.tableName,
      data
    );
    dispatch(
      setAllTablesData({
        dbId: dbData?.db?._id,
        tables: deletedFilter.data.data.tables,
      })
    );
    dispatch(
      bulkAddColumns({
        dbId: dbData?.db?._id,
        tableName: params?.tableName,
        org_id: dbData?.db?.org_id,
        pageNo: 1,
        fields:dbData?.db?.tables[params?.tableName]?.fields

      })
    );
    navigate(`/db/${dbData?.db?._id}/table/${params?.tableName}`);
  };
  useEffect(() => {
    console.log(dbData);
 
    if (params?.filterName) {
      setUnderLine(params?.filterName)
      dispatch(
        bulkAddColumns({
          dbId: dbData?.db?._id,
          tableName: params?.tableName || Object.keys(dbData?.db?.tables)[0],
          filter: AllTableInfo[params?.tableName]?.filters[params?.filterName]?.query,
          org_id: dbData?.db?.org_id,
          pageNo: 1,
          filterId : params?.filterName,
          fields:dbData?.db?.tables[params?.tableName]?.fields         
        })
        
      );
    }
    else if (dbData?.db?.tables) {
      const tableNames = Object.keys(dbData.db.tables);
      dispatch(setTableLoading(true));
      dispatch(
        bulkAddColumns({
          dbId: dbData?.db?._id,
          tableName: params?.tableName || tableNames[0],
          pageNo: 1,
          fields:dbData?.db?.tables[params?.tableName]?.fields
        })
      );
      setValue(
        tableNames?.indexOf(params?.tableName) !== -1
          ? tableNames?.indexOf(params?.tableName)
          : 0
      );
      if (!params?.tableName) {
        navigate(`/db/${dbData?.db?._id}/table/${tableNames[0]}`);
      }

    }
  }, [params?.tableName]);
  return (
    <>
    <div className="tableslist">
      <Box className="tables-list-container">
      <Box className="tabs-container">
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{
              style: { display: "none" },
            }}
            className="tabs"
            variant="scrollable"
            scrollButtons="fixed"
            aria-label="scrollable auto tabs example"
          >
            {AllTableInfo &&
              Object.entries(AllTableInfo).map((table, index) => (
                <Box key={index} >
                  <SingleTable
                    table={table}
                    tableLength={tableLength}
                    tabIndex={tabIndex}
                    setTabIndex={setTabIndex}
                    index={index}
                    dbData={dbData}
                    setPage={setPage}
                  />
                </Box>
              ))}
          </Tabs>
          <Button
      variant="outlined"
      className="mui-button-outlined add-button"
      onClick={() => handleOpen()}
    >
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Box display="flex"  flexWrap="nowrap">
        {AllTableInfo[params?.tableName]?.filters &&
          Object.entries(AllTableInfo[params?.tableName]?.filters).map(
            (filter, index) => (
              <Box key={index} className="custom-box">
            <Box
              className="filter-box"
             
              style={{ textDecoration: underLine === filter[0] ? 'underline' : 'none' }}
              variant="outlined"
            >
              <Box  onClick={() => {
                onFilterClicked(filter[1].query, filter[0], filter[1]);
              }}>
              {filter[1]?.filterName}
              </Box>
              <IconButton onClick={(e) => handleClick(e, filter[0])}>
                <MoreVertIcon className="moreverticon" />
              </IconButton>
            </Box>
          </Box>

            )
          )}
 <Button
    onClick={() => handleOpenn()}
    variant="contained"
    className="mui-button filter-button"
  >
          Add Filter
        </Button>
      </Box>
      {open && (
        <PopupModal
          title="Create Table"
          label="Table Name"
          open={open}
          setOpen={setOpen}
          submitData={saveTable}
          setVariable={setTable}
          joiMessage={"Table name"}
        />
      )}
      {openn && (
        <FilterModal
          dbData={dbData}
          open={openn}
          edit={edit}
          setEdit={setEdit}
          setOpen={setOpenn}
          filterId={filterId}
          dbId={dbData?.db?._id}
          tableName={params?.tableName}
          setUnderLine={setUnderLine}
        />
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
      >
        <MenuItem
          onClick={() => {
            handleEdit();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteFilterInDb(currentTable);
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>

<div style={{marginTop:"25vh"}}>
      {isTableLoading ? (
      <CircularProgress className="table-loading" />
      ) : (
        <>
          <MainTable setPage={setPage} page={page} />
        </>
      )}
      </div>
    </>
  );
}
TablesList.propTypes = {
  dbData: PropTypes.any,
  table: PropTypes.string,
  dbId: PropTypes.string,
  orgId: PropTypes.string,
  tables: PropTypes.any,
  dropdown: PropTypes.any,
  label: PropTypes.any,
  setTables: PropTypes.any,
};
