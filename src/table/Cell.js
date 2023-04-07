import React, { useEffect, useState } from "react";
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
import { Link} from '@mui/material';
import { DemoContainer} from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export default function Cell({ value: initialValue, row, column: { id, dataType, options }, dataDispatch }) {

  const dispatch = useDispatch();
  const [value, setValue] = useState({ value: initialValue, update: false });

  const [selectRef, setSelectRef] = useState(null);
  const [selectPop, setSelectPop] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  const [dataTypes, setDataType] = useState("")
  const [imgUpload, setImageUpload] = useState(null);
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
    setDataType(type)
    
if (e.target.files[0] != null) {
      setImageUpload(e.target.files[0])
    }
    e.target.value = null;
  };
  useEffect(() => {
    setValue({ value: initialValue, update: false });
  }, [initialValue]);
  useEffect(() => {
    if (imgUpload)
    {
      dispatch(updateCells({
        columnId: id, rowIndex: row.original.id, value: imgUpload, dataTypes: dataTypes
      })).then(() => {
        toast.success('Image uploaded successfully!');
      });
    }
  }, [imgUpload])

  useEffect(() => {
    if (value?.update &&  value.value!=null) {
      dispatch(updateCells({
        columnId: id, rowIndex: row.original.id, value: value.value, dataTypes: dataTypes
      }))
    }
  }, [value, dispatch, id, row.index]);


  // useEffect(() => {
  //   if (value?.update) {
  //     dispatch(updateCells({
  //       columnId: id, rowIndex: row.original.id, value: value.value, dataTypes: dataTypes
  //     }))
  //   }
  // }, [value, dispatch, id, row.index]);

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
    case "generatedcolumn" : 
    element = (
      <input type="text"
        readOnly="readonly"
        defaultValue={(value?.value && value?.value?.toString()) || ""}
        className='data-input'
        style={{background: "none"}}
      />
    );
    break;
  

    case "createdby":
      element = (
        <input type="text"
          readOnly="readonly"
          defaultValue={(value?.value && value?.value?.toString()) || ""}
          className='data-input'
          style={{background: "none"}}
        />
      );
      break;
      // case "integer":
      //   element = (
      //     <input type="text"
      //       readOnly="readonly"
      //       defaultValue={(value?.value && value?.value?.toString()) || ""}
      //       className='data-input'
      //       style={{background: "none"}}
      //     />
      //   );
      //   break;
    case "createdat":
      element = (
        <input type="text"
          readOnly="readonly"
          defaultValue={(value?.value && value?.value?.toString()) || ""}
          className='data-input'
          style={{background: "none"}}
        />
      );
      break;
      case "id":
        element = (
          <input type="text"
            readOnly="readonly"
            defaultValue={(value?.value && value?.value?.toString()) || ""}
            className='data-input'
            style={{background: "none"}}
          />
        );
        break;
    case "checkbox":
      element = (
        <input type="checkbox"
          checked={value.value}
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
        defaultValue={value?.value && dayjs.utc(value.value).local().format("DD/MM/YYYY hh:mm A")}
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
        <input type="number"
        defaultValue={(value?.value && value?.value?.toString()) || ""}
        className='data-input'
        style={{background: "none"}}
      />
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
          <div {...row.getRowProps()} className="tr">
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
          defaultValue={(value?.value && value?.value?.toString()) || ""}
          className='data-input'
          style={{background: "none"}}
        />
        );
        break;
    case "attachment":
      element = (
        <div style={{display: "flex", flexDirection: "row"}}>
          {value?.value?.length > 0 && value?.value?.map((imgLink, index) => (
           <Link key={index} onClick={() => handleImageClick(imgLink)}>
           <img src={imgLink} alt="My Image" style={{ width: "50px", height: "100%" ,marginRight: "3px" }} />
         </Link>

          ))}

          <UploadFileIcon fontSize="medium" onClick={handleUploadFileClick} />
              <div >
                <SelectFilepopup
                  title="uplaodfile"
                  label="UploadFileIcon"
                  open={open}
                  setOpen={setOpen}
                  onChangeFile={onChangeFile}
                />
              </div>
        </div>
      );
      break;

    default:
      element = null;
      break;
  }
  return element;
}
