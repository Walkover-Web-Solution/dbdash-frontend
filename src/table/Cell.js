import React, { useEffect, useState, memo } from "react";
import ContentEditable from "react-contenteditable";
import { updateCells } from "../store/table/tableThunk";
import { useDispatch, useSelector } from "react-redux";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SelectFilepopup from "./selectFilepopup";
import { toast } from "react-toastify";
import { Tabs,ClickAwayListener,Popper,Button } from "@mui/material";
import { OpenInFull } from "@mui/icons-material";
import {  EditorState,convertToRaw,convertFromHTML,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
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

const Cell = memo(
  ({ value: initialValue, row, column: { id, dataType, metadata,width} }) => {
   
  
    const dispatch = useDispatch();
    const [value, setValue] = useState({ value: initialValue, update: false });
    const [inputBoxShow, setInputBoxShow] = useState(false);
    const[cursor,setCursor]=useState(false);
    const [open, setOpen] = useState(false);
    const [imageLink, setImageLink] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [previewModal, setPreviewModal] = useState(false)
    const [selectedInput, setSelectedInput] = useState(null);
    const tableId = useSelector((state) => state.table.tableId)

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

    const [popperOpen, setPopperOpen] = useState(false);
    const [textarea, setTextarea] = useState(value?.value && value?.value?.toString() || "");
   

    const [editorState, setEditorState] = useState(() => {
      if (value?.value) {
        const contentState = convertFromHTML(value?.value?.toString().trim());
        return EditorState.createWithContent(ContentState.createFromBlockArray(contentState));
      } else {
        return EditorState.createEmpty();
      }
    });
    
    
    const handleInputChange = (event) => {
      const newValue = event.target.innerHTML;
      setValue({ value: newValue, update: true });
    };

    const handleClickButton = () => {
      setPopperOpen(true);
    };
    const handleClickAway = () => {
      setPopperOpen(false);
      setSelectedInput(null);
      setCursor(false);
    };

    const onEditorStateChange = (newEditorState) => {
      setEditorState(newEditorState);
      const contentState = newEditorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      const html = draftToHtml(rawContentState);
      setTextarea(html);
    };
    const handleInputBlur = (event) => {
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
            rowIndex: row.original.id || row.original?.["fld"+tableId.substring(3)+"autonumber"],
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
            rowIndex: row.original.id || row.original?.["fld"+tableId.substring(3)+"autonumber"],
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
            rowIndex:   row.original.id || row.original?.["fld"+tableId.substring(3)+"autonumber"],
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

      case "rowid":
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
      case "autonumber":
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
      <div
        contentEditable="true"
        onInput={handleInputChange}
        onClick={() => {
          setCursor(true);
          // handleInputClick(event);
        }}
        style={{ height: "35px", borderColor: "transparent", border: 0 }}
        className="data-input"
        onBlur={(event) => {
          setValue((old) => ({ value: old.value, update: true }));
          if (selectedInput === event.target) {
            if (!popperOpen) {
              setSelectedInput(null);
              setCursor(false);
            }
          }
          event.target.style.border = "none";
        }}
        // onFocus={handleInputClick}

        dangerouslySetInnerHTML={{ __html: value?.value }}
      ></div>

      {cursor && (
        <div
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          style={{
            position: "absolute",
            right: "1%",
            top: "32%",
            transform: "translateY(-50%)",
          }}
        >
          <OpenInFull
            style={{ fontSize: "15px", color: "blue" }}
            onClick={handleClickButton}
          />
        </div>
      )}

      {cursor && popperOpen && (
        <ClickAwayListener onClick={(e) => e.stopPropagation()} onClickAway={handleClickAway}>
          <Popper
            open={popperOpen}
            anchorEl={null}
            placement="center"
            style={{
              zIndex: 20,
              margin: "5px",
              backgroundColor: "whitesmoke",
              color: "white",
              width: "500px",
              height: "500px",
              whiteSpace: "pre-wrap",
              overflowX: "hidden",
              overflowY: "scroll",
              position: "fixed",
              left: "50%",
              top: "50%",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <div>
            
              <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                editorStyle={{ color: "black" }}
                autoFocus
                // toolbar={{
                //   inline: { inDropdown: true },
                //   list: { inDropdown: true },
                //   textAlign: { inDropdown: true },
                //   link: { inDropdown: true },
                //   history: { inDropdown: true },
                //   image: { uploadCallback: uploadImageCallBack},
                // }}
                
              />
    
              <Button
                variant="outlined"
                style={{ margin: "2px", color: "maroon", backgroundColor: "white" }}
                onClick={() => {
                  setValue({ value: textarea, update: true });
                }}
              >
                save
              </Button>
            </div>
          </Popper>
        </ClickAwayListener>
      )}
    </>
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
            
            style={!cursor?{caretColor:"transparent",backgroundColor:"transparent"}:{backgroundColor:"transparent"}}
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
            <TableCellMultiSelect  tableId = {tableId} row={row} value={value?.value || []} rowid={row.original.id} colid={id} setIsOpen={setIsOpen} isOpen={isOpen}  width ={width} /></div>)
        break;

      case "singleselect":
        element = (
          <div onClick={handleCellClick} style={{ display: 'flex', overflowX: "auto" }}>
            <TableCellSingleSelect   tableId = {tableId} row={row} metaData={metadata} value={value?.value} rowid={row.original.id} colid={id} setIsOpen={setIsOpen} isOpen={isOpen} />
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
                      <PreviewAttachment imageLink={imgLink} open={previewModal} tableId = {tableId}  setPreviewModal={setPreviewModal} rowId={row.original.id} columnId={id} row={row}/>
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
  headerGroups:PropTypes.any
};