/* eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Tabs, IconButton, Menu, MenuItem, CircularProgress, } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FilterModal from "../../component/filterPopup/filterPopUp";
import { setAllTablesData } from "../../store/allTable/allTableSlice";
import SingleTable from "../../component/table/singleTable/singleTable";
import { useParams } from "react-router-dom";
import { bulkAddColumns, filterData } from "../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setTableLoading } from "../../store/table/tableSlice";
import './templatePage.scss'
import variables from "../../assets/styling.scss";
import { toast } from "react-toastify";
import { getTemplate } from "../../api/templateApi";
import UseTemplatePopup from "./useTemplatePopup";
import MainNavbar from "../../component/mainNavbar/mainNavbar";
import { customUseSelector } from "../../store/customUseSelector";
import TemplateTable from "../../component/table/templateTable/templateTable";


export default function TemplatePage() {
  const isTableLoading = customUseSelector((state) => state.table?.isTableLoading);
  const dispatch = useDispatch();
  const params = useParams();
  const handleChange = async () => {
    const data = await templateDataa(params?.templateId)
    const tableNames = Object.keys(data?.data?.data?.dbId?.tables);
    setTableName(tableNames[0])
    if(tableIdForFilter==="") setTableIdForFilter(tableNames[0])
    dispatch(
      bulkAddColumns({
        dbId: data?.data?.data?.dbId?._id,
        tableName: tableIdForFilter,
        pageNo: 1,
      })
    );
    dispatch(setTableLoading(true));
    setFilterId('');
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
  const [underLine, setUnderLine] = useState(params?.filterName)
  const [minimap, setMinimap] = useState(false);
  const [openUseTemplate, setOpenUseTemplate] = useState(false);

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
    if(filterId) return;
    const data = await templateDataa(params?.templateId)
    const tableNames = Object.keys(data?.data?.data?.dbId?.tables);
    if(tableIdForFilter==="") setTableIdForFilter(tableNames[0])
    dispatch(
      bulkAddColumns({
        dbId: data?.data?.data?.dbId?._id,
        tableName: tableIdForFilter,
        pageNo: 1,
      })
    );
    dispatch(setTableLoading(true));
  }, [params?.templateId,tableIdForFilter,filterId]);

  useEffect(() => {
    if (filterId) {
      setUnderLine(filterId)
      dispatch(filterData({
        filterId: filterId,
        tableId: tableIdForFilter,
        filter: templateData?.dbId.tables[tableIdForFilter]?.filters[filterId]?.query,
        dbId: templateData?.dbId?._id,
      }))
    }
    else {
      setUnderLine(null);
    }
  }, [params?.filterName,filterId]);

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
    <>   <Box>
    <MainNavbar />
 </Box>
    <div className="templatePage-div">
      
      <div className="main-box">
        <div  className="temaplatePage-name">
          <div >{templateName}</div>
          <Button variant="contained"  className='mui-button templatePage-button' onClick={() => { setOpenUseTemplate(true); }}>Use Template</Button>
        </div>
        <UseTemplatePopup open={openUseTemplate} categoryName={categoryName} setOpen={setOpenUseTemplate} />

        <div  className="templatePage-div1">
          <div className="templatePage-div2">
            <div className="tableslist1">
              <Box className="tabs-container">
                <Tabs
                  value={0}
                  onClick={handleChange}
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
                        activeTableName={tableIdForFilter}
                        index={index}
                        dbData={templateData?.dbId}
                        setPage={setPage}
                        key={index}
                      />
                    ))}
                </Tabs>

              </Box>
              <Box  className="templatePage-box"  >
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
              
                <Button className="templatePage-button1"  onClick={() => setMinimap(!minimap)}>Minimap {!minimap ? <CheckBoxOutlineBlankIcon fontSize="4px" /> : <CheckBoxIcon  fontSize={variables.iconfontsize1}  />}</Button>
              </div>
            </div>

            <div >
              {isTableLoading ? (
                <CircularProgress className="table-loading" />
              ) : (
                <div className="templatePage-div3" >
                 <TemplateTable setPage={setPage} width={'100%'} height={`${(window?.screen?.height * 40) / 100}px`} page={page} minimap={minimap} style={{ padding: '0 auto' }} className="templatePage-maintable" />
                </div>
              )}
            </div>
          </div>

        </div>
        <div  className="templatePage-div4" >Description</div>
        <div  className="templatePage-div5" >
          <div  className="templatePage-div6" >{description}</div>
        </div>
      </div>

    </div>
    </>
 
  );
}