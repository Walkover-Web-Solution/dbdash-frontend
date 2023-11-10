import React, { useState,useEffect } from 'react'
import { useLayer } from "react-laag";
import PropTypes from "prop-types";
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import styling from '../assets/styling.scss'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DuplicateFieldPopup from './duplicateFieldPopup/duplicateFieldPopup';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteColumns, updateColumnHeaders } from '../store/table/tableThunk';
import { createDuplicateColumn, getPropertyIcon,handleRenameColumn, hideColumns } from './headerFunctionality';
import { toast } from 'react-toastify';
import UpdateQueryPopup from './updateQueryPopup';
import variables from '../assets/styling.scss';
import { HeaderMenuStyles } from '../muiStyles/muiStyles';


export default function Headermenu(props) {
  const classes = HeaderMenuStyles();
  const[header,setHeader]=useState(props?.fields[props?.menu?.col]?.title);
  const isOpen = props?.menu !== undefined;
  const [showduplicate, setShowDuplicate] = useState(false);
  const [duplicateField, setDuplicateField] = useState(true);
  const [queryResult, setQueryResult] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const dispatch = useDispatch();
  const params = useParams();
  //current column value in input box 
  useEffect(() => {
  setHeader(props?.fields[props?.menu?.col]?.title);
  }, [props?.menu?.col])

  const dataType = props?.fields[props?.menu?.col]?.dataType;
  const handleDelete=()=>{dispatch(
    deleteColumns({
      label: props?.fields[props?.menu?.col]?.title,
      columnId: props?.fields[props?.menu?.col]?.id,
      fieldName: props?.fields[props?.menu?.col]?.id,
      fieldDataType: props?.fields[props?.menu?.col].dataType || "",
      metaData: props?.fields[props?.menu?.col].metadata,
      tableId: params?.tableName,
      dbId: params?.dbId,
      filterId:params?.filterName
    })
  );
}
  const { layerProps, renderLayer } = useLayer({
    isOpen,
    auto: true,
    placement: "bottom-end",
    triggerOffset: 2,
    onOutsideClick: () => {
      props?.setMenu(undefined);
      setQueryResult(false);
      setIsPopupOpen(false);
    },
    trigger: {
      getBounds: () => ({
        left: props?.menu ? props?.menu.bounds?.x : 0,
        top: props?.menu ? props?.menu.bounds?.y : 0,
        width: props?.menu ? props?.menu.bounds?.width : 0,
        height: props?.menu ? props?.menu.bounds?.height : 0,
        right: (props?.menu ? props?.menu.bounds?.x : 0) + (props?.menu ? props?.menu.bounds?.width : 0),
        bottom: (props?.menu ? props?.menu.bounds?.y : 0) + (props?.menu ? props?.menu.bounds?.height : 0),
      }),
    },
  });

  const handleClose = () => {
    setShowDuplicate(false);
    props.setMenu(null);
    setIsPopupOpen(false);
    setQueryResult(false);
  };

  const handleOpenDuplicate = () => {
    setShowDuplicate(true)
  }

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    props?.setMenu(null);
    setQueryResult(false);
    setIsPopupOpen(false);
  };

  const updateColumnQuery = ()=>{
    let metaData = {} ;
    var queryToSend = JSON.parse(queryResult.pgQuery)?.add_column?.new_column_name?.data_type + ` GENERATED ALWAYS AS (${JSON.parse(queryResult.pgQuery)?.add_column?.new_column_name?.generated?.expression}) STORED`
    metaData.query = queryToSend ;
    metaData.userQuery = queryResult.userQuery
    dispatch(updateColumnHeaders({
      dbId: params?.dbId,
      tableName: params?.tableName,
      columnId: props?.fields[props?.menu?.col]?.id,
      metaData: metaData
    }));
  }

  const handleDuplicate = () => {
    setShowDuplicate(false);
    createDuplicateColumn(params, props, dispatch,duplicateField);
    setDuplicateField(true);
  };


  let data_type = props?.fields[props?.menu?.col]?.dataType;
  // get column icons
  const propertyIcon = getPropertyIcon(data_type);

  const handleUniqueChange = () => {
    setDuplicateField((isDuplicate) =>
      !isDuplicate
    )
  };

  const hideColumn = async () => {
    const metaData = { hide: true };
    hideColumns(dispatch, params, props,metaData);
    props?.setMenu(null);
  }

  function handleChange(e) {
    setHeader(e.target.value);
  }
  function handleRenameColumnAction(props, header, params, dispatch) {
    if (props?.fields[props?.menu?.col]?.title === header) {
      toast.error("Field is the same");
      return;
    }
  
    if (header.trim() === "") {
      toast.error("Field is not empty");
      return;
    }
  
    if (header.includes(" ")) {
      toast.error("Table name cannot contain spaces");
      return;
    }

    if (!isNaN(parseInt(header.charAt(0)))) {
      toast.error("First character cannot be an integer");
      return;
    }
  
    handleRenameColumn(props, header, params, dispatch);
  }
  
  function handleBlur(e) {
    e.preventDefault();
    handleRenameColumnAction(props, header, params, dispatch);
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleRenameColumnAction(props, header, params, dispatch);
      props.setMenu(false);
    }
  }
  return (
    <>
      {props?.menu &&
        renderLayer(
          <div className={classes.simpleMenu} {...layerProps}>
            {showduplicate && <DuplicateFieldPopup
              open={showduplicate}
              handleClose={handleClose}
              handleDuplicate={handleDuplicate}
              handleUniqueChange={handleUniqueChange}
              duplicateField={duplicateField}
            />}
           
             <div className='is-fullwidth' style={{ marginBottom: 5,display:"flex",justifyContent:"center" }} >
                  <input
                    className='form-input'
                    type='text'
                    value={header}
                    style={{ width: "90%"}}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                  />
                </div>
            <div className={`${classes.menuItem} ${classes.danger}`}>Property type </div>
              <div >
              <span className='svg-icon svg-text icon-margin'>{propertyIcon}</span>
                    <span style={{ textTransform: "capitalize" }}>{data_type}</span>
                   
                    
                
              </div>
              <div className={classes.menuItem}>
              {
              dataType == "link"  &&
               <> <span style={{display : "contents"}}> linkedTableId  = {props?.fields[props?.menu?.col]?.metadata?.foreignKey?.tableId} </span>
                   <span style={{display : "contents"}}> linkedFieldId  = {props?.fields[props?.menu?.col]?.metadata?.foreignKey?.fieldId} </span></> }
              {   props?.fields[props?.menu?.col]?.metadata?.isLookup  &&  <>
              <span style={{display : "contents"}}> lookupTableId  = { props?.fields[props?.menu?.col]?.tableId} </span>
              <span style={{display : "contents"}}> lookupFieldId  = { props?.fields[props?.menu?.col]?.actualFieldId} </span>
              </>
               }
               </div>
           
            <div onClick={() => { hideColumn(); }} className={classes.menuItem}><VisibilityOffIcon fontSize={variables.iconfontsize1} />Hide Field</div>
            <div onClick={(event) => {
              props?.openPopper(event),
              props?.setDirectionAndId({
              direction: "left",
              position: props?.fields[props?.menu?.col].id})}} 
              className={classes.menuItem}><WestIcon fontSize={variables.iconfontsize1} />Insert Left</div>
            <div onClick={(event) => {
              props?.openPopper(event),
              props?.setDirectionAndId({
              direction: "right",
              position: props?.fields[props?.menu?.col].id})}} 
              className={classes.menuItem}><EastIcon fontSize={variables.iconfontsize1} />Insert Right</div>
            <div className={classes.menuItem}><NorthIcon fontSize={variables.iconfontsize1} />Sort ascending</div>
            <div className={classes.menuItem}><SouthIcon fontSize={variables.iconfontsize1} />Sort descending</div>
            {((dataType !== "createdat" && dataType !== "createdby" && dataType !== "updatedat" && dataType !== "updatedby" && dataType !== "rowid" && dataType !== "autonumber") || (props?.fields[props?.menu?.col]?.metadata?.isLookup && props?.fields[props?.menu?.col]?.metadata?.isLookup==true)) && (
            <>
              {dataType === "formula" && (
                  <div onClick={handleOpenPopup} className={classes.menuItem}>
                    <QueueOutlinedIcon fontSize={variables.iconfontsize1} />Query Update
                  </div>
                )}
                <div onClick={() => { handleOpenDuplicate(); } } className={classes.menuItem}>
                <QueueOutlinedIcon fontSize={variables.iconfontsize1} />Duplicate field</div>
                <div style={{color:styling.deletecolor}} onClick={() => {handleDelete();props.setMenu(false);}} className={classes.menuItem}>
                <DeleteOutlineIcon fontSize='2.5px' />Delete</div>
            </>
            )}
            {isPopupOpen && (
  <UpdateQueryPopup
    isOpen={isPopupOpen}
    onClose={handleClosePopup}
    queryByAi={queryResult}
    setQueryByAi={setQueryResult}
    submitData={updateColumnQuery}
    fields={props?.fields}
    menu={props?.menu}
  />
)}
          </div>
        )}
    </>
  );
}

Headermenu.propTypes = {
  menu: PropTypes.any,
  setMenu: PropTypes.any,
  openPopper: PropTypes.any,
  fields: PropTypes.any,
  setDirectionAndId: PropTypes.any,
  submitData: PropTypes.func,
  queryByAi: PropTypes.any,
  setQueryByAi: PropTypes.func,
};
