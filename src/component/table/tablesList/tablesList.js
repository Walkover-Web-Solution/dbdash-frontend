import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Tabs,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import PopupModal from "../../popupModal/popupModal";
import FilterModal from "../../filterPopUp/filterPopUp";
import PropTypes from "prop-types";
import SingleTable from "../singleTable/singleTable";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { bulkAddColumns } from "../../../store/table/tableThunk";
import { useDispatch, useSelector } from "react-redux";
import MainTable from "../../../table/mainTable/mainTable";
import { createTable1 } from "../../../store/allTable/allTableThunk";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteFilter } from "../../../api/filterApi";
import { setTableLoading } from "../../../store/table/tableSlice";
import { setAllTablesData } from "../../../store/allTable/allTableSlice";
import './tablesList.css'
// import { uploadCSV } from '../../api/rowApi';

export default function TablesList({ dbData }) {
  const isTableLoading = useSelector((state) => state.table?.isTableLoading);
  // const columns=useSelector((state)=>state.table?.columns);
  const dispatch = useDispatch();
  const params = useParams();
  const AllTableInfo = useSelector((state) => state.tables.tables);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  // const [CSV,setCSV] = useState([])
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

  const handleClick = (event) => {
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

    dispatch(createTable1({ dbId: dbData?.db?._id, data: data }));
  };

  const handleEdit = async () => {
    setEdit(true);
    setOpenn(true);
  };
  // const submitCSV = async()=>{
  //   const data = {
  //     csvfile:CSV
  //   }
  //   const csv = await uploadCSV("6427e76425f1f4ba2e3e7af8","tblo8jw0t",data)
  // }
  function onFilterClicked(filter, id) {
    setFilterId(id);
    dispatch(
      bulkAddColumns({
        dbId: dbData?.db?._id,
        tableName: params?.tableName || Object.keys(dbData?.db?.tables)[0],
        filter: filter,
        org_id: dbData?.db?.org_id,
        pageNo: 1,
      })
    );
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
  };

  useEffect(() => {
    if (dbData?.db?.tables) {
      const tableNames = Object.keys(dbData.db.tables);
      dispatch(setTableLoading(true));

      dispatch(
        bulkAddColumns({
          dbId: dbData?.db?._id,
          tableName: params?.tableName || tableNames[0],
          pageNo: 1,
        })
      );

      if (!params?.tableName) {
        navigate(`/db/${dbData?.db?._id}/table/${tableNames[0]}`);
      }
      setValue(
        tableNames?.indexOf(params?.tableName) !== -1
          ? tableNames?.indexOf(params?.tableName)
          : 0
      );
    }
  }, []);

  return (
    <>
      <Box
      className="boxone"
       
      >
        <Box
          className="boxtwo"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {AllTableInfo &&
              Object.entries(AllTableInfo).map((table, index) => (
                <Box key={index} className="h57">
                  <SingleTable
                    table={table}
                    tableLength={tableLength}
                    tabIndex={tabIndex}
                    setTabIndex={setTabIndex}
                    index={index}
                    dbData={dbData}
                    highlightActiveTable={() => setValue(index)}
                    value={value}
                    setPage={setPage}
                  />
                </Box>
              ))}
          </Tabs>
          <Button
            variant="outlined"
            onClick={() => handleOpen()}
            className="buttonone"
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Box  display="flex" flexWrap="nowrap">
        {AllTableInfo[params?.tableName]?.filters &&
          Object.entries(AllTableInfo[params?.tableName]?.filters).map(
            (filter, index) => (
              <Box key={index} sx={{ mt: 2, ml: 1 }}>
                <Box
                className="filters"
                  
                  onClick={() => {
                    onFilterClicked(filter[1].query, filter[0]);
                  }}
                  variant="contained"
                  color="primary"
                >
                  {filter[1]?.filterName}
                  <IconButton onClick={(e) => handleClick(e)}>
                    <MoreVertIcon className="white" />
                  </IconButton>
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
                        deleteFilterInDb(filter[0]);
                        handleClose();
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            )
          )}

        <Button
          onClick={() => handleOpenn()}
          variant="contained"
          className="buttontwo"
         
        >
          Add Filter
        </Button>
        <div>
          {/* <input
              type="file"
              id="my-file-input"
              onChange={(e)=>{setCSV(e.target.files[0])}}
            />
        <Button onClick={()=>{submitCSV()}}>Submit</Button> */}
        </div>
      </Box>
      {open && (
        <PopupModal
          title="create table"
          label="Table Name"
          open={open}
          setOpen={setOpen}
          submitData={saveTable}
          setVariable={setTable}
        />
      )}
      {openn && (
        <FilterModal
          open={openn}
          edit={edit}
          setOpen={setOpenn}
          filterId={filterId}
          dbId={dbData?.db?._id}
          tableName={params?.tableName}
        />
      )}
      {isTableLoading ? (
        <CircularProgress />
      ) : (
        <>
          <MainTable setPage={setPage} page={page} />
        </>
      )}
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
