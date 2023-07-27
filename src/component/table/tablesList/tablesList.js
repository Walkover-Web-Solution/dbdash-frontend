import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import ShareLinkPopUp from "../ShareLinkPopUp/ShareLinkPopUp";
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
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FilterModal from "../../filterPopup/filterPopUp";
import PropTypes from "prop-types";
import SingleTable from "../singleTable/singleTable";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { bulkAddColumns, filterData } from "../../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import MainTable from "../../../table/mainTable";
import AddFilterPopup from "../../addFilterPopup/addFIlterPopup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteFilter } from "../../../api/filterApi";
import { setTableLoading } from "../../../store/table/tableSlice";
import { setAllTablesData } from "../../../store/allTable/allTableSlice";
import { exportCSV } from "../../../api/tableApi";
import "./tablesList.scss";
import variables from "../../../assets/styling.scss";
import ManageFieldDropDown from "../manageFieldDropDown/manageFieldDropDown";
import { toast } from "react-toastify";
import { customUseSelector } from "../../../store/customUseSelector";
function TablesList({ dbData }) {
  const isTableLoading = customUseSelector(
    (state) => state.table?.isTableLoading
  );
  const dispatch = useDispatch();
  const params = useParams();
  const AllTableInfo = customUseSelector((state) => state.tables.tables);

  const navigate = useNavigate();
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [openn, setOpenn] = useState(false);
  const [filteropen, setFilteropen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenn = () => setOpenn(true);
  // const [edit, setEdit] = useState(false);
  const buttonRef = useRef(null);
  const [filterId, setFilterId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTable, setcurrentTable] = useState(null);
  const [minimap, setMinimap] = useState(false);
  const [openManageField, setOpenManageField] = useState(false);

  const fullName = customUseSelector(
    (state) => state.user.userFirstName + " " + state.user.userLastName
  );
  const email = customUseSelector((state) => state.user.userEmail);

  const handleClick = (event, id) => {
    if (id === "share") {
      setShareLinkOpen(true);
    } else {
      setFilterId(id);
      setcurrentTable(id);
      setAnchorEl(event.currentTarget);
    }
  };
  const underLine = useMemo(() => {
    if (params?.filterName) {
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
    } else {
      return null;
    }
  }, [params?.filterName]);
  const handleClickOpenManageField = () => {
    setOpenManageField(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = async () => {
    setFilteropen(true);
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
        orgId: deletedFilter.data.data.org_id,
      })
    );
    dispatch(
      bulkAddColumns({
        dbId: dbData?.db?._id,
        tableName: params?.tableName,
        org_id: dbData?.db?.org_id,
        pageNo: 1,
      })
    );
    navigate(`/db/${dbData?.db?._id}/table/${params?.tableName}`);
  };
  useEffect(() => {
    const tableNames = Object.keys(dbData?.db?.tables) || [];
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
      navigate(`/db/${dbData?.db?._id}/table/${tableNames[0]}`);
    }
  }, [params?.tableName]);

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
            <div className="tableList-div-2">
              {AllTableInfo[params?.tableName]?.filters &&
                Object.entries(AllTableInfo[params?.tableName]?.filters).map(
                  (filter, index) => (
                    <Box key={index} className="custom-box">
                      <Box
                        className="filter-box"
                        style={{
                          backgroundColor:
                            underLine === filter[0]
                              ? variables.highlightedfilterboxcolor
                              : variables.filterboxcolor,
                        }}
                        variant="outlined"
                      >
                        <div
                          className="tableList-div-3"
                          onClick={() => {
                            onFilterClicked(
                              filter[1].query,
                              filter[0],
                              filter[1]
                            );
                          }}
                        >
                          {filter[1]?.filterName.length > 10
                            ? `${filter[1]?.filterName.slice(0, 6)}...`
                            : filter[1]?.filterName}
                        </div>
                        <IconButton onClick={(e) => handleClick(e, filter[0])}>
                          <MoreVertIcon className="moreverticon" />
                        </IconButton>
                      </Box>
                    </Box>
                  )
                )}
            </div>
          </div>
          <Button
            onClick={() => handleOpenn()}
            variant="outlined"
            ref={buttonRef}
            className="mui-button-outlined filter-button custom-button-add-view"
          >
            Add View
          </Button>
        </Box>
        {openn && (
          <FilterModal
            dbData={dbData}
            buttonRef={buttonRef}
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
                <CheckBoxOutlineBlankIcon fontSize={variables.iconfontsize2} />
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
                  // shareLink();
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
        {open && <PopupModal open={open} setOpen={setOpen} dbData={dbData} />}

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
              deleteFilterInDb(currentTable);
              handleClose();
            }}
            className="delete-color"
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
      {filteropen && (
        <AddFilterPopup
          dbData={dbData}
          open={filteropen}
          setOpen={setFilteropen}
          filterId={params?.filterName}
          dbId={dbData?.db?._id}
          tableName={params?.tableName}
        />
      )}
      {shareLinkOpen && (
        <ShareLinkPopUp
          open={shareLinkOpen}
          setOpen={setShareLinkOpen}
          // textvalue={link}
        />
      )}
      <div style={{ marginTop: "250px" }}>
        {isTableLoading ? (
          <div className="table-loading">
            {" "}
            <CircularProgress className="table-loading" />
          </div>
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
