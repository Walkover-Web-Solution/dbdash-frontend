import React, { useState, useEffect, memo } from "react";
import ShareLinkPopUp from "../ShareLinkPopUp/ShareLinkPopUp"
import { Button, Menu, MenuItem } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { bulkAddColumns, filterData } from "../../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import AddFilterPopup from "../../addFilterPopup/addFIlterPopup";
import { deleteFilter } from "../../../api/filterApi";
import { setTableLoading } from "../../../store/table/tableSlice";
import { setAllTablesData } from "../../../store/allTable/allTableSlice";
import variables from "../../../assets/styling.scss";
import { createViewTable } from "../../../api/viewTableApi";
import ManageFieldDropDown from "../manageFieldDropDown/manageFieldDropDown";
import { toast } from "react-toastify";
import   {  customUseSelector }  from "../../../store/customUseSelector";
import { exportCSV } from "../../../api/tableApi";

 function TableOptions({ dbData, minimap, setMinimap }) {
  const shareViewUrl = process.env.REACT_APP_API_BASE_URL;
  const AllTableInfo = customUseSelector((state) => state.tables.tables);
  const dispatch = useDispatch();
  const params = useParams();

  const navigate = useNavigate();
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [openn, setOpenn] = useState(false);
  const [filterId, setFilterId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [link, setLink] = useState("Link");
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
  const dispatchFilterData = ()=>{

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
  }
  const handleClickOpenManageField = () => {
    setOpenManageField(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = async () => {
    if (params?.filterName) {
      setOpenn(true);
    } else {
      setOpenn(false);
      toast.warning("choose the filter First");
    }
  };
  
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
      {openn && (
        <AddFilterPopup
          dbData={dbData}
          open={openn}
          setOpen={setOpenn}
          filterId={params?.filterName}
          dbId={dbData?.db?._id}
          tableName={params?.tableName}
          dispatchFilterData = {dispatchFilterData}
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
    </>
  );
}
export default memo(TableOptions);
TableOptions.propTypes = {
  dbData: PropTypes.any,
  minimap : PropTypes.any,
  setMinimap : PropTypes.func,
};