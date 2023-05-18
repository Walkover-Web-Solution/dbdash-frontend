import React, { useState, useEffect } from "react";
import { usePopper } from "react-popper";
import { useDispatch, useSelector } from "react-redux";
import { grey } from "./colors";
import ArrowUpIcon from "./img/ArrowUp";
import ArrowDownIcon from "./img/ArrowDown";
import ArrowLeftIcon from "./img/ArrowLeft";
import ArrowRightIcon from "./img/ArrowRight";
import TrashIcon from "./img/Trash";
import TextIcon from "./Text";
import MultiIcon from "./img/Multi";
import HashIcon from "./img/Hash";
import PlusIcon from "./img/Plus";
import { shortId } from "./utils";
import PlusOneIcon from '@mui/icons-material/PlusOne';
import CheckIcon from '@mui/icons-material/Check';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FunctionsIcon from '@mui/icons-material/Functions';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import ReadMoreOutlinedIcon from '@mui/icons-material/ReadMoreOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ContentCopySharpIcon from '@mui/icons-material/ContentCopySharp';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import { addColumnrightandleft, addColumsToLeft, deleteColumns, updateColumnHeaders, updateColumnsType } from "../store/table/tableThunk";
import { getTableInfo } from "../store/table/tableSelector";
import FieldPopupModal from "./fieldPopupModal/fieldPopupModal";
import { getQueryByAi } from "../api/fieldApi"
import PropTypes from 'prop-types';
import DuplicateFieldPopup from "./duplicateFieldPopup";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input style={{ marginTop: "8px" }} type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)
export default function Header({
  column: { id, created, label, dataType, getResizerProps, getHeaderProps, metadata }, setSortBy, getToggleAllRowsSelectedProps }) {
  const dispatch = useDispatch();
  const [textValue, setTextValue] = useState('');
  const [queryByAi, setQueryByAi] = useState(false)
  const [selectValue, setSelectValue] = useState('longtext');
  const tableInfo = useSelector((state) => getTableInfo(state));
  const [metaData, setMetaData] = useState({});
  const [open, setOpen] = useState(false);
  const [showduplicate, setShowDuplicate] = useState(false);
  const [directionAndId, setDirectionAndId] = useState({})
  const [selectedTable, setSelectedTable] = useState("");
  const [linkedValueName, setLinkedValueName] = useState("")
  const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);
  const [selectedFieldName, setSelectedFieldName] = useState(false);
  const [duplicateField, setDuplicateField] = useState(true);


  const handleOpen = () => {
    setOpen(true);
    setExpanded(false);
  }
  const handleOpenDuplicate = () => {
    setShowDuplicate(true)
    setExpanded(false);
  }

  const createColumn = async (userQuery) => {
    if (!userQuery) {
      var dataa = metaData;
      if (selectValue == "link") {
        dataa.foreignKey = {
          fieldId: selectedFieldName,
          tableId: selectedTable
        }
      }
      setOpen(false);

      var queryToSend = JSON.parse(queryByAi)?.add_column?.new_column_name?.data_type + ` GENERATED ALWAYS AS (${JSON.parse(queryByAi)?.add_column?.new_column_name?.generated?.expression}) STORED;`
      dispatch(addColumsToLeft({
        columnId: 999999, focus: false, fieldName: textValue, dbId: tableInfo?.dbId, tableId: tableInfo?.tableId, fieldType: selectValue, query: queryToSend, metaData: metaData, selectedTable, selectedFieldName, linkedValueName,
      }));
      setSelectValue('longtext')
      setQueryByAi(false)
    }
    else {
      const response = await getQueryByAi(tableInfo?.dbId, tableInfo?.tableId, { userQuery: userQuery })
      setQueryByAi(response?.data?.data);
    }
  }

  const createLeftorRightColumn = () => {
    setOpen(false);
    dispatch(addColumnrightandleft({
      fieldName: textValue, dbId: tableInfo?.dbId, tableId: tableInfo?.tableId, fieldType:
        selectValue, direction: directionAndId.direction, position: directionAndId.position, metaData: metaData, selectedTable, selectedFieldName, linkedValueName
    }));
    setSelectValue('longtext')

  }
  const duplicateFields = (props) => {
    setShowDuplicate(false);
    dispatch(addColumnrightandleft({
      dbId: tableInfo?.dbId,
      tableId: tableInfo?.tableId, ...props
    }));
    setSelectValue();
  }

  const [expanded, setExpanded] = useState(created || false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    strategy: "absolute"
  });
  const [header, setHeader] = useState(label);
  const [typeReferenceElement, setTypeReferenceElement] = useState(null);
  const [typePopperElement, setTypePopperElement] = useState(null);
  const [showType, setShowType] = useState(false)

  const types = [
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "text"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <AttachFileIcon fontSize="2px" />,
      label: "attachment"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "checkbox"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <CheckIcon fontSize="2px" />,
      label: "checkbox"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "datetime"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <DateRangeIcon fontSize="2px" />,
      label: "date and time"
    },

    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "varchar"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <EmailIcon fontSize="2px" />,
      label: "email"
    },

    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "text"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <ReadMoreOutlinedIcon fontSize="2px" />,
      label: "link"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "text"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <ManageSearchOutlinedIcon fontSize="2px" />,
      label: "lookup"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "text"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <TextIcon />,
      label: "long text"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "numeric"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <HashIcon />,
      label: "numeric"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "varchar"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <LocalPhoneIcon fontSize="2px" />,
      label: "Phone number"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "text"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <ManageSearchOutlinedIcon fontSize="2px" />,
      label: "rowid"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "singleselect",
          metaData: metaData
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <ExpandCircleDownOutlinedIcon fontSize="2px" />,
      label: "single select"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "multipleselect",
          metaData: metaData
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <QueueOutlinedIcon fontSize="2px" />,
      label: "Multiselect"
    },
    {
      onClick: () => {
        dispatch(updateColumnsType({
          columnId: id,
          dataType: "text"
        }))
        setShowType(false);
        setExpanded(false);
      },
      icon: <TextFormatIcon fontSize="2px" />,
      label: "singlelinetext"
    }

  ];

  const buttons = [
    {
      onClick: () => {
        dispatch(updateColumnHeaders({
          type: "updateColumnHeader",
          columnId: id,
          label: header
        }));
        setSortBy([{ id: id, desc: false }]);
        setExpanded(false);
      },
      icon: <ArrowUpIcon />,
      label: "Sort ascending"
    },
    {
      onClick: () => {
        dispatch(updateColumnHeaders({
          type: "updateColumnHeader",
          columnId: id,
          label: header
        }));
        setSortBy([{ id: id, desc: true }]);
        setExpanded(false);
      },
      icon: <ArrowDownIcon />,
      label: "Sort descending"
    },
    {
      onClick: () => {
        handleOpen();
        setDirectionAndId({
          direction: "left",
          position: id
        });
        setExpanded(false);
      },
      icon: <ArrowLeftIcon />,
      label: "Insert left"
    },
    {
      onClick: () => {
        setOpen(true);
        setDirectionAndId({
          direction: "right",
          position: id
        });
        setExpanded(false);
      },
      icon: <ArrowRightIcon />,
      label: "Insert right"
    },

  ];

  if (dataType !== "createdat" && dataType !== "createdby" && dataType !== "rowid" && dataType !== "autonumber") {
    buttons.push({
      onClick: () => {
        setExpanded(false);
        handleOpenDuplicate();
      },
      icon: <ContentCopySharpIcon fontSize="1px" />,
      label: "Duplicate Field"
    });
  }

  if (dataType !== "createdat" && dataType !== "createdby" && dataType !== "rowid" && dataType !== "autonumber") {
    buttons.push({
      onClick: () => {
        dispatch(deleteColumns({
          label: header,
          columnId: id,
          fieldName: id,
          fieldDataType: dataType,
          tableId: tableInfo?.tableId,
          dbId: tableInfo?.dbId
        }));
        setExpanded(false);
      },
      icon: <TrashIcon />,
      label: "Delete"
    });
  }



  let propertyIcon;
  switch (dataType) {
    case "singlelinetext":
      propertyIcon = (metadata?.unique ? <><TextFormatIcon fontSize="2px" /> <KeyOutlinedIcon fontSize="2px" /></> : <TextFormatIcon fontSize="2px" />);
      break;
    case "formula":
      propertyIcon = <FunctionsIcon fontSize="2px" />;
      break;
    case "datetime":
      propertyIcon = <DateRangeIcon fontSize="2px" />;
      break;
    case "checkbox":
      propertyIcon = <CheckIcon fontSize="2px" />;
      break;
    case "numeric":
      propertyIcon = (metadata?.unique ? <><HashIcon fontSize="2px" /> <KeyOutlinedIcon fontSize="2px" /></> : <HashIcon />);
      break;
    case "longtext":
      propertyIcon = (metadata?.unique ? <><TextIcon /> <KeyOutlinedIcon fontSize="2px" /></> : <TextIcon />);
      break;
    case "singleselect":
      propertyIcon = <ExpandCircleDownOutlinedIcon fontSize="2px" />;
      break;
    case "multiselect":
      propertyIcon = <MultiIcon fontSize="2px" />;
      break;
    case "createdby":
      propertyIcon = <PersonPinIcon fontSize="2px" />;
      break;
    case "createdat":
      propertyIcon = <MoreTimeIcon fontSize="2px" />;
      break;
    case "attachment":
      propertyIcon = <AttachFileIcon fontSize="2px" />;
      break;
    case "link":
      propertyIcon = (metadata?.foreignKey.fieldId && metadata?.foreignKey.tableId ? <><TextIcon /> <ReadMoreOutlinedIcon fontSize="2px" /></> : <TextIcon />);
      break;
    case "lookup":
      propertyIcon = <ManageSearchOutlinedIcon fontSize="2px" />;
      break;
    case "rowid":
      propertyIcon = <FormatListNumberedIcon fontSize="2px" />;
      break;
    case "email":
      propertyIcon = <EmailIcon fontSize="2px" />;
      break;
    case "phone":
      propertyIcon = <LocalPhoneIcon fontSize="2px" />;
      break;
    case "multipleselect":
      propertyIcon = <QueueOutlinedIcon fontSize="2px" />;
      break;
    case "autonumber":
      propertyIcon = <PlusOneIcon fontSize="2px" />;
      break;

    default:
      propertyIcon = <MultiIcon />;
      break;
  }

  useEffect(() => {
    setHeader(label);
  }, [label]);

  useEffect(() => {
    if (inputRef) {
      // inputRef.focus();
      // inputRef.select();
    }
  }, [inputRef]);

  const typePopper = usePopper(typeReferenceElement, typePopperElement, {
    placement: "right",
    strategy: "fixed"
  });

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      dispatch(updateColumnHeaders({
        columnId: id,
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: id,
        label: header
      }))
      setExpanded(false);
    }
  }

  function handleChange(e) {
    setHeader(e.target.value);
  }

  function handleBlur(e) {
    e.preventDefault();
    if (id != header) {
      dispatch(updateColumnHeaders({
        columnId: id,
        dbId: tableInfo?.dbId,
        tableName: tableInfo?.tableId,
        fieldName: id,
        label: header
      }))
    }
  }

  const handleClose = () => {
    setShowDuplicate(false);
  };

  const handleDuplicate = () => {
    duplicateFields({
      direction: "right", position: id, duplicateField: `${duplicateField}`
    });
  };

  const handleUniqueChange = () => {
    setDuplicateField((isDuplicate) =>
      !isDuplicate
    )
  };

  return <>
    <DuplicateFieldPopup
      open={showduplicate}
      handleClose={handleClose}
      handleDuplicate={handleDuplicate}
      handleUniqueChange={handleUniqueChange}
      duplicateField={duplicateField}
    /> {id == 999999 || id == 9999991 ? (
      <>

        {id == 999999 ? <div {...getHeaderProps({ style: { display: "inline-block", backgroundColor: '#E8E8E8' } })} className='th noselect'>
          <div
            className='th-content'
            style={{ display: "flex", justifyContent: "center", }}
            onClick={handleOpen}>
            <span className='svg-icon-sm svg-gray' style={{ marginTop: 3.8 }}>
              <PlusIcon />
            </span>
          </div>
          <FieldPopupModal title="create column" label="Column Name" queryByAi={queryByAi} setSelectedFieldName={setSelectedFieldName} selectedFieldName={selectedFieldName} setShowFieldsDropdown={setShowFieldsDropdown} tableId={tableInfo?.tableId} showFieldsDropdown={showFieldsDropdown} selectedTable={selectedTable} setSelectedTable={setSelectedTable} textValue={textValue} metaData={metaData} linkedValueName={linkedValueName} setLinkedValueName={setLinkedValueName} setMetaData={setMetaData} setTextValue={setTextValue} setSelectValue={setSelectValue} open={open} setOpen={setOpen} submitData={createColumn}
          />

        </div > :
          <div  {...getHeaderProps({ style: { display: "inline-block", flex: "none", width: "20px" } })} className='th noselect'
          >
            <div
              className='th-content' >
              <span className='svg-icon svg-gray icon-margin' style={{ marginTop: "6.5px", marginBottom: "1px" }} >
                <IndeterminateCheckbox  {...getToggleAllRowsSelectedProps()} />
              </span>
            </div>
          </div>}
      </>
    ) : (
      <>
        <div {...getHeaderProps({ style: { width: "100%" } })} className='th noselect'>
          <div className='th-content' onDoubleClick={() => setExpanded(true)} ref={setReferenceElement}>
            <span className='svg-icon svg-gray icon-margin'>{propertyIcon}</span>
            {label}
          </div>
          <div {...getResizerProps()} className='resizer' />
        </div>
        <FieldPopupModal title="create column" label="Column Name" setSelectedFieldName={setSelectedFieldName} queryByAi={queryByAi} tableId={tableInfo?.tableId} selectedFieldName={selectedFieldName} selectedTable={selectedTable} setSelectedTable={setSelectedTable} setSelectValue={setSelectValue} textValue={textValue} metaData={metaData} setMetaData={setMetaData} setShowFieldsDropdown={setShowFieldsDropdown} linkedValueName={linkedValueName} setLinkedValueName={setLinkedValueName} showFieldsDropdown={showFieldsDropdown} setTextValue={setTextValue} open={open} setOpen={setOpen} submitData={createLeftorRightColumn}
        />
        {expanded && <div className='overlay' onClick={() => setExpanded(false)} />}
        {expanded && (
          <div ref={setPopperElement} style={{ ...styles.popper, zIndex: 3 }} {...attributes.popper}>
            <div
              className='bg-white shadow-5 border-radius-md'
              style={{
                width: 240
              }}>
              <div style={{ paddingTop: "0.75rem", paddingLeft: "0.75rem", paddingRight: "0.75rem" }}>
                <div className='is-fullwidth' style={{ marginBottom: 12 }} >
                  <input
                    className='form-input'
                    ref={setInputRef}
                    type='text'
                    value={header}
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <span className='font-weight-600 font-size-75' style={{ textTransform: "uppercase", color: grey(500) }}>
                  Property Type
                </span>
              </div>
              <div style={{ padding: "4px 0px" }}>
                <button
                  className='sort-button'
                  type='button'
                  onMouseEnter={() => setShowType(true)}
                  onMouseLeave={() => setShowType(false)}
                  ref={setTypeReferenceElement}>
                  <span className='svg-icon svg-text icon-margin'>{propertyIcon}</span>
                  <span style={{ textTransform: "capitalize" }}>{dataType}</span>
                </button>
                {showType && (
                  <div
                    className='shadow-5 bg-white border-radius-m'
                    ref={setTypePopperElement}
                    onMouseEnter={() => setShowType(true)}
                    onMouseLeave={() => setShowType(false)}
                    {...typePopper.attributes.popper}
                    style={{
                      ...typePopper.styles.popper,
                      width: 200,
                      backgroundColor: "white",
                      zIndex: 4,
                      padding: "4px 0px"
                    }}>
                    {types.map((type, index) => (
                      <button key={index} className='sort-button' onClick={type.onClick}>
                        <span key={index} className='svg-icon svg-text icon-margin'>{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div
                key={shortId()}
                style={{
                  borderTop: `2px solid ${grey(200)}`,
                  padding: "4px 0px"
                }}>
                {buttons.map((button, index) => (
                  <button type='button' key={index} className='sort-button'
                    onClick={() => button.onClick()}
                  >
                    <span key={index} className='svg-icon svg-text icon-margin'>{button.icon}</span>
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </>

    )}
  </>
}

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.any
}
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';
Header.propTypes = {
  rows: PropTypes.any,
  column: PropTypes.any,
  setSortBy: PropTypes.any,
  dataDispatch: PropTypes.any,
  row: PropTypes.any,
  getToggleAllRowsSelectedProps: PropTypes.any
};