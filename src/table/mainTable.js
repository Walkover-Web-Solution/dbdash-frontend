import React, { useState, useCallback, useEffect} from "react";
import {
  CompactSelection,
  DataEditor,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  addColumnrightandleft,
  deleteRows,
  updateCells,
  updateColumnHeaders,
} from "../store/table/tableThunk";
// import "@glideapps/glide-data-grid/dist/index.css";
import PropTypes from "prop-types";


import "./Glidedatagrid.css";
import "../../src/App.scss";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style.css";
import { reorderRows } from "./reorderRows.js";
import FieldPopupModal from "./fieldPopupModal/fieldPopupModal";
import { addColumn, addRow, editCell, reorderFuncton } from "./addRow";
import { useMemo } from "react";
import Headermenu from "./headerMenu";
import { useExtraCells } from "@glideapps/glide-data-grid-cells";
// import "@glideapps/glide-data-grid/dist/index.css";
// import { cloneDeep } from 'lodash';
import { getTableInfo } from "../store/table/tableSelector";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
import SelectFilepopup from "./selectFilepopup";
import { toast } from "react-toastify";
// import  debounce  from 'lodash.debounce';

export default function MainTable(props) {
  const params = useParams();
  const cellProps = useExtraCells();
  const dispatch = useDispatch();
  const fields1 = useSelector((state) => state.table.columns);
  const dataa = useSelector((state) => state.table.data) || [];
  const [selectedFieldName, setSelectedFieldName] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectValue, setSelectValue] = useState("longtext");
  const [open, setOpen] = useState(false);
  const [openAttachment, setOpenAttachment] = useState(null);
  const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);
  const [linkedValueName, setLinkedValueName] = useState("");
  const [textValue, setTextValue] = useState("");
  const [data, setData] = useState(dataa);
  const [metaData, setMetaData] = useState({});
  const [menu, setMenu] = useState();
  const [directionAndId, setDirectionAndId] = useState({});
  const [imageLink, setImageLink] = useState("");
  const [queryByAi, setQueryByAi] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredRow,setHoveredRow]=useState(false);
  const [targetColumn,setTargetColumn]=useState(0);

  const emptyselection = {
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
    current: undefined,
  };
  const [selection, setSelection] = useState(emptyselection);
  const [fields, setFields] = useState(fields1 || []);
  const tableInfo = useSelector((state) => getTableInfo(state));
  const tableId = tableInfo?.tableId;

  useEffect(() => {
    setData(dataa);
  }, [dataa]);

  const isSingleCellSelected=(selection)=>{
    return selection.current && (selection.current.range.height*selection.current.range.width==1);
  }
  const handleUploadFileClick = useCallback((cell) => {
    if (!data) return;
    const [col, row] = cell;
    const dataRow = data?.[row] || data?.[row - 1];
    const d = dataRow?.[fields?.[col]?.id];
    const index = cell?.[0];
    if (
      fields?.[index]?.dataType === "attachment"
    ) {
      setOpenAttachment({cell,d});

    }
  });
  document.addEventListener(
    "keydown",
    React.useCallback((event) => {
      if ((event.ctrlKey || event.metaKey) && event.code === "KeyF") {
        setShowSearch(!showSearch);
        event.stopPropagation();
        event.preventDefault();
      }
    }, [])
  );

  const onChangeUrl = (e, type) => {
    if(params?.templateId) return;

    const row = openAttachment?.cell[1];
    const col = openAttachment?.cell[0];
    if (imageLink !== null) {
      dispatch(
        updateCells({
          columnId: fields[col]?.id,
          rowIndex: dataa[row][`fld${tableId.substring(3)}autonumber`],
          value: null,
          imageLink: imageLink,
          dataTypes: type,
          indexIdMapping: {
            [dataa[row][`fld${tableId.substring(3)}autonumber`]]: row,
          },
        })
      ).then(() => {
        toast.success("Image uploaded successfully!");
      });
    }
    e.target.value = null;
    setImageLink(null);
  };

  const onChangeFile = (e, type) => {
    if(params?.templateId) return;

    const row = openAttachment?.cell[1];
    const col = openAttachment?.cell[0];
    if (e.target.files[0] != null) {
      dispatch(
        updateCells({
          columnId: fields[col]?.id,
          rowIndex: dataa[row][`fld${tableId.substring(3)}autonumber`],
          value: e.target?.files[0],
          imageLink: imageLink,
          dataTypes: type,
          indexIdMapping: {
            [dataa[row][`fld${tableId.substring(3)}autonumber`]]: row,
          },
        })
      ).then(() => {
        toast.success("Image uploaded successfully!");
      });
      }
    e.target.value = null;
  };

  const createLeftorRightColumn = () => {
    if(params?.templateId) return;

    if (
      directionAndId.direction == "left" ||
      directionAndId.direction == "right"
    ) {
      setOpen(false);
      dispatch(
        addColumnrightandleft({
          filterId: params?.filterName,
          fieldName: textValue,
          dbId: params?.dbId,
          tableId: params?.tableName,
          fieldType: selectValue,
          direction: directionAndId.direction,
          position: directionAndId.position,
          metaData: metaData,
          selectedTable,
          selectedFieldName: selectedFieldName,
          linkedValueName,
        })
      );
      setSelectValue("longtext");
      setDirectionAndId({});
    } else {
      var data1 = metaData;
      if (selectValue == "link") {
        data1.foreignKey = {
          fieldId: selectedFieldName,
          tableId: selectedTable,
        };
      }
      if (selectValue == "formula") {
        var queryToSend =
          JSON.parse(queryByAi.pgQuery)?.add_column?.new_column_name
            ?.data_type +
          ` GENERATED ALWAYS AS (${JSON.parse(queryByAi.pgQuery)?.add_column?.new_column_name
            ?.generated?.expression
          }) STORED;`;
      }
      setOpen(false);
      addColumn(
        dispatch,
        params,
        selectValue,
        metaData,
        textValue,
        selectedTable,
        selectedFieldName,
        linkedValueName,
        queryToSend,
        queryByAi.userQuery
      );
      setSelectValue("longtext");
    }
  };

  useEffect(() => {

    var newcolumn = [];
    fields1.forEach((column) => {
      if (column?.metadata?.hide !== true) {
        newcolumn.push(column);
      }
    });
  
    const targetIndex = newcolumn.findIndex((field) => {
      const dataType = field.dataType;
      return (
        dataType !== "autonumber" &&
        dataType !== "createdat" &&
        dataType !== "createdby" &&
        dataType !== "rowid" &&
        dataType !== "updatedby" &&
        dataType !== "updatedat"
      );
    });
  
    if (targetIndex !== -1) {
      setTargetColumn(targetIndex);
    }
  
    setFields(newcolumn);
  }, [fields1]);
  

  const addRows = () => {
    if(params?.templateId) return;

    addRow(dispatch);
  };

  const reorder = useCallback(
    (item, newIndex) => {
      if(params?.templateId) return;

      reorderFuncton(
        dispatch,
        item,
        newIndex,
        fields,
        fields1,
        params?.filterName,
        setFields
      );
    },
    [fields, fields1]
  );

  const handleRowMoved = useCallback(
    (from, to) => {
      if(params?.templateId) return;

      reorderRows(from, to, data, setData);
    },
    [data, setData]
  );

  const onCellEdited = useCallback(
    (cell, newValue) => {
      if(params?.templateId) return;
      if(fields[cell[0]]?.dataType == "attachment") return;
      if (fields[cell[0]]?.dataType == "multipleselect") {
        editmultipleselect(newValue, dataa[cell[1]][fields[cell[0]]?.id] || [], cell);
        return;
      }
      if (newValue?.readonly == true || newValue?.data == dataa[cell[1]][fields[cell[0]]?.id] ||
        (newValue?.data == "" && !dataa[cell[1]][fields[cell[0]]?.id])) return;
      if (fields[cell[0]].dataType == "singleselect") {
        newValue = newValue.data.value;
      }
     
      editCell(
        cell,
        newValue,
        dispatch,
        fields,
        params,
        dataa[cell?.[1] ?? []],
        fields[cell[0]].dataType,
   isSingleCellSelected(selection)

      );
    },
    [dataa,fields,selection]
  );
 const handleColumnResizeWithoutAPI=useCallback((_,newSize,colIndex)=>{

  let newarrr = [...(fields || fields1)];
  let obj = Object.assign({}, newarrr[colIndex]);
  obj.width = newSize;
  newarrr[colIndex] = obj;
  setFields(newarrr);
 });
  const handleColumnResize = (field, newSize) => {
      if(params?.templateId) return;

    dispatch(
      updateColumnHeaders({
        filterId: params?.filterName,
        dbId: params?.dbId,
        tableName: params?.tableName,
        columnId: field?.id,
        metaData: { width: newSize },
      })
    );
  };
  const editmultipleselect = (newValue, oldValuetags, cell) => {
    if(params?.templateId) return;

    if (!fields[cell[0]]?.id) return;
    const newValuetags = newValue.data.tags;
    const addedTags = newValuetags.filter((tag) => !oldValuetags.includes(tag));
    const removedTags = oldValuetags.filter((tag) => !newValuetags.includes(tag));
    const joinedString = addedTags.map((element) => `'${element}'`).join(",");
    let updateArray = [];
    const rowIndex = dataa[cell[1]][`fld${tableId.substring(3)}autonumber`];

    addedTags?.length > 0 &&
      updateArray.push({
        where: `fld${tableId.substring(3)}autonumber = ${rowIndex}`,
        fields: {
          [fields[cell[0]]?.id]: joinedString.slice(1, -1),
        },
      });
    removedTags?.length > 0 &&
      updateArray.push({
        where: `fld${tableId.substring(3)}autonumber = ${rowIndex}`,
        fields: {
          [fields[cell[0]]?.id]: { delete: removedTags },
        },
      });
    dispatch(
      updateCells({
        updatedArray: updateArray,
        indexIdMapping: { [rowIndex]: cell[1] },
      })
    );
  };

  const validateCell = useCallback(

    (cell, newValue) => {
      if(params?.templateId) return;

      if (newValue.kind === "number") {
        if (newValue?.data?.toString().length < 13 || !newValue?.data) {
          return newValue;
        } else return false;
      }
    },
    [dataa, fields]
  );

  const handleDeleteRow = (selection) => {
    if(params?.templateId) return;

    if (selection.current) {
      return;
    }
    const deletedRowIndices = [];

    for (const element of selection.rows.items) {
      const [start, end] = element;
      for (let i = start; i < end; i++) {
        deletedRowIndices.push(
          dataa[i][`fld${tableId.substring(3)}autonumber`]
        );
      }
    }

    if (deletedRowIndices.length > 0) {
      dispatch(deleteRows({ deletedRowIndices, dataa }));
    }
    setSelection(emptyselection);
  };

  const onHeaderMenuClick = useCallback((col, bounds) => {
    if(params?.templateId) return;
    
    setMenu({ col, bounds });
  }, []);

 

  const getData = useCallback(
    (cell) => {
      const [col, row] = cell;
      const dataRow = dataa[row] || [];

      if (dataRow) {
        const d = dataRow[fields[col]?.id];

        let { dataType } = fields[col] || "";
        // let linkdatatype=false;

        // if(dataType=='link')
        // {
        //   linkdatatype=true;
        //   dataType=fields[col]?.metadata?.foreignKey?.fieldType;

        // }

        if (dataType === "autonumber") {
          return {
            allowOverlay: true,
            kind: GridCellKind.Number,
            readonly: true,
            data: d || "",
            displayData: d?.toString() || "",
          };
        } 
        else if (
          dataType === "createdat" ||
          dataType === "createdby" ||
          dataType === "rowid" ||
          dataType === "updatedby" ||
          dataType === "updatedat"
        ) {
          
          let updatedtime=d;
          if(d!==null && dataType === "updatedat")
          updatedtime=new Date(d*1000)
          
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: true,

            displayData: (d && updatedtime.toString()) || "",
            data: (d && updatedtime.toString()) || "",
          };
        } 
        
        else if (dataType === "datetime") {
          const currentDate = d && !isNaN(new Date(d)) ? new Date(d) : null;
          if (currentDate instanceof Date && !isNaN(currentDate)) {
            const day = currentDate.getDate().toString().padStart(2, "0");
            const month = (currentDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const year = currentDate.getFullYear().toString().padStart(4, "0");
            const formattedDate = `${day}-${month}-${year}`;

            return {
              kind: GridCellKind.Custom,
              allowOverlay: true,
              copyData: "4",
              data: {
                kind: "date-picker-cell",
                date: currentDate,
                displayDate: formattedDate,
                format: "date",
              },
            };
          } else {
            // Handle invalid time value
            // For example, you can return a default value or show an error message
            return {
              kind: GridCellKind.Custom,
              allowOverlay: true,
              copyData: "4",
              data: {
                kind: "date-picker-cell",
                date: new Date(),
                displayDate: "",
                format: "date",
              },
            };
          }
        } else if (dataType === "longtext") {
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            allowWrapping: true,
            displayData: d || "",
            data: d || "",
          };

        }

        else if (dataType === "url") {
          return {
            kind: GridCellKind.Uri,
            allowOverlay: true,
            readonly: false,
            displayData: d || "",
            data: d || "",
          };
        }
        else if (dataType === "singlelinetext") {
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: d || "",

            data: d || "",
            wrapText: false,
            multiline: false,
          };
        } else if (dataType === "phone") {
          return {
            allowOverlay: true,
            kind: GridCellKind.Number,
            data: d || "",
            displayData: d || "",
          };
        } else if (dataType === "numeric") {
          return {
            allowOverlay: true,
            kind: GridCellKind.Number,
            data: d || "",
            displayData: d || "",
          };
        } else if (dataType === "multipleselect") {
          const possibleTags = fields[col]?.metadata?.option;
          // const row = 0; // Replace 0 with the appropriate row index
          let newarr = [];
          possibleTags &&
            possibleTags?.map((x) => {

              let newx = {
                tag: x.value,
                color: x.color,
              };
              newarr.push(newx);
            });
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: "4",
            data: {
              kind: "tags-cell",
              possibleTags: newarr || [],
              readonly: false,
              tags: d || [],
            },

          };
        } else if (dataType == "attachment" && d != null) {
          return {
            kind: GridCellKind.Image,
            data: d,
            // allowOverlay: true,
            allowAdd: true,
          };
        } else if (dataType === "singleselect") {
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d,
            data: {
              kind: "dropdown-cell",
              allowedValues: fields[col]?.metadata?.option || [],
              value: d || "",
            },
          };
        } 

        else if (dataType === "checkbox" ) {
               let show=false;
               if(d)
               {
                 if(typeof d=='string')
                 {
                   show=d=='true'?true:false;
                 }
                 else show=d;
               }
               return {
                 kind: GridCellKind.Boolean,
                 data: show,
                 allowOverlay: false,
               };
             }
       
       else {
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: d?.toString()|| "",
            data:  d?.toString() || "",
          };
        }
      } else {
        return {};
      }
    },
    [dataa, fields]
  );

  const realCols = useMemo(() => {
    return fields?.map((c) => ({
      ...c,
      hasMenu: true,
      icon: c.dataType
    }));
  }, [fields, fields1]);
  const headerIcons = (() => {

    return {

      rowid: p => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  fill="${p.bgColor}" class="bi bi-key-fill" viewBox="0 0 16 16"> <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/> </svg>`

      ,
      updatedby: p => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${p.bgColor}" class="bi bi-person-fill" viewBox="0 0 16 16"> <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/> </svg>
    `,
      autonumber: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.22 2H3.78C2.8 2 2 2.8 2 3.78v12.44C2 17.2 2.8 18 3.78 18h12.44c.98 0 1.77-.8 1.77-1.78L18 3.78C18 2.8 17.2 2 16.22 2z" fill="${p.bgColor}"/>
    <path d="M6.52 12.78H5.51V8.74l-1.33.47v-.87l2.29-.83h.05v5.27zm5.2 0H8.15v-.69l1.7-1.83a6.38 6.38 0 0 0 .34-.4c.09-.11.16-.22.22-.32s.1-.19.12-.27a.9.9 0 0 0 0-.56.63.63 0 0 0-.15-.23.58.58 0 0 0-.22-.15.75.75 0 0 0-.29-.05c-.27 0-.48.08-.62.23a.95.95 0 0 0-.2.65H8.03c0-.24.04-.46.13-.67a1.67 1.67 0 0 1 .97-.91c.23-.1.49-.14.77-.14.26 0 .5.04.7.11.21.08.38.18.52.32.14.13.25.3.32.48a1.74 1.74 0 0 1 .03 1.13 2.05 2.05 0 0 1-.24.47 4.16 4.16 0 0 1-.35.47l-.47.5-1 1.05h2.32v.8zm1.8-3.08h.55c.28 0 .48-.06.61-.2a.76.76 0 0 0 .2-.55.8.8 0 0 0-.05-.28.56.56 0 0 0-.13-.22.6.6 0 0 0-.23-.15.93.93 0 0 0-.32-.05.92.92 0 0 0-.29.05.72.72 0 0 0-.23.12.57.57 0 0 0-.21.46H12.4a1.3 1.3 0 0 1 .5-1.04c.15-.13.33-.23.54-.3a2.48 2.48 0 0 1 1.4 0c.2.06.4.15.55.28.15.13.27.28.36.47.08.19.13.4.13.65a1.15 1.15 0 0 1-.2.65 1.36 1.36 0 0 1-.58.49c.15.05.28.12.38.2a1.14 1.14 0 0 1 .43.62c.03.13.05.26.05.4 0 .25-.05.47-.14.66a1.42 1.42 0 0 1-.4.49c-.16.13-.35.23-.58.3a2.51 2.51 0 0 1-.73.1c-.22 0-.44-.03-.65-.09a1.8 1.8 0 0 1-.57-.28 1.43 1.43 0 0 1-.4-.47 1.41 1.41 0 0 1-.15-.66h1a.66.66 0 0 0 .22.5.87.87 0 0 0 .58.2c.25 0 .45-.07.6-.2a.71.71 0 0 0 .21-.56.97.97 0 0 0-.06-.36.61.61 0 0 0-.18-.25.74.74 0 0 0-.28-.15 1.33 1.33 0 0 0-.37-.04h-.55V9.7z" fill="${p.fgColor}"/> </svg>`
      ,


      url: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.222 2H3.778C2.8 2 2 2.8 2 3.778v12.444C2 17.2 2.8 18 3.778 18h12.444c.978 0 1.77-.8 1.77-1.778L18 3.778C18 2.8 17.2 2 16.222 2z" fill="${p.bgColor}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.29 4.947a3.368 3.368 0 014.723.04 3.375 3.375 0 01.041 4.729l-.009.009-1.596 1.597a3.367 3.367 0 01-5.081-.364.71.71 0 011.136-.85 1.95 1.95 0 002.942.21l1.591-1.593a1.954 1.954 0 00-.027-2.733 1.95 1.95 0 00-2.732-.027l-.91.907a.709.709 0 11-1.001-1.007l.915-.911.007-.007z" fill="${p.fgColor}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.55 8.678a3.368 3.368 0 015.082.364.71.71 0 01-1.136.85 1.95 1.95 0 00-2.942-.21l-1.591 1.593a1.954 1.954 0 00.027 2.733 1.95 1.95 0 002.73.028l.906-.906a.709.709 0 111.003 1.004l-.91.91-.008.01a3.368 3.368 0 01-4.724-.042 3.375 3.375 0 01-.041-4.728l.009-.009L6.55 8.678z" fill="${p.fgColor}"/>
</svg>`,

      attachment: p => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${p.bgColor}" class="bi bi-file-earmark-fill" viewBox="0 0 16 16"> <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/> </svg>`,
      longtext: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="16" height="16" rx="4" fill="${p.bgColor}"/>
      <path d="M4 7H16" stroke="${p.fgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 13H12" stroke="${p.fgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 10H10" stroke="${p.fgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
      singlelinetext: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="16" height="16" rx="4" fill="${p.bgColor}"/>
    <text x="10" y="14" fill="${p.fgColor}" font-family="Arial" font-size="12"  text-anchor="middle">A</text>
  </svg>`,

      numeric: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2" y="2" width="16" height="16" rx="4" fill="${p.bgColor}" stroke="${p.fgColor}" stroke-width="2"/>
<text x="10" y="14" fill="${p.fgColor}" font-family="Arial" font-size="12" text-anchor="middle">#</text>
</svg>`,
      checkbox: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2" y="2" width="16" height="16" rx="2" fill="${p.bgColor}" stroke="${p.fgColor}" stroke-width="2"/>
<path d="M6 10L9 13L14 8" stroke="${p.fgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      singleselect: p => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${p.bgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10" fill="${p.fgColor}" />
<path d="M7 10l5 5 5-5" />
</svg>`
      ,
      multipleselect: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="10" cy="10" r="8" fill="${p.bgColor}" stroke="${p.fgColor}" stroke-width="2"/>
  <path d="M6 10L8 12L14 6M6 14L8 16L14 10" stroke="${p.fgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      datetime: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 3H16V17H4V3Z" stroke="${p.bgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 1V5M12 1V5M4 8H16" stroke="${p.bgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      formula: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="2" y="2" width="16" height="16" rx="4" fill="${p.bgColor}"/>
  <text x="10" y="14" font-size="12" text-anchor="middle" fill="${p.fgColor}">f(x)</text>
</svg>`,
      email: p => `<svg width="20" height="20" viewBox="0 0 24 24" fill="${p.fgColor}" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 12.686L3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7L12 12.686ZM3 8.727V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V8.727L12 14.413L3 8.727Z" stroke="${p.bgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      link: p => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  fill="${p.bgColor}" class="bi bi-arrow-right-short" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/> </svg>`,
      phone: p => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${p.bgColor}" class="bi bi-telephone" viewBox="0 0 16 16"> <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/> </svg>`
      ,
      lookup: p => `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="8" r="7" stroke="${p.bgColor}" stroke-width="2"/>
<path d="M14.708 14.354l4.242 4.243" stroke="${p.bgColor}" stroke-width="2" stroke-linecap="round"/>
</svg>`,
      createdat: p => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${p.bgColor}" class="bi bi-clock" viewBox="0 0 16 16"> <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/> <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/> </svg>
    `,
      updatedat: p => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${p.bgColor}" class="bi bi-clock-history" viewBox="0 0 16 16"> <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/> <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/> <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/> </svg>
`,
      createdby: p => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${p.bgColor}" class="bi bi-person" viewBox="0 0 16 16"> <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/> </svg>`



    };
  })();

  const handlegridselection = (event) => {
    setSelection(event);
  };


 
const handleRightClickOnHeader=useCallback((col,event)=>{
  if(params?.templateId) return;

  event.preventDefault();
  setMenu({col,bounds:event.bounds});
})
  
  const getRowThemeOverride=(row)=>{
   if(row!=hoveredRow || open==true || menu!=null) return;
    return { bgCell: "rgba(62, 116, 253, 0.1)",bgCellMedium: "#DCEFFB"};
  }
  
  const getHoveredItemsInfo=(event)=>{
    setHoveredRow(event?.location[1]);
  }
  return (
    <>
      {JSON.stringify(selection) !== JSON.stringify(emptyselection) &&
        selection.rows.items.length > 0 && (
          <button
            className="fontsize"
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              right: "1%",
              top: "19.9%",
              zIndex: "10000",
              background: "none",
              border: "none",
              outline: "none",
              cursor: "pointer",
            }}
            onClick={() => handleDeleteRow(selection)}
          >
            <div className="deleterows">Delete Rows</div>
            <div>
              <DeleteOutlineIcon className="deletecolor"/>
            </div>
          </button>
        )}
      <div
        className="table-container"
        style={{ height:props?.height ||  `${(window?.screen?.height * 50) / 100}px` }}
      >
        <DataEditor
          {...cellProps}
          width={props?.width || window.screen.width}
          fillHandle={true}
          getCellContent={getData}
          onRowAppended={addRows}
          columns={realCols}
          rows={dataa.length}
          gridSelection={selection}
          rowMarkers="both"
          rowSelectionMode="multi"
          onItemHovered={getHoveredItemsInfo}
          onGridSelectionChange={handlegridselection}
          onCellEdited={onCellEdited}
          onRowMoved={handleRowMoved}
          validateCell={validateCell}
          onHeaderContextMenu={handleRightClickOnHeader}
          getCellsForSelection={true}
          showSearch={showSearch}
          getRowThemeOverride={getRowThemeOverride}
          onSearchClose={() => setShowSearch(false)}
          // gridSelection={handlegridselection}
          onCellActivated={handleUploadFileClick}
          onCellClicked={handleUploadFileClick}
          onColumnResize={handleColumnResizeWithoutAPI}
          onColumnResizeEnd={handleColumnResize}
          onHeaderMenuClick={onHeaderMenuClick} //iske niche ki 2 line mat hatana
          // gridSelection={{row:item.length === 0?CompactSelection.empty() : CompactSelection.fromSingleSelection(item)}}
          // onGridSelectionChange={(ele)=>{}}
          headerIcons={headerIcons}
          showMinimap={props?.minimap}

          onColumnMoved={reorder}
          onPaste={true}
          rightElement={
            <div className="addCol">
              <button onClick={() => setOpen(true)}>+</button>
            </div>
          }
          trailingRowOptions={{
            sticky: true,
            tint: true,
            hint: "New row...",
            targetColumn: targetColumn,
            // targetColumn: 4
          }}
        />
      </div>
      {open && (
        <FieldPopupModal
          title="create column"
          label="Column Name"
          setSelectedFieldName={setSelectedFieldName}
          tableId={params?.tableName}
          selectedFieldName={selectedFieldName}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          setSelectValue={setSelectValue}
          selectValue={selectValue}
          showFieldsDropdown={showFieldsDropdown}
          setShowFieldsDropdown={setShowFieldsDropdown}
          open={open}
          metaData={metaData}
          setMetaData={setMetaData}
          setOpen={setOpen}
          queryByAi={queryByAi}
          setQueryByAi={setQueryByAi}
          submitData={createLeftorRightColumn}
          linkedValueName={linkedValueName}
          setLinkedValueName={setLinkedValueName}
          textValue={textValue}
          setTextValue={setTextValue}
        />
      )}
      <Headermenu
        menu={menu}
        setMenu={setMenu}
        setOpen={setOpen}
        setDirectionAndId={setDirectionAndId}
        fields={fields}
      />

      {openAttachment && (
        <SelectFilepopup
          title="uplaodfile"
          label="UploadFileIcon"
          attachment={openAttachment}
          open={openAttachment ? true : false}
          setImageLink={setImageLink}
          onChangeUrl={onChangeUrl}
          setOpen={setOpenAttachment}
          imageLink={imageLink}
          onChangeFile={onChangeFile}
        />
      )}
    </>
  );
}
MainTable.propTypes = {
  minimap: PropTypes.any,
  height:PropTypes.any,
  width:PropTypes.any,
}