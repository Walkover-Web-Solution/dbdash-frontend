import React, { useEffect, useState, memo } from "react";
import ContentEditable from "react-contenteditable";

import {  updateCells } from "../store/table/tableThunk";
import { useDispatch } from "react-redux";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SelectFilepopup from "./selectFilepopup";
import { toast } from "react-toastify";
import {Tabs } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
// import { Document} from 'react-pdf';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import PropTypes from "prop-types";
import TableCellSingleSelect from './TableCellSingleSelect'
import TableCellMultiSelect from './TableCellMultiSelect'

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const Cell = memo(
  ({
    value: initialValue,
    row,
    column: { id, dataType, 
      //options
     },
   // dataDispatch,
  }) => {
    const dispatch = useDispatch();
    const [value, setValue] = useState({ value: initialValue, update: false });
    
    const [showAdd,] = useState(false);
    const [addSelectRef,] = useState(null);
    const [inputBoxShow, setInputBoxShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [imageLink,setImageLink] = useState("")
   
    
    

    const handleUploadFileClick = () => {
      setOpen(true);
    };
    var rowProperties = row?.getToggleRowSelectedProps();
    rowProperties.indeterminate = rowProperties.indeterminate?.toString();
    const onChange = (e) => {
      setValue({ value: e.target.value, update: false });
    };
    const onChangeUrl = (e,type)=>{
      if (imageLink != null) {
        dispatch(
          updateCells({
            columnId: id,
            rowIndex: row.original.id,
            value: null,
            imageLink:imageLink,
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
            imageLink:imageLink,
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
      if (
        value?.update &&
        value?.value != null &&
        value?.value !== initialValue &&
        value?.value !== ""
      ) {
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

   

    

   

    useEffect(() => {
      if (addSelectRef && showAdd) {
        addSelectRef.focus();
      }
    }, [addSelectRef, showAdd]);

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
            onBlur={() =>
              setValue((old) => ({ value: old.value, update: true }))
            }
            className="data-input"
          />
        );
        break;
      case "singlelinetext":
        element = (
          <ContentEditable
            html={(value?.value && value?.value?.toString()) || ""}
            onChange={onChange}
            onBlur={() =>
              setValue((old) => ({ value: old.value, update: true }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
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
              onBlur={() =>
                setValue((old) => ({ value: old.value, update: true }))
              }
              className="data-input"
            />
          );
          break;

          case "phone":
          element = (
            <>
              <input type="tel" id="phone" name="phone" maxLength="13"
                value={(value?.value && value?.value?.toString()) || ""}
                onChange={(event) => {
                        let newValue = event.target.value.replace(/[^\d+]/g, "");
                        onChange({ target: { value: newValue } });
                      }}
                onBlur={() =>
                  setValue((old) => ({ value: old.value, update: true }))
                }
                className="data-input"
                style={{ background: "none" }}
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
              onChange={onChange}
              onBlur={() =>
                setValue((old) => ({ value: old.value, update: true }))
              }
              className="data-input"
              style={{ background: "none" }}
            />
          </>
        );
        break;
        

          case "multiselect":
            element = (
              <div style={{display:'flex',overflowX:"auto"}}>
              <TableCellMultiSelect chips={['chip1','chip2','chip3']} /></div>)
              break;
      case "singleselect":
        element = (
          <>
          <TableCellSingleSelect chips={['chip1','chip2','chip3']} />
            
          </>
        );
        break;
      case "check":
        element = (
          <div key={row.getRowProps().key} style={{display: 'flex', flex: '1 0 auto',position:'sticky'}}  role="row"  className="tr">
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
            onChange={onChange}
            onBlur={() =>
              setValue((old) => ({ value: old.value, update: true }))
            }
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
    overflowX: "scroll",
  }}
>
  {value?.value?.length > 0 &&
    value?.value?.map((imgLink, index) =>{
      
     
      const fileName = imgLink.substring(imgLink.lastIndexOf('/') + 1);
      return(
      <a key={index} rel="noopener noreferrer" href={imgLink} style={{textDecoration:"none"}} target="_blank">
        <img src={imgLink} alt={fileName} width="50px" style={{color:"maroon",}} onClick={()=>{null}}/>
      </a>
    )})}
</Tabs>

            {open && (
              <SelectFilepopup
                title="uplaodfile"
                label="UploadFileIcon"
                open={open}
                setImageLink = {setImageLink}
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
