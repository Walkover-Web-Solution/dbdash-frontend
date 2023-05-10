import React, { useEffect, useState, memo } from "react";
import ContentEditable from "react-contenteditable";
import { updateCells } from "../store/table/tableThunk";
import { useDispatch } from "react-redux";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SelectFilepopup from "./selectFilepopup";
import { toast } from "react-toastify";
import { Tabs } from "@mui/material";
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
import TableCellMultiSelect from './TableCellMultiSelect'
import PreviewAttachment from "./previewAttachment";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const focusTableElement = ({ tableAxis, type = false }) => {
  const tableElement = document.querySelector(
    `div[data-id="${tableAxis.x}-${tableAxis.y}"]`
  );
  console.log('tableElementtableElementtableElement',tableElement)
  if(!tableElement)return
  if (type) {
    tableElement.style.border = "3px solid cornflowerblue";
    return;
  }
  /** Here removing preview focus table element  */
  tableElement?.style.removeProperty("border");
};

let x = 1;
let y = 0;
const Cell = memo(
  ({ value: initialValue, visibleColumns, row, column: { id, dataType, metadata }, }) => {
  
    
    const dispatch = useDispatch();
    const [value, setValue] = useState({ value: initialValue, update: false });
    const [inputBoxShow, setInputBoxShow] = useState(false);
    const[cursor,setCursor]=useState(false);
    const [open, setOpen] = useState(false);
    const [imageLink, setImageLink] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [previewModal, setPreviewModal] = useState(false)



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

    const handleOnKeyDown = (event) => {
      const keyObjet = {
        ArrowUp: true,
        ArrowDown: false,
        ArrowRight: true,
        ArrowLeft: false,
      };
      console.log("calll___3", x, y);
      console.log("event.key ", event.keyCode, `div[data-id="${x}-${y}"]`);
      focusTableElement({ tableAxis: { x, y } });

      if ((event.key == "ArrowUp" || event.key == "ArrowDown") && x >= 0) {
        x = keyObjet[event.key] ? x - 1 : x + 1;
        if (x === -1) {
          x = x + 1;
          return;
        }
      }
      if ((event.key == "ArrowLeft" || event.key == "ArrowRight") && y > 0) {
        const totalColumns = visibleColumns.length;
        y = keyObjet[event.key] ? y + 1 : y - 1;
        if (event.key == "ArrowRight" && y > totalColumns - 2) {
          y = totalColumns - 2;
        }
        if (y === 0) {
          y = y + 1;
          return;
        }
      }
      focusTableElement({ tableAxis: { x, y }, type: true });
      //  document.querySelector(`td[data-id="${x}-${y}"]`).style.border = "2px solid"
      // const td  = document.querySelector(`div[data-id="${x}-${y}"]`).style.border = "3px solid cornflowerblue"
      // console.log('tdtd',td)

      //  .style.color = "blue"
      // document.getElementById("demo").style.display = "none";
      // border: 2px solid;
      // const td = document.querySelector(`td[data-id="${x}-${y}"]`);
      // const match =
      //   (td && td?.querySelector("textarea")) || td?.querySelector("input");
      // if (match) {
      //   match.focus();
      // }
    };
    
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
          <input
            value={(value?.value && value?.value?.toString()) || ""}
            onChange={onChange}
            onDoubleClick={()=>{
              setCursor(true);
            }}
            
            style={!cursor?{caretColor:"transparent"}:{}}
            onBlur={() => {
              setValue((old) => ({ value: old.value, update: true }));
            }}
            
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
        case "singlelinetext":
        element = (
          <input
            value={(value?.value && value?.value?.toString()) || ""}
            onChange={onChange}
            onDoubleClick={()=>{
              setCursor(true);
            }}
            
            style={!cursor?{caretColor:"transparent"}:{}}
            onBlur={() => {
              setValue((old) => ({ value: old.value, update: true }));
            }}
            
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
            onDoubleClick={()=>{
              setCursor(true);
            }}
            onKeyDown={()=>{setCursor(true)}}
            style={!cursor?{caretColor:"transparent"}:{}}
            onBlur={() => {
              setValue((old) => ({ value: old.value, update: true }));
            }}
            
            className="data-input"
          />
        );
        break;

      case "phone":
        element = (
          <>
            <input type="tel" id="phone" name="phone" maxLength="13"
              value={(value?.value && value?.value?.toString()) || ""}
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
              }}
              
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
              onChange={onChange}
              onDoubleClick={()=>{
                setCursor(true);
              }}
              
              style={!cursor?{caretColor:"transparent",background:"none"}:{background:"none"}}
              onBlur={() => {
                setValue((old) => ({ value: old.value, update: true }));
              }}
              
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
            onDoubleClick={()=>{
              setCursor(true);
            }}
            
            style={!cursor?{caretColor:"transparent"}:{}}
     
            onChange={onChange}
            onBlur={() => {

              setValue((old) => ({ value: old.value, update: true }));
            }}
            
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
    return  (
      <div
      className="data-input"
        onKeyDown={handleOnKeyDown}
        onClick={handleOnKeyDown}
        onMouseDown={(e) => {
          focusTableElement({ tableAxis: { x, y } });
          console.log('e.target.parentNode',e.target.parentNode.parentNode
          .closest("div")
          .getAttribute("data-id"))
          if(e.target.parentNode.parentNode){
            const [a, b] = e.target.parentNode.parentNode
            .closest("div")
            .getAttribute("data-id")
            .split("-");
          x = parseInt(a);
          y = parseInt(b);
          }
        }}
      >
        {element}
      </div>
    );
  }
);
Cell.displayName = "Cell";
export default Cell;
Cell.propTypes = {
  value: PropTypes.any,
  column: PropTypes.any,
  dataDispatch: PropTypes.any,
  row: PropTypes.any,
  visibleColumns: PropTypes.any,
};