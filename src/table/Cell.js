import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import Relationship from "./Relationship";
import { usePopper } from "react-popper";
import { grey } from "./colors";
import PlusIcon from "./img/Plus";
import { randomColor } from "./utils";
import { addColumns, updateCells } from "../store/table/tableThunk";
import { useDispatch } from "react-redux";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import UploadFileIcon from '@mui/icons-material/UploadFile';
// import AddIcon from '@mui/icons-material/Add';
// import { uploadImage } from "../api/fieldApi";
export default function Cell({ value: initialValue, row, column: { id, dataType, options }, dataDispatch }) {

  const dispatch = useDispatch();

  const [value, setValue] = useState({ value: initialValue, update: false });
  
  const [selectRef, setSelectRef] = useState(null);
  const [selectPop, setSelectPop] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  const [dataTypes, setDataType] = useState("")
  const[imgUpload,setImageUpload]=useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState(null);
  const [inputBoxShow, setInputBoxShow] = useState(false);



  const onChange = (e) => {
    setValue({ value: e.target.value, update: false });
  };

  const onChangeFile = (e, type) => {
    console.log("e.target.files[0]", e.target.files[0])
    setDataType(type)
    if (e.target.files[0] != null) {
      setImageUpload( e.target.files[0])
    }

    e.target.value = null;
  };
  useEffect(() => {
    setValue({value: initialValue, update: false});
  }, [initialValue]);

  useEffect(()=>{
    if(imgUpload)
    dispatch(updateCells({
      columnId: id, rowIndex: row.original.id, value: imgUpload , dataTypess: dataTypes
    }))
  },[imgUpload])

    useEffect(() => {
      if (value?.update) {
        dispatch(updateCells({
          columnId: id, rowIndex: row.original.id, value: value.value, dataTypess: dataTypes
        }))
      }
    }, [value, dispatch, id, row.index]);



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
    case "createdby":
      element = (
        <input type="text"
          readOnly="readonly"
          defaultValue={(value?.value && value?.value?.toString()) || ""}
          className='data-input'
        />
      );
      break;
    case "createdat":
      element = (
        <input type="text"
          readOnly="readonly"
          defaultValue={(value?.value && value?.value?.toString()) || ""}
          className='data-input'
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
      element =

        (
          <>
            {inputBoxShow && <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                orientation="landscape"
                open={inputBoxShow} value={value?.value ? new Date(value?.value) : new Date()} onChange={(newValue) => { setValue({ value: newValue, update: true }); setInputBoxShow(false); }}
                onClose={() => { setInputBoxShow(false); }}
              />
            </LocalizationProvider>}
            <input type="text" className='data-input'
              defaultValue={value?.value}
              style={{ "display": inputBoxShow ? "none" : "block" }}
              onClick={(e) => {
                if (e.detail == 2) {
                  setInputBoxShow(true);

                }
              }} />
          </>

        );
      break;
    case "text":
      element = (
        <ContentEditable
          html={(value?.value && value?.value?.toString()) || ""}
          onChange={onChange}
          onBlur={() => setValue((old) => ({ value: old.value, update: true }))}

          className='data-input'
        />
      );
      break;
    case "varchar":
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
        <ContentEditable
          html={(value?.value && value.value.toString()) || ""}
          onChange={onChange}
          
          onBlur={() => setValue((old) => ({value: old.value, update: true}))}
          className='data-input text-align-right'
          step="any"
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
      element = (<><div   {...row.getRowProps()} className="tr">
        <input type="checkbox" {...row.getToggleRowSelectedProps()} />
      </div>
      </>)

      break;
    case "attachment":
      element = (
        <div>
  {value?.value?.length >0 && value?.value?.map((imgLink,index) => (
    // <div key ={index}  style={{ display: "flex"}}  >
      <img key ={index}  src={imgLink} alt="My Image" style={{ width: "25%", height: "100%",marginRight:"2px"}}  />
      /* {value?.value?.length===index+1  && 
        <input
          style={{ width: "25%", height: "100%",marginRight:"2px"}} 
          type="file"
          id="attachmentInput"
          onChange={(e) => { onChangeFile(e, "file") }}
        />
      // } */
    // </div>

  ))}
  <UploadFileIcon fontSize="medium"/>
   <input
          style={{ 
            width: "25%", 
            height: "100%", 
            marginRight: "2px",
            margin: "0",
            padding: "0",
            paddingBottom: "2px"
          }} 
          type="file"
          id="attachmentInput"
          onChange={(e) => { onChangeFile(e, "file") }}
        />
</div>

      );
      break;


    default:
      element = null;
      break;
  }

  return element;
}
