import React, { useEffect, useState, memo } from "react";
import ContentEditable from "react-contenteditable";
import { updateCells } from "../store/table/tableThunk";
import { useDispatch } from "react-redux";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SelectFilepopup from "./selectFilepopup";
import { toast } from "react-toastify";

import { Button, ClickAwayListener, Popper, Tabs, TextareaAutosize } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import PropTypes from "prop-types";
import TableCellSingleSelect from './TableCellSingleSelect'
// import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import TableCellMultiSelect from './TableCellMultiSelect'
import PreviewAttachment from "./previewAttachment";
import { OpenInFull } from "@mui/icons-material";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const Cell = memo(
  ({ value: initialValue, row, column: { id, dataType, metadata }, }) => {
  
    
    const dispatch = useDispatch();
    const [value, setValue] = useState({ value: initialValue, update: false });
    const [inputBoxShow, setInputBoxShow] = useState(false);
    const[textarea,setTextarea]=useState("");
    const[cursor,setCursor]=useState(false);
    const [open, setOpen] = useState(false);
    const [imageLink, setImageLink] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [previewModal, setPreviewModal] = useState(false)
    const [selectedInput, setSelectedInput] = useState(null);
    const [popperOpen, setPopperOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClickButton = (event) => {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    };
  
    const handleClickAway = () => {
      setPopperOpen(false);
      setSelectedInput(null);
      setAnchorEl(null);
    };
  
    const handleInputClick = (event) => {
      // remove the border from the previously selected input element (if any)
      if (selectedInput) {
        selectedInput.style.border = "none";
      }
      // set the currently selected input element to the clicked input element
      setSelectedInput(event.target);
      // add a border to the clicked input element
      event.target.style.border = "2px solid blue";
      

    };

    const handleInputBlur = (event) => {
      // remove the border from the input element
      event.target.style.border = "none";
    };

    const handleUploadFileClick = () => {
      setOpen(true);
    };

    const handleCellClick = () => {
      setIsOpen(true);
    };

    var rowProperties = row?.getToggleRowSelectedProps();
    rowProperties.indeterminate = rowProperties.indeterminate?.toString();

    const onChange = (e) => {
      setValue({ value: e.target.value, update: false });
    };

    const onChangeUrl = (e, type) => {
      if (imageLink != null) {
        dispatch(
          updateCells({
            columnId: id,
            rowIndex: row.original.id,
            value: null,
            imageLink: imageLink,
            dataTypes: type,
          })
        ).then(() => {
          toast.success("Image uploaded successfully!");
        });
      }
      e.target.value = null;
    }

    const onChangeFile = (e, type) => {
      if (e.target.files[0] != null) {
        dispatch(
          updateCells({
            columnId: id,
            rowIndex: row.original.id,
            value: e.target.files[0],
            imageLink: imageLink,
            dataTypes: type,
          })
        ).then(() => {
          toast.success("Image uploaded successfully!");
        });
      }
      e.target.value = null;
    };

    useEffect(() => {
      setValue({ value: initialValue, update: false });
    }, [initialValue]);

    useEffect(() => {
      if (value?.update && value?.value != null && value?.value !== initialValue ) {
        dispatch(
          updateCells({
            columnId: id,
            rowIndex: row.original.id,
            value: value.value,
            dataTypes: "dataTypes",
          })
        );
      }
    }, [value, id, row.index]);

    let element;
    switch (dataType) {
      case "formula":
        element = (
          <input
            type="text"
            readOnly="readonly"
            value={(value?.value && value?.value?.toString()) || ""}
            className="data-input"
            style={{ background: "none" }}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            onFocus={handleInputClick}
          />
        );
        break;

      case "createdby":
        element = (
          <input
            type="text"
            readOnly="readonly"
            value={(value?.value && value?.value?.toString()) || ""}
            className="data-input"
            style={{ background: "none" }}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            onFocus={handleInputClick}
          />
        );
        break;

      case "createdat":
        element = (
          <input
            type="text"
            readOnly="readonly"
            value={(value?.value && value?.value?.toString()) || ""}
            className="data-input"
            style={{ background: "none" }}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            onFocus={handleInputClick}
          />
        );
        break;

      case "id":
        element = (
          <input
            type="text"
            readOnly="readonly"
            value={(value?.value && value?.value?.toString()) || ""}
            className="data-input"
            style={{ background: "none" }}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            onFocus={handleInputClick}
          />
        );
        break;

      case "checkbox":
        element = (
          <input
            type="checkbox"
            checked={value.value}
            onChange={() => {
              setValue(() => ({ value: !value.value, update: true }));
            }}
          />
        );
        break;

      case "datetime":
        element = (
          <>
            {inputBoxShow && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  sx={{ mt: "-20px", flexWrap: "nowrap", overflow: "hidden" }}
                  components={["MobileDateTimePicker"]}
                >
                  <MobileDateTimePicker
                    open={inputBoxShow}
                    onChange={(newValue) => {
                      setValue({ value: newValue, update: true });
                    }}
                    onClose={() => {
                      setInputBoxShow(false);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            )}
            <input
              type="text"
              className="data-input"
              readOnly="readonly"
              value={
                value?.value &&
                dayjs.utc(value.value).local().format("DD/MM/YYYY hh:mm A")
              }
              style={{
                display: inputBoxShow ? "none" : "block",
                background: "none",
              }}
              onClick={(e) => {
                if (e.detail == 2) {
                  setInputBoxShow(true);
                }
                handleInputClick(e);
              }}
              onBlur={handleInputBlur}
              onFocus={handleInputClick}
            />
          </>
        );
        break;

      case "longtext":
        element = (
          <>
          <input
            value={(value?.value && value?.value?.toString()) || ""}
            onChange={onChange}
            onFocus={handleInputClick}
            onDoubleClick={()=>{
              setCursor(true);
            }}
            
            style={!cursor?{caretColor:"transparent",paddingRight:"40px"}:{paddingRight:"40px"}}
            onBlur={() => {
              setValue((old) => ({ value: old.value, update: true }));
              if (selectedInput === event.target) {
               if(!popperOpen)
               { setSelectedInput(null);
               }
                setCursor(false);
              }
              event.target.style.border = "none";
            }}

            onClick={handleInputClick}
            onKeyDown={(e) => {
              setCursor(true);
              if (e.key === 'Enter') {
                setValue((old) => ({ value: old.value, update: true }))
              }
            }}
            className="data-input"

          />
        {selectedInput && 
    <div
     onMouseDown={(e)=>{
      e.preventDefault();
   
     }}
      style={{
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      
        <OpenInFull    onClick={handleClickButton} />
  
      </div>}
    {popperOpen && <ClickAwayListener onClick={(e)=>{
  e.preventDefault();
  e.stopPropagation();
  
 }} onClickAway={handleClickAway}>
<Popper

  open={popperOpen}
  anchorEl={anchorEl}
  placement="right"
  style={{zIndex:20,margin:"5px",backgroundColor:"cadetblue",color:"white",width:"500px",height:"500px",whiteSpace:"pre-wrap",overflowX:"hidden",overflowY:"scroll",}}
  onMouseDown={(e) => {
    e.stopPropagation();
  }}
  
  
>

  <div>
  <TextareaAutosize
style={{overflowY:"scroll",margin:"30px",height:"400px",width:"300px",padding:"1px"}}
            value={(value?.value && value?.value?.toString()) || ""}
            onChange={(e)=>{
              setValue({value:e.target.value,update:false});
               setTextarea(e.target.value)}}
           
            onKeyDown={(e)=>{

              if(e.key=="Enter")
              {
                setValue({value:e.target.value,update:true});
              }
            }}
            maxRows={100}
            minRows={1}
            />
            <Button 
            variant="outlined" style={{margin:"2px",color:"maroon",backgroundColor:"white"}}  onClick={()=>{
              setValue({value:textarea,update:true});

            }}>save</Button>
  </div>
</Popper>
</ClickAwayListener>}

          </>
        );
        break;
        case "singlelinetext":
        element = (
          <input
            value={(value?.value && value?.value?.toString()) || ""}
            onChange={onChange}
            onFocus={handleInputClick}
            onDoubleClick={()=>{
              setCursor(true);
            }}
            
            style={!cursor?{caretColor:"transparent"}:{}}
            onBlur={() => {
              setValue((old) => ({ value: old.value, update: true }));
              if (selectedInput === event.target) {
                setSelectedInput(null);
                setCursor(false);
              }
              event.target.style.border = "none";
            }}
            onClick={handleInputClick}
            onKeyDown={(e) => {
              setCursor(true);
              if (e.key === 'Enter') {
                setValue((old) => ({ value: old.value, update: true }))
                event.preventDefault();
              }
            }}
            className="data-input"
          />
        );
        break;

      case "email":
        element = (
          <ContentEditable
            html={(value?.value && value?.value?.toString()) || ""}
            onChange={onChange}
            onFocus={handleInputClick}
            onDoubleClick={()=>{
              setCursor(true);

            }}
            onKeyDown={()=>{setCursor(true)}}
            style={!cursor?{caretColor:"transparent"}:{}}
            onBlur={() => {
              setValue((old) => ({ value: old.value, update: true }));
              if (selectedInput === event.target) {
                setSelectedInput(null);
                setCursor(false);
              }
              event.target.style.border = "none";
            }}
            onClick={handleInputClick}
            className="data-input"
          />
        );
        break;

      case "phone":
        element = (
          <>
            <input type="tel" id="phone" name="phone" maxLength="13"
              value={(value?.value && value?.value?.toString()) || ""}
              onFocus={handleInputClick}
              onDoubleClick={()=>{
                setCursor(true);
              }}
              onKeyDown={()=>{setCursor(true)}}
              style={!cursor?{caretColor:"transparent",background:"none"}:{background:"none"}}
              onChange={(event) => {
                let newValue = event.target.value.replace(/[^\d+]/g, "");
                onChange({ target: { value: newValue } });
              }}
              onBlur={() => {
                setValue((old) => ({ value: old.value, update: true }));
                if (selectedInput === event.target) {
                  setSelectedInput(null);
                  setCursor(false);
                }
                event.target.style.border = "none";
              }}
              onClick={handleInputClick}
              className="data-input"
             

            />
          </>
        );
        break;
      case "numeric":
        element = (
          <>
            <input
              type="number"
              value={(value?.value && value?.value?.toString()) || ""}
              onFocus={handleInputClick}
              onChange={onChange}
              onDoubleClick={()=>{
                setCursor(true);
              }}
              
              style={!cursor?{caretColor:"transparent",background:"none"}:{background:"none"}}
              onBlur={() => {
                setValue((old) => ({ value: old.value, update: true }));
                if (selectedInput === event.target) {
                  setSelectedInput(null);
                  setCursor(false);
                }
                event.target.style.border = "none";
              }}
              onClick={handleInputClick}
              onKeyDown={(e) => {
                setCursor(true);
                if (e.key === 'Enter') {
                  setValue((old) => ({ value: old.value, update: true }))
                }
              }}
              className="data-input"
         
            />
          </>
        );
        break;

      case "multipleselect":
       
        element = (
          <div onClick={handleCellClick} style={{ display: 'flex', overflowX: "auto" }}>
            <TableCellMultiSelect value={value?.value || []} rowid={row.original.id} colid={id} setIsOpen={setIsOpen} isOpen={isOpen} /></div>)
        break;

      case "singleselect":
        element = (
          <div onClick={handleCellClick} style={{ display: 'flex', overflowX: "auto" }}>
            <TableCellSingleSelect metaData={metadata} value={value?.value} rowid={row.original.id} colid={id} setIsOpen={setIsOpen} isOpen={isOpen} />
          </div>
        );
        break;
      case "check":
        element = (
          <div key={row.getRowProps().key} style={{ display: 'flex', flex: '1 0 auto', position: 'sticky' }} role="row" className="tr">
            {!row.isSelected && (
              <div className="count" title="Check">
                {row.index + 1}
              </div>
            )}
            <div className={!row.isSelected ? "checkbox-container" : ""}>
              <input type="checkbox" {...rowProperties} className="checkbox" />
            </div>
          </div>
        );
        break;
      case "link":
        element = (
          <ContentEditable
            html={(value?.value && value?.value?.toString()) || ""}
            onFocus={handleInputClick}
            onDoubleClick={()=>{
              setCursor(true);
            }}
            
            style={!cursor?{caretColor:"transparent"}:{}}
     
            onChange={onChange}
            onBlur={() => {

              setValue((old) => ({ value: old.value, update: true }));
              if (selectedInput === event.target) {
                setSelectedInput(null);
                setCursor(false);
              }
              event.target.style.border = "none";
            }}
            onClick={handleInputClick}
            onKeyDown={(e) => {
              setCursor(true);
              if (e.key === 'Enter') {
                setValue((old) => ({ value: old.value, update: true }))
              }
            }}
            className="data-input"
          />
        );
        break;
      case "lookup":
        element = (
          <input
            type="text"
            readOnly="readonly"
            value={(value?.value && value?.value?.toString()) || ""}
            className="data-input"
            style={{ background: "none" }}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            onFocus={handleInputClick}
          />
        );
        break;
      case "attachment":
        element = (
          <div style={{ display: "flex" }}>
            <UploadFileIcon fontSize="medium" onClick={handleUploadFileClick} />
            <Tabs
              value={0}
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              variant="scrollable"
              scrollButtons="auto"
              style={{
                display: "flex",
                flexDirection: "row",
                overflowY: "hidden",
                overflowX: "hidden",
              }}

            >
              {value?.value?.length > 0 &&
                value?.value?.map((imgLink, index) => (
                  <React.Fragment key={index}>
                    <embed src={imgLink} width="50px" onClick={() => {
                      setPreviewModal(true)
                    }} />
                    {previewModal && (
                      <PreviewAttachment imageLink={imgLink} open={previewModal} setPreviewModal={setPreviewModal} />
                    )}
                  </React.Fragment>

                ))}
            </Tabs>

            {open && (
              <SelectFilepopup
                title="uplaodfile"
                label="UploadFileIcon"
                open={open}
                setImageLink={setImageLink}
                onChangeUrl={onChangeUrl}
                setOpen={setOpen}
                imageLink={imageLink}
                onChangeFile={onChangeFile}
              />
            )}
          </div>
        );
        break;

      default:
        element = null;
        break;
    }
    return element;
  }
);
Cell.displayName = "Cell";
export default Cell;
Cell.propTypes = {
  value: PropTypes.any,
  column: PropTypes.any,
  dataDispatch: PropTypes.any,
  row: PropTypes.any,
};