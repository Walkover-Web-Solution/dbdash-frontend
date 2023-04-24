import React, { useEffect, useState,memo} from "react";
import ContentEditable from "react-contenteditable";
import Relationship from "./Relationship";
import { usePopper } from "react-popper";
import { grey } from "./colors";
import PlusIcon from "./img/Plus";
import { randomColor } from "./utils";
import { addColumns, updateCells } from "../store/table/tableThunk";
import { useDispatch } from "react-redux";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SelectFilepopup from './selectFilepopup';
import { toast } from 'react-toastify';
import { Link, Tabs} from '@mui/material';
import { DemoContainer} from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import PropTypes from "prop-types";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const Cell =  memo ( ({ value: initialValue, row, column: { id, dataType, options }, dataDispatch }) =>{

  const dispatch = useDispatch();
  const [value, setValue] = useState({ value: initialValue, update: false });
  const [selectRef, setSelectRef] = useState(null);
  const [selectPop, setSelectPop] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState(null);
  const [inputBoxShow, setInputBoxShow] = useState(false);
  const [open, setOpen] = useState(false);

  
  const handleImageClick = (imgLink) => {
    window.open(imgLink, '_blank');
  };

  const handleUploadFileClick = () => {
    setOpen(true);
  };
   var rowProperties = row?.getToggleRowSelectedProps();
   rowProperties.indeterminate =  rowProperties.indeterminate?.toString();
   const onChange = (e) => {
    setValue({ value: e.target.value, update: false });
  };

  const onChangeFile = (e, type) => {
    if (e.target.files[0] != null) {
      dispatch(updateCells({
        columnId: id, rowIndex: row.original.id, value: e.target.files[0], dataTypes: type
      })).then(() => {
        toast.success('Image uploaded successfully!');
      });
    }
    e.target.value = null;
  };
  useEffect(() => {
    setValue({ value: initialValue, update: false });
  }, [initialValue]);

 
  useEffect(() => {
    if (value?.update &&  value.value!=null  && value.value !== initialValue && value.value.trim() !== "")  {
      dispatch(updateCells({
        columnId: id, rowIndex: row.original.id, value: value.value, dataTypes: "dataTypes"
      }))
    }
  }, [value, id, row.index]);

  function handleOptionKeyDown(e) {
    if (e.key === "Enter") {
      if (e.target.value !== "") {
        dispatch(addColumns({
          option: e.target.value,
          backgroundColor: randomColor(),
          columnId: id
        }))
      }
      setShowAdd(false);
    }
  }

  function handleAddOption() {
    setShowAdd(true);
  }

  function handleOptionBlur(e) {
    if (e.target.value !== "") {
      dispatch(addColumns({
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId: id
      }))

      dataDispatch({
        type: "add_option_to_column",
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId: id
      });
    }
    setShowAdd(false);
  }

  const { styles, attributes } = usePopper(selectRef, selectPop, {
    placement: "bottom-start",
    strategy: "fixed"
  });

  function getColor() {
    let match = options.find((option) => option.label === value.value);
    return (match && match.backgroundColor) || grey(300);
  }

  useEffect(() => {
    if (addSelectRef && showAdd) {
      addSelectRef.focus();
    }
  }, [addSelectRef, showAdd]);

  let element;
  switch (dataType) {
    case "formula" : 
    element = (
      <input type="text"
        readOnly="readonly"
        value={(value?.value && value?.value?.toString()) || ""}
        className='data-input'
        style={{background: "none"}}
      />
    );
    break;
  

    case "createdby":
      element = (
        <input type="text"
          readOnly="readonly"
          value={(value?.value && value?.value?.toString()) || ""}
          className='data-input'
          style={{background: "none"}}
        />
      );
      break;
    case "createdat":
      element = (
        <input type="text"
          readOnly="readonly"
          value={(value?.value && value?.value?.toString()) || ""}
          className='data-input'
          style={{background: "none"}}
        />
      );
      break;
      case "id":
        element = (
          <input type="text"
            readOnly="readonly"
            value={(value?.value && value?.value?.toString()) || ""}
            className='data-input'
            style={{background: "none"}}
          />
        );
        break;
    case "checkbox":
      element = (
        <input type="checkbox"
         
          
         
          onChange={() => {
            setValue(() => ({ value: !(value.value), update: true }))
          }}
        />
      );
      break;
      case "datetime":
  element = (
    <>
     {inputBoxShow && <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer sx={{mt: "-20px", flexWrap: "nowrap", overflow: "hidden"}} components={['MobileDateTimePicker' ]} >
            <MobileDateTimePicker open={inputBoxShow}  onChange={(newValue) => { setValue({ value: newValue, update: true }); }} onClose={() => { setInputBoxShow(false); }} />
               </DemoContainer>
            </LocalizationProvider>}  
      <input
        type="text"
        className="data-input"
        readOnly="readonly"
        value={value?.value && dayjs.utc(value.value).local().format("DD/MM/YYYY hh:mm A")}
        style={{
          display: inputBoxShow ? "none" : "block",
          background: "none",
        }}
        onClick={(e) => {
          if (e.detail == 2) {
            setInputBoxShow(true);
          }
        }}
      />
    </>
  );
  break;

    case "longtext":
      element = (
        <ContentEditable
          html={(value?.value && value?.value?.toString()) || ""}
          onChange={onChange}
          onBlur={() => setValue((old) => ({ value: old.value, update: true }))}
          className='data-input'
        />
      );
      break;
    case "singlelinetext":
      element = (
        <ContentEditable
          html={(value?.value && value?.value?.toString()) || ""}
          onChange={onChange}
          onBlur={() => setValue((old) => ({ value: old.value, update: true }))}
          className='data-input'
        />
      );
      break;
    case "numeric":
      element = (
        <>
        <input type="number"
        value={(value?.value && value?.value?.toString()) || ""}
        onChange={onChange}
        onBlur={() => setValue((old) => ({ value: old.value, update: true }))}
        className='data-input'
        style={{background: "none"}}
      />
        </>
      );
      break;

    case "select":
      element = (
        <>
          <div
            ref={setSelectRef}
            className='cell-padding d-flex cursor-default align-items-center flex-1'
            onClick={() => setShowSelect(true)}>
            {value.value && <Relationship value={value.value} backgroundColor={getColor()} />}
          </div>
          {showSelect && <div className='overlay' onClick={() => setShowSelect(false)} />}
          {showSelect && (
            <div
              className='shadow-5 bg-white border-radius-md'
              ref={setSelectPop}
              {...attributes.popper}
              style={{
                ...styles.popper,
                zIndex: 4,
                minWidth: 200,
                maxWidth: 320,
                padding: "0.75rem"
              }}>
              <div className='d-flex flex-wrap-wrap' style={{ marginTop: "-0.5rem" }}>
                {options.map((option, index) => (
                  <div key={index}
                    className='cursor-pointer'
                    style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                    onClick={() => {
                      setValue({ value: option.label, update: true });
                      setShowSelect(false);
                    }}>
                    <Relationship value={option.label} backgroundColor={option.backgroundColor} />
                  </div>
                ))}
                {showAdd && (
                  <div
                    style={{
                      marginRight: "0.5rem",
                      marginTop: "0.5rem",
                      width: 120,
                      padding: "2px 4px",
                      backgroundColor: grey(200),
                      borderRadius: 4
                    }}>
                    <input
                      type='text'
                      className='option-input'
                      onBlur={handleOptionBlur}
                      ref={setAddSelectRef}
                      onKeyDown={handleOptionKeyDown}
                    />
                  </div>
                )}
                <div
                  className='cursor-pointer'
                  
                  style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                  onClick={handleAddOption}>
                  <Relationship
                    value={
                      <span className='svg-icon-sm svg-text'>
                        <PlusIcon />
                      </span>
                    }
                    backgroundColor={grey(200)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      );
      break;
      case "check":
        element = (
          <div key={row.getRowProps().key} style={{display: 'flex', flex: '1 0 auto'}} className="tr">
           {!row.isSelected && <div className="count" title="Check">
              {row.index + 1}
            </div>}
            <div className={!row.isSelected ? "checkbox-container" : ""}>
              <input type="checkbox" {...rowProperties} className="checkbox" />
            </div>
          </div>
      )
      break;
      case "link":
        element = (
          <ContentEditable
            html={(value?.value && value?.value?.toString()) || ""}
            onChange={onChange}
            onBlur={() => setValue((old) => ({ value: old.value, update: true }))}
  
            className='data-input'
          />
        );
        break;
      case "lookup":
        element = (
          <input type="text"
          readOnly="readonly"
          value={(value?.value && value?.value?.toString()) || ""}
          className='data-input'
          style={{background: "none"}}
        />
        );
        break;
        case "attachment":
      element = (
        <div style={{display :"flex"}} >
            <UploadFileIcon fontSize="medium" onClick={handleUploadFileClick} />
            <Tabs  value={0} TabIndicatorProps={{
    style: { display: 'none' }
  }} variant="scrollable"
        scrollButtons="auto" style={{display: "flex", flexDirection: "row",overflowY:"hidden",overflowX:'hidden'}}>
          {value?.value?.length > 0 && value?.value?.map((imgLink, index) => (
           <Link key={index}  onClick={() =>{ handleImageClick(imgLink);}}>
           <img src={imgLink} alt="My Image" style={{ width: "50px", height: "25px" ,marginRight: "3px"}} />
         </Link>
          ))}
        </Tabs>
          
       { open &&  <SelectFilepopup
          title="uplaodfile"
          label="UploadFileIcon"
          open={open}
          setOpen={setOpen}
          onChangeFile={onChangeFile}
        />}
         </div>
      );
      break;
      
    default:
      element = null;
      break;
  }
  return element;
})
Cell.displayName = 'Cell'
export default Cell;
Cell.propTypes = {
  value: PropTypes.any,
  column: PropTypes.any,
  dataDispatch: PropTypes.any,
  row: PropTypes.any,
};
