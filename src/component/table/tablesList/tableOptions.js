import React, { useState,memo } from "react";
import ShareLinkPopUp from "../ShareLinkPopUp/ShareLinkPopUp"
import { Button, } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { filterData } from "../../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import AddFilterPopup from "../../addFilterPopup/addFIlterPopup";
import { setAllTablesData } from "../../../store/allTable/allTableSlice";
import "./tablesAndViews.scss";
import variables from "../../../assets/styling.scss";
import { createViewTable } from "../../../api/viewTableApi";
import ManageFieldDropDown from "../manageFieldDropDown/manageFieldDropDown";
import { toast } from "react-toastify";
import   {  customUseSelector }  from "../../../store/customUseSelector";


 function TableOptions({ dbData, setFilterId, setAnchorEl, minimap, setMinimap, shareLinkOpen, setShareLinkOpen }) {
  const shareViewUrl = process.env.REACT_APP_API_BASE_URL;
  const AllTableInfo = customUseSelector((state) => state.tables.tables);
  const dispatch = useDispatch();
  const params = useParams();

  const [openn, setOpenn] = useState(false);
  const [edit, setEdit] = useState(false);
  const [link, setLink] = useState("Link");
  const AllTable = customUseSelector((state) => {
    const { tables } = state.tables;
    const { dbId, userAcess, userDetail } = state.tables;
    return { tables, dbId, userAcess, userDetail };
  });
  const [openManageField, setOpenManageField] = useState(false);
  
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
  setFilterId : PropTypes.func, 
  setAnchorEl : PropTypes.func, 
  minimap: PropTypes.any,
  setMinimap : PropTypes.func,
  shareLinkOpen : PropTypes.any, 
  setShareLinkOpen : PropTypes.func
};