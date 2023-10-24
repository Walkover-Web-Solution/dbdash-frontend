import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import ShareLinkPopUp from "../ShareLinkPopUp/ShareLinkPopUp"
import { Box, Button, Tabs, IconButton, Menu, MenuItem, CircularProgress, } from "@mui/material";
import PopupModal from "../../popupModal/popupModal";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FilterModal from "../../filterPopup/filterPopUp";
import PropTypes from "prop-types";
import SingleTable from "../singleTable/singleTable";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { bulkAddColumns, filterData } from "../../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import MainTable from "../../../table/mainTable";
import { createTable1 } from "../../../store/allTable/allTableThunk";
import AddFilterPopup from "../../addFilterPopup/addFIlterPopup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteFilter } from "../../../api/filterApi";
import { setTableLoading } from "../../../store/table/tableSlice";
import { setAllTablesData } from "../../../store/allTable/allTableSlice";
import { createTable, exportCSV } from "../../../api/tableApi";
import "./tablesList.scss";
import variables from "../../../assets/styling.scss";
import { createViewTable } from "../../../api/viewTableApi";
import ManageFieldDropDown from "../manageFieldDropDown/manageFieldDropDown";
import { toast } from "react-toastify";
import   {  customUseSelector }  from "../../../store/customUseSelector";


 function TablesList({ dbData }) {
  const shareViewUrl = process.env.REACT_APP_API_BASE_URL;
  const isTableLoading = customUseSelector((state) => state.table?.isTableLoading);
  const AllTableInfo = customUseSelector((state) => state.tables.tables);
  const dispatch = useDispatch();
  const params = useParams();

  const navigate = useNavigate();
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [openn, setOpenn] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenn = () => setOpenn(true);
  const [edit, setEdit] = useState(false);
  const buttonRef = useRef(null);
  const [filterId, setFilterId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [link, setLink] = useState("Link");
  const [minimap, setMinimap] = useState(false);
  const AllTable = customUseSelector((state) => {
    const { tables } = state.tables;
    const { dbId, userAcess, userDetail } = state.tables;
    return { tables, dbId, userAcess, userDetail };
  });
  const [openManageField, setOpenManageField] = useState(false);
  
    const fullName=customUseSelector((state) => state.user.userFirstName+" "+state.user.userLastName);
   const email=customUseSelector((state) => state.user.userEmail)
  
  const handleClick = (event, id) => {
    if (id === "share") {
      setShareLinkOpen(true);
    } else {
      setFilterId(id);
      setAnchorEl(event.currentTarget);
    }
  };
  const underLine=useMemo(()=>{

    if (!params?.filterName) return null;
      dispatch(
        filterData({
          filterId: params?.filterName,
          tableId: params?.tableName,
          filter:
            AllTableInfo[params?.tableName]?.filters[params?.filterName]?.query,
          dbId: dbData?.db?._id,
        })
      );
      return params?.filterName;
  },[params?.filterName])
  const handleClickOpenManageField = () => {
    setOpenManageField(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const saveTable = async (table_name) => {
    const data = {
      tableName: table_name,
    };
    setOpen(false);
    const apiCreate = await createTable(dbData?.db?._id, data);

    await dispatch(createTable1({ tables: apiCreate?.data?.data?.tables }));
    const matchedKey = Object.keys(apiCreate?.data?.data?.tables).find(
      (key) => {
        return apiCreate?.data?.data?.tables[key].tableName === table_name;
      }
    );
    if (matchedKey) {
      navigate(`/db/${dbData?.db?._id}/table/${matchedKey}`);
    }

  
  };

  const handleEdit = async () => {
    if (params?.filterName) {
      setOpenn(true);
      setEdit(true);
    } else {
      setEdit(false);
      setOpenn(false);
      toast.warning("choose the filter First");
    }
  };
  
  function onFilterClicked(filter, id) {
   
    setFilterId(params?.filterName || id);
    if (params?.filterName == id) {
      dispatch(
        filterData({
          filterId: id,
          tableId: params?.tableName,
          filter: filter,
          dbId: dbData?.db?._id,
        })
      );
    }

    navigate(`/db/${dbData?.db?._id}/table/${params?.tableName}/filter/${id}`);
  }
  const deleteFilterInDb = async () => {
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
        orgId: deletedFilter.data.data.org_id,
      })
    );
    dispatch(
      bulkAddColumns({
        dbId: dbData?.db?._id,
        tableName: params?.tableName,
        org_id: dbData?.db?.org_id,
        pageNo: 1
      })
    );
    navigate(`/db/${dbData?.db?._id}/table/${params?.tableName}`);
  };
  useEffect(() => {
    const tableNames = Object.keys(dbData?.db?.tables)||[];
    dispatch(setTableLoading(true));
    if (params?.tableName && !params?.filterName) {

      dispatch(
        bulkAddColumns({
          dbId: dbData?.db?._id,
          tableName: params?.tableName || tableNames[0],
          pageNo: 1,
        })
      );
    }
    
    if (!params?.tableName) {
      navigate(`/db/${dbData?.db?._id}/table/${tableNames[0]}`,{replace:true});  // author: rohitmirchandani, replace the current page to fix navigation
    }
  }, [params?.tableName]);
 
  const handleAddView = async()=>{
    handleOpenn();
    setEdit(false);
  }
  const shareLink = async () => {
    const isViewExits =
      AllTable?.tables?.[params?.tableName]?.filters?.[params?.filterName]
        ?.viewId;
    if (isViewExits) {
      setLink(shareViewUrl + `/${isViewExits}`);
      return;
    }
    
    const data = {
      tableId: params?.tableName,
      filterId: params?.filterName,
    };
    const dataa1 = await createViewTable(AllTable.dbId, data);
    dispatch(
      setAllTablesData({
        dbId: dataa1.data.data.dbData._id,
        tables: dataa1.data.data.dbData.tables,
        orgId: dataa1.data.data.dbData.org_id,
      })
    );
    setLink(shareViewUrl + `/${dataa1.data.data.viewId}`);
  };
  const exportCSVTable = async () => {
    const query = AllTableInfo?.[params?.tableName].filters?.[filterId].query;
    const data = {
      query: query,
      userName: fullName,
      email: email,
      filterId: filterId,
    };
    await exportCSV(dbData?.db?._id, params?.tableName, data);
    toast.success("Your CSV file has been mailed successfully");
  };
  return (
    <>
      <div className="tableslist">
        <Box className="tables-list-container">
          <Box className="tabs-container">
            <Tabs
              value={0}
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              className={`tabs`}
              variant="scrollable"
              scrollButtons={false}
              aria-label="scrollable auto tabs example"
            >
              {AllTableInfo &&
                Object.entries(AllTableInfo).map((table, index) => (
                  <SingleTable
                    table={table}
                    index={index}
                    dbData={dbData}
                    setPage={setPage}
                    key={index}
                  />
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
        <Box className="tableList-add-view">
          <div className="tableList-div-1">
            <div
              className="tableList-div-2"
             
            >
              {AllTableInfo[params?.tableName]?.filters &&
                Object.entries(AllTableInfo[params?.tableName]?.filters).map(
                  (filter, index) => (
                    <Box key={index} className="custom-box">
                      <Box
                        className="filter-box"
                        onClick={() => {
                          onFilterClicked(
                            filter[1].query,
                            filter[0],
                            filter[1]
                          );
                        }}
                        sx={{
                          backgroundColor:
                            underLine === filter[0]
                              ? variables.highlightedfilterboxcolor
                              : variables.filterboxcolor,
                             
                        }}
                        variant="outlined"
                      >
                        <div
                          className="tableList-div-3"
                         
                        >
                          {filter[1]?.filterName.length > 10
                            ? `${filter[1]?.filterName.slice(0, 6)}...`
                            : filter[1]?.filterName}
                        </div>
                                            <IconButton onClick={(e) =>{
                                              e.stopPropagation();
                                              handleClick(e, filter[0])}}>
                          <MoreVertIcon className="moreverticon" />
                        </IconButton>
                        

                      </Box>
                    </Box>
                  )
                )}
            </div>
          </div>
          <Button
            // onClick={() => handleOpenn()}
            onClick={()=>{handleAddView()}}
            variant="outlined"
            ref={buttonRef}
            className="mui-button-outlined filter-button custom-button-add-view"
          >
            Add View
          </Button>
        </Box>
        {openn && !edit && (
          <FilterModal
            dbData={dbData}
            buttonRef={buttonRef}
            open={openn}
            edit={edit}
            setEdit={setEdit}
            setOpen={setOpenn}
            filterId={filterId}
            dbId={dbData?.db?._id}
            tableName={params?.tableName}
          />
        )}
        <div className="tableList-div-4">
          <div
            className="tableList-div-5"
            style={{
              width: params.filterName
                ? `${(window.screen.width * 30) / 100}px`
                : `${(window.screen.width * 15) / 100}px`,
            }}
          >
            <Button
              className="tableList-buttons"
              onClick={handleClickOpenManageField}
            >
              Manage Fields
            </Button>

            <Button
              className="tableList-buttons"
              onClick={() => setMinimap(!minimap)}
            >
              Minimap{" "}
              {!minimap ? (
                <CheckBoxOutlineBlankIcon fontSize={variables.iconfontsize2}/>
              ) : (
                <CheckBoxIcon fontSize={variables.iconfontsize1} />
              )}
            </Button>
            {params?.filterName && (
              <Button className="tableList-buttons" onClick={handleEdit}>
                Edit filter
              </Button>
            )}
            {params?.filterName && (
              <Button
                className="tableList-buttons"
                onClick={(e) => {
                  handleClick(e, "share");
                  shareLink();
                }}
              >
                Share View
              </Button>
            )}
          </div>
        </div>
        {openManageField && (
          <ManageFieldDropDown
            openManageField={openManageField}
            setOpenManageField={setOpenManageField}
          />
        )}
        {open && (
          <PopupModal
            title="Create Table"
            label="Table Name"
            open={open}
            setOpen={setOpen}
            submitData={saveTable}
            joiMessage={"Table name"}
          />
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
        >
          <MenuItem
            onClick={() => {
              exportCSVTable();
              handleClose();
            }}
          >
            Export CSV
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteFilterInDb();
              handleClose();
            }}
            className="delete-color"
           
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
      {openn && edit && (
        <AddFilterPopup
          dbData={dbData}
          open={openn}
          edit={edit}
          setEdit={setEdit}
          setOpen={setOpenn}
          filterId={params?.filterName}
          dbId={dbData?.db?._id}
          tableName={params?.tableName}
        />
      )}
      {shareLinkOpen && (
        <ShareLinkPopUp
          title="Share Link"
          open={shareLinkOpen}
          setOpen={setShareLinkOpen}
          label="Link"
          textvalue={link}
        />
      )}
      <div style={{ marginTop: "250px" }}>
     
        {isTableLoading ? (
          <div className="table-loading"> <CircularProgress className="table-loading" /></div>
        ) : (
          <div>
            <MainTable setPage={setPage} page={page} minimap={minimap} />
          </div>
        )}
      </div>
    </>
  );
}
export default memo(TablesList);
TablesList.propTypes = {
  dbData: PropTypes.any,
  table: PropTypes.string,
  dbId: PropTypes.string,
  orgId: PropTypes.string,
  tables: PropTypes.any,
  dropdown: PropTypes.any,
  setSelectedTable: PropTypes.any,
  label: PropTypes.any,
  setTables: PropTypes.any,
};