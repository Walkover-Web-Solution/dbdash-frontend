
import React, {useRef, useMemo,useEffect,useState} from 'react';
import { useDrop, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import ItemTypes from "./ItemTypes";



//From Headers

// import { usePopper } from "react-popper";
// import { grey } from "./colors";
// import ArrowUpIcon from "./img/ArrowUp";
// import ArrowDownIcon from "./img/ArrowDown";
// // import ArrowLeftIcon from "./img/ArrowLeft";
// // import ArrowRightIcon from "./img/ArrowRight";
// import TrashIcon from "./img/Trash";
// import TextIcon from "./Text";
// import MultiIcon from "./img/Multi";
// import HashIcon from "./img/Hash";
// import PlusIcon from "./img/Plus";
// import { useDispatch, useSelector } from "react-redux";
// import { shortId } from "./utils";
// import { addColumsToLeft, deleteColumns, updateColumnHeaders, updateColumnsType } from "../store/table/tableThunk";
// // import PopupModal from "../component/popupModal";
// import { getTableInfo } from "../store/table/tableSelector";
// import FieldPopupModal from "./fieldPopupModal";
// import CheckIcon from '@mui/icons-material/Check';


import PropTypes from 'prop-types';



export default function DraggableHeader({ columns,
  index, reoder, key,

  // From Headers
  // column: {  created,  dataType, getResizerProps, getHeaderProps },
  // setSortBy,
      })
  {


  //   //From Headers

  //   const dispatch = useDispatch();
  // const [textValue, setTextValue] = useState('');
  // const [selectValue, setSelectValue] = useState('Text');
  // const tableInfo = useSelector((state) => getTableInfo(state));
  // const [open, setOpen] = useState(false);

  // const handleOpen = () => {
  //   setOpen(true);
  //   setExpanded(false);
  // }
  // const createLeftColumn = () => {
  //   setOpen(false);
  //   dispatch(addColumsToLeft({
  //     columnId: 999999, focus: false, fieldName: textValue, dbId: tableInfo?.dbId, tableId: tableInfo?.tableId, fieldType: selectValue
  //   }));
  // }
  // const [expanded, setExpanded] = useState(created || false);
  // const [referenceElement, setReferenceElement] = useState(null);
  // const [popperElement, setPopperElement] = useState(null);
  // const [inputRef, setInputRef] = useState(null);
  // const { styles, attributes } = usePopper(referenceElement, popperElement, {
  //   placement: "bottom",
  //   strategy: "absolute"
  // });
  // const [header, setHeader] = useState(label);
  // const [typeReferenceElement, setTypeReferenceElement] = useState(null);
  // const [typePopperElement, setTypePopperElement] = useState(null);
  // const [showType, setShowType] = useState(false);

  // const buttons = [
  //   {
  //     onClick: () => {
  //       dispatch(updateColumnHeaders({
  //         type: "updateColumnHeader",
  //         columnId: id,
  //         label: header
  //       }))
  //       setSortBy([{ id: id, desc: false }]);
  //       setExpanded(false);
  //     },
  //     icon: <ArrowUpIcon />,
  //     label: "Sort ascending"
  //   },
  //   {
  //     onClick: () => {
  //       dispatch(updateColumnHeaders({
  //         type: "updateColumnHeader",
  //         columnId: id,
  //         label: header
  //       }))
  //       setSortBy([{ id: id, desc: true }]);
  //       setExpanded(false);
  //     },
  //     icon: <ArrowDownIcon />,
  //     label: "Sort descending"
  //   },

  //   {
  //     onClick: () =>
  //      {

  //       dispatch(deleteColumns({
  //         label: header,
  //         columnId: id,
  //         fieldName: id,
  //         tableId: tableInfo?.tableId,
  //         dbId: tableInfo?.dbId
  //       }))
  //       setExpanded(false);

  //     },
  //     icon: <TrashIcon />,
  //     label: "Delete"
  //   }
  // ];

  // const types = [
  //   {
  //     onClick: () => {
  //       dispatch(updateColumnsType({
  //         columnId: id,
  //         dataType: "select"
  //       }))
  //       setShowType(false);
  //       setExpanded(false);
  //     },
  //     icon: <MultiIcon />,
  //     label: "Select"
  //   },
  //   {
  //     onClick: () => {
  //       dispatch(updateColumnsType({
  //         columnId: id,
  //         dataType: "text"
  //       }))
  //       setShowType(false);
  //       setExpanded(false);
  //     },
  //     icon: <TextIcon />,
  //     label: "Text"
  //   },
  //   {
  //     onClick: () => {
  //       dispatch(updateColumnsType({
  //         columnId: id,
  //         dataType: "integer"
  //       }))
  //       setShowType(false);
  //       setExpanded(false);
  //     },
  //     icon: <HashIcon />,
  //     label: "Integer"
  //   },
  //   {
  //     onClick: () => {
  //       dispatch(updateColumnsType({
  //         columnId: id,
  //         dataType: "varchar"
  //       }))
  //       setShowType(false);
  //       setExpanded(false);
  //     },
  //     icon: <TextIcon />,
  //     label: "Varchar"
  //   },
  //   {
  //     onClick: () => {
  //       dispatch(updateColumnsType({
  //         columnId: id,
  //         dataType: "checkbox"
  //       }))
  //       setShowType(false);
  //       setExpanded(false);
  //     },
  //     icon: <CheckIcon fontSize="2px" />,
  //     label: "checkbox"
  //   },
  //   {
  //     onClick: () => {
  //       dispatch(updateColumnsType({
  //         columnId: id,
  //         dataType: "datetime"
  //       }))
  //       setShowType(false);
  //       setExpanded(false);
  //     },
  //     label: "date and time"
  //   },
  // ];

  // let propertyIcon;
  // switch (dataType) {
  //   case "varchar":
  //     propertyIcon = <TextIcon />;
  //     break;
  //   case "datetime":
  //     propertyIcon = <TextIcon />;
  //     break;
  //   case "checkbox":
  //     propertyIcon = <CheckIcon fontSize="2px" />;
  //     break;
  //   case "integer":
  //     propertyIcon = <HashIcon />;
  //     break;
  //   case "text":
  //     propertyIcon = <TextIcon />;
  //     break;
  //   case "select":
  //     propertyIcon = <MultiIcon />;
  //     break;
  //   case "createdby":
  //     propertyIcon = <TextIcon />;
  //     break;
  //     case "createdat":
  //     propertyIcon = <TextIcon />;
  //     break;
  //   default:
  //     break;
  // }

  // useEffect(() => {
  //   if (created) {
  //     setExpanded(true);
  //   }
  // }, [created]);

  // useEffect(() => {
  //   setHeader(label);
  // }, [label]);

  // useEffect(() => {
  //   if (inputRef) {
  //     // inputRef.focus();
  //     // inputRef.select();
  //   }
  // }, [inputRef]);

  // const typePopper = usePopper(typeReferenceElement, typePopperElement, {
  //   placement: "right",
  //   strategy: "fixed"
  // });

  // function handleKeyDown(e) {
  //   if (e.key === "Enter") {
  //     dispatch(updateColumnHeaders({
  //       columnId: id,
  //       dbId: tableInfo?.dbId,
  //       tableName: tableInfo?.tableId,
  //       fieldName: id,
  //       label: header
  //     }))
  //     setExpanded(false);
  //   }
  // }

  // function handleChange(e) {
  //   setHeader(e.target.value);
  // }

  // function handleBlur(e) {
  //   e.preventDefault();
  //   if(id != header )
  //   {
  //     dispatch(updateColumnHeaders({
  //     columnId: id,
  //     dbId: tableInfo?.dbId,
  //     tableName: tableInfo?.tableId,
  //     fieldName: id,
  //     label: header
  //   }))
  // }
  // }


  //Not From Headers

  // const ItemTypes = {
  //     COLUMN: 'column'
  //   };
  const ref = useRef();
  const { id, label } = columns;

  const Header = label
  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    // collect: (monitor) => ({
    //   isOver: monitor.isOver(),
    //   canDrop: monitor.canDrop(),
    // })
    drop: (monitor) => (
        reoder(monitor, index)
    )
  })
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: ItemTypes.COLUMN },
    begin: () => {
      return {
        id,
        index,
        header: Header
      };
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  const memoizedColumn = useMemo(() => columns.render("Header"), [columns]);
  // console.log("columns", columns);
  const opacity = isDragging ? 0 : 1;

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (

    <>
      <div className='td bg-white shadow-5 border-radius-md' key={key}
        ref={ref}
        {...columns.getHeaderProps({ style: { display: "inline-block" ,cursor: "move", opacity} })}
        // style={{ cursor: "move", opacity }}
        onMouseEnter={() => setShowType(true)}
        onMouseLeave={() => setShowType(false)}
      >
        {memoizedColumn}
      </div>
    </>

  );

}

DraggableHeader.propTypes = {
  columns: PropTypes.any,
  index: PropTypes.number,
  reoder: PropTypes.func,
  key: PropTypes.number,
}