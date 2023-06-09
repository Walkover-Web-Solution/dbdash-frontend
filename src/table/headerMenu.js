import React, { useState, useEffect } from 'react'
import { useLayer } from "react-laag";
import PropTypes from "prop-types";
import { makeStyles } from '@mui/styles';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DuplicateFieldPopup from './duplicateFieldPopup';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteColumns } from '../store/table/tableThunk';
import { createDuplicateColumn, getPropertyIcon, handleRenameColumn, hideColumns } from './headerFunctionality';
import AddOptionPopup from './addOptionPopup';


const useStyles = makeStyles(() => ({
  simpleMenu: {
    width: '175px',
    padding: '8px 0',
    borderRadius: '6px',
    boxShadow: '0px 0px 1px rgba(62, 65, 86, 0.7), 0px 6px 12px rgba(62, 65, 86, 0.35)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  },
  danger: {
    color: 'rgba(255, 40, 40, 0.8)',
    '&:hover': {
      color: 'rgba(255, 40, 40, 1)',
    },
  },
  menuItem: {
    padding: '6px 8px',
    color: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      color: 'rgba(0, 0, 0, 0.9)',
    },
    transition: 'background-color 100ms',
    cursor: 'pointer',
  },
  centeredText: {
    display: 'block',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
}));
export default function Headermenu(props) {
  const classes = useStyles();
  const [header, setHeader] = useState(props?.fields[props?.menu?.col]?.title);
  const isOpen = props?.menu !== undefined;
  const [showduplicate, setShowDuplicate] = useState(false);
  const [duplicateField, setDuplicateField] = useState(true);
  const dispatch = useDispatch();
  const params = useParams();

  //current column value in input box 
  useEffect(() => {
    setHeader(props?.fields[props?.menu?.col]?.title);
  }, [props?.menu?.col])

  const dataType = props?.fields[props?.menu?.col]?.dataType;

  const handleDelete = () => {
    dispatch(
      deleteColumns({
        label: props?.fields[props?.menu?.col]?.title,
        columnId: props?.fields[props?.menu?.col]?.id,
        fieldName: props?.fields[props?.menu?.col]?.id,
        fieldDataType: props?.fields[props?.menu?.col].dataType || "",
        tableId: params?.tableName,
        dbId: params?.dbId,
        filterId: params?.filterName
      })
    );
  }
  const { layerProps, renderLayer } = useLayer({
    isOpen,
    auto: true,
    placement: "bottom-end",
    triggerOffset: 2,
    onOutsideClick: () => props?.setMenu(undefined),
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
  };

  const handleOpenDuplicate = () => {
    setShowDuplicate(true)
  }

  const handleDuplicate = () => {
    setShowDuplicate(false);
    createDuplicateColumn(params, props, dispatch, duplicateField);
    setDuplicateField(true);
  };

  let data_type = props?.fields[props?.menu?.col]?.dataType;
  // get column icons
  const propertyIcon = getPropertyIcon(data_type);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  // const handleAddOption = () => {

  // }

  const handleUniqueChange = () => {
    setDuplicateField((isDuplicate) =>
      !isDuplicate
    )
  };

  const hideColumn = async () => {
    const metaData = { hide: "true" };
    hideColumns(dispatch, params, props, metaData);
  }

  function handleChange(e) {
    setHeader(e.target.value);
  }

  //rename column name --> outside click
  function handleBlur(e) {
    e.preventDefault();
    if (props?.fields[props?.menu?.col]?.title !== header) {
      handleRenameColumn(props, header, params, dispatch);
    }
  }

  //rename column name --> enter
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleRenameColumn(props, header, params, dispatch);
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
            <div className='is-fullwidth' style={{ marginBottom: 5, display: "flex", justifyContent: "center" }} >
              <input
                className='form-input'
                type='text'
                value={header}
                style={{ width: "90%" }}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className={`${classes.menuItem} ${classes.danger}`}>Property type</div>
            <div className={`${classes.centeredText}`}>
              <span className='svg-icon svg-text icon-margin'>{propertyIcon}</span>
              <span style={{ textTransform: "capitalize" }}>{data_type}</span>
            </div>
            <div onClick={() => { hideColumn(); }} className={classes.menuItem}><VisibilityOffIcon fontSize='2px' />Hide Field</div>
            <div onClick={() => {
              props?.setOpen(true),
                props?.setDirectionAndId({
                  direction: "left",
                  position: props?.fields[props?.menu?.col].id
                })
            }}
              className={classes.menuItem}><WestIcon fontSize='2px' />Insert Left</div>
            <div onClick={() => {
              props?.setOpen(true),
                props?.setDirectionAndId({
                  direction: "right",
                  position: props?.fields[props?.menu?.col].id
                })
            }}
              className={classes.menuItem}><EastIcon fontSize='2px' />Insert Right</div>
            {(dataType == "multipleselect" &&
              <>

                <div onClick={() => { handleOpen(); }} className={classes.menuItem}><NorthIcon fontSize='2px' />Add option</div></>)}
            <div className={classes.menuItem}><NorthIcon fontSize='2px' />Sort ascending</div>
            <div className={classes.menuItem}><SouthIcon fontSize='2px' />Sort descending</div>
            {(dataType !== "createdat" && dataType !== "createdby" && dataType !== "rowid" && dataType !== "autonumber") && (
              <>
                <div onClick={() => { handleOpenDuplicate(); }} className={classes.menuItem}>
                  <QueueOutlinedIcon fontSize='2px' />Duplicate cell</div>
                <div onClick={() => { handleDelete(); props.setMenu(false); }} className={classes.menuItem}>
                  <DeleteOutlineIcon fontSize='2.5px' />Delete</div>
              </>
            )}
          </div>
        )}
      <AddOptionPopup
        title="Add option"
        label="options"
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

Headermenu.propTypes = {
  menu: PropTypes.any,
  setMenu: PropTypes.any,
  setOpen: PropTypes.any,
  fields: PropTypes.any,
  setDirectionAndId: PropTypes.any,
};
