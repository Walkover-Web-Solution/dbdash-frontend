/* eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Tabs, IconButton, Menu, MenuItem, CircularProgress, } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FilterModal from "../../component/filterPopUp";
import { setAllTablesData } from "../../store/allTable/allTableSlice";
import SingleTable from "../../component/table/singleTable/singleTable";
import { useParams } from "react-router-dom";
import { bulkAddColumns, filterData } from "../../store/table/tableThunk";
import { useDispatch, useSelector } from "react-redux";
import MainTable from "../../table/mainTable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setTableLoading } from "../../store/table/tableSlice";
import './templatePage.scss'
import variables from "../../assets/styling.scss";
import ManageFieldDropDown from "../../component/table/manageFieldDropDown";
import { toast } from "react-toastify";
import { getTemplate } from "../../api/templateApi";
import UseTemplatePopup from "./useTemplatePopup";
import { display } from "@mui/system";



export default function TemplatePage() {
  const isTableLoading = useSelector((state) => state.table?.isTableLoading);
  const dispatch = useDispatch();
  const params = useParams();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [page, setPage] = useState(1);
  const [table, setTable] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [openn, setOpenn] = useState(false);
  const [templateData, setTemplateData] = useState("")
  const [categoryName, setcategoryName] = useState("")
  const [templateName, setTemplateName] = useState("")
  const [description, setDescription] = useState("")
  const [tableName, setTableName] = useState("");
  const [edit, setEdit] = useState(false);
  const [tableIdForFilter, setTableIdForFilter] = useState("");
  const buttonRef = useRef(null);
  const [filterId, setFilterId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [underLine, setUnderLine] = useState(params?.filterName)
  const [minimap, setMinimap] = useState(false);
  const [openManageField, setOpenManageField] = useState(false);
  const [openUseTemplate, setOpenUseTemplate] = useState(false);
  const handleClick = (event, id) => {
    if (id === "share") {
      // setShareLinkOpen(true);
    } else {
      setFilterId(id);
      // setcurrentTable(id);
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClickOpenManageField = () => {
    setOpenManageField(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = async () => {
    if (params?.filterName) {

      setOpenn(true);
      setEdit(true);
      // setOpenFilter(true); 
    } else {
      setEdit(false);
      setOpenn(false);
      toast.error("choose the filter First");
    }
  };
  function onFilterClicked(filter, id) {
    setUnderLine(id);
    setFilterId(params?.filterName || id);
    if (params?.filterName == id) {
      dispatch(filterData({
        filterId: id,
        tableId: tableIdForFilter,
        filter: filter,
        dbId: templateData?.dbId?._id,

      }))
    }
    // navigate(`/db/${templateData?.dbId?._id}/table/${params?.tableName}/filter/${id}`);
  }

  useEffect(async () => {
    const data = await templateDataa(params?.templateId)
    const tableNames = Object.keys(data?.data?.data?.dbId?.tables);
    setTableName(tableNames[0])
    setTableIdForFilter(tableNames[0])
    dispatch(setAllTablesData({
      dbId: data?.data?.data?.dbId?._id,
      tables: data?.data?.data?.dbId?.tables,
      orgId: data?.data?.data?.dbId?.org_id
    }))
    dispatch(
      bulkAddColumns({
        dbId: data?.data?.data?.dbId?._id,
        tableName: tableNames[0],
        pageNo: 1,
      })
    );
    dispatch(setTableLoading(true));
  }, [params?.templateId]);

  useEffect(() => {
    if (params?.filterName) {
      setUnderLine(params?.filterName)
      dispatch(filterData({
        filterId: params?.filterName,
        tableId: params?.tableName,
        filter: templateData?.dbId.tables[params?.tableName]?.filters[params?.filterName]?.query,
        dbId: templateData?.dbId?._id,
      }))

    }
    else {
      setUnderLine(null);
    }
  }, [params?.filterName]);

  const templateDataa = async (templateId) => {
    const templateData = await getTemplate(templateId)
    setTemplateData(templateData?.data?.data);
    setcategoryName(templateData?.data?.data?.categoryName)
    setTemplateName(templateData?.data?.data?.name)
    setDescription(templateData?.data?.data?.description)
    setTable(templateData?.data?.data?.dbId?.tables)
    return templateData;
  }


  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div className="main-box">
        <div style={{ fontSize: '25px', display: 'flex', justifyContent: "space-between" }}>
          <div >{templateName}</div>
          <Button variant="contained" sx={{ marginRight: '-1.4vw' }} className={'mui-button'} onClick={() => { setOpenUseTemplate(true); }}>Use Template</Button>
        </div>
        <UseTemplatePopup open={openUseTemplate} categoryName={categoryName} setOpen={setOpenUseTemplate} />

        <div style={{ display: 'flex', padding: "10px", flexDirection: "row", justifyContent: "center", width: "100%" }}>
          <div style={{ width: '85vw', padding: '10px', border: '1px solid black' }}>
            <div className="tableslist1">
              <Box className="tabs-container1">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  TabIndicatorProps={{
                    style: { display: "none" },
                  }}
                  className={`tabs`}
                  variant="scrollable"
                  scrollButtons={false}
                  aria-label="scrollable auto tabs example"
                >
                  {table &&
                    Object.entries(table).map((table, index) => (
                      <SingleTable
                        table={table}
                        setTableIdForFilter={setTableIdForFilter}
                        tabIndex={tabIndex}
                        setTabIndex={setTabIndex}
                        index={index}
                        dbData={templateData?.dbId}
                        setPage={setPage}
                        key={index}
                      />
                    ))}
                </Tabs>

              </Box>
              <Box sx={{ display: "flex", flexDirection: 'row', width: '100%', overflowX: 'auto' }}   >
                {templateData?.dbId?.tables[tableIdForFilter]?.filters &&
                  Object.entries(templateData?.dbId?.tables[tableIdForFilter]?.filters).map(
                    (filter, index) => (
                      <Box key={index} className="custom-box">
                        <Box
                          className="filter-box"
                          style={{
                            backgroundColor:
                              underLine === filter[0] ? variables.highlightedfilterboxcolor : "transparent",
                          }}
                          variant="outlined"
                        >
                          <div
                            style={{}}
                            onClick={() => {
                              onFilterClicked(filter[1].query, filter[0], filter[1]);
                            }}
                          >
                            {filter[1]?.filterName}
                          </div>
                          <IconButton onClick={(e) => handleClick(e, filter[0])}>
                            <MoreVertIcon className="moreverticon" />
                          </IconButton>
                        </Box>
                      </Box>

                    )
                  )}
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
                  setUnderLine={setUnderLine}
                />

              )}

              <div >
                <Button sx={{ fontSize: `${variables.tablepagefontsize}`, textTransform: 'none', color: variables.basictextcolor }} onClick={handleClickOpenManageField}>Manage Fields</Button>

                <Button sx={{ fontSize: `${variables.tablepagefontsize}`, textTransform: 'none', color: variables.basictextcolor }} onClick={() => setMinimap(!minimap)}>Minimap {!minimap ? <CheckBoxOutlineBlankIcon fontSize="4px" /> : <CheckBoxIcon fontSize="2px" />}</Button>
                {params?.filterName && <> <Button sx={{ fontSize: `${variables.tablepagefontsize}`, paddingLeft: 0, paddingRight: 0, mr: 2 }} onClick={handleEdit}>Edit filter</Button>
                  <Button sx={{ fontSize: `${variables.tablepagefontsize}`, paddingLeft: 0, paddingRight: 0, mr: 2 }} onClick={(e) => {
                    handleClick(e, "share");
                  }
                  }>share view</Button></>}
              </div>
              {openManageField && (
                <ManageFieldDropDown
                  openManageField={openManageField}
                  setOpenManageField={setOpenManageField}
                />
              )}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleClose()}
              >


                <MenuItem
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Export CSV
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                  }}
                  sx={{ color: `#a51226` }}
                >
                  Delete
                </MenuItem>


              </Menu>
            </div>

            <div >
              {isTableLoading ? (
                <CircularProgress className="table-loading" />
              ) : (
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MainTable setPage={setPage} width={'100%'} height={`${(window?.screen?.height * 40) / 100}px`} page={page} minimap={minimap} style={{ padding: '0 auto' }} />
                </div>
              )}
            </div>
          </div>

        </div>
        <div style={{ marginTop: "25px", fontSize: '25px' }}>Description</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '85vw', padding: '10px', marginTop: '10px' }}>{description}</div>
        </div>
      </div>

    </div>
  );
}