import React, { useState, useCallback, useEffect } from "react";
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

export default function MainTable() {
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
    console.log("isSingleCellSelected",selection)
    return selection.current && (selection.current.range.height*selection.current.range.width==1);
  }
  const handleUploadFileClick = useCallback((cell) => {
    if (!data) return;
    const [col, row] = cell;
    const dataRow = data?.[row] || data?.[row - 1];
    const d = dataRow?.[fields?.[col]?.id];
    const index = cell?.[0];
    if (
      fields?.[index]?.dataType === "attachment" &&
      (d == undefined || d?.length === 0)
    ) {
      setOpenAttachment(cell);
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
    const row = openAttachment[1];
    const col = openAttachment[0];
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
  };

  const onChangeFile = (e, type) => {
    const row = openAttachment[1];
    const col = openAttachment[0];
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
          ` GENERATED ALWAYS AS (${
            JSON.parse(queryByAi.pgQuery)?.add_column?.new_column_name
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
      if (column?.metadata?.hide != true) {
        newcolumn.push(column);
      }
    });
    setFields(newcolumn);
  }, [fields1]);

  const addRows = () => {
    addRow(dispatch);
  };

  const reorder = useCallback(
    (item, newIndex) => {
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
      reorderRows(from, to, data, setData);
    },
    [data, setData]
  );

  const onCellEdited = useCallback(
    (cell, newValue) => {
      if (fields[cell[0]]?.dataType == "multipleselect") {
        editmultipleselect(newValue,dataa[cell[1]][fields[cell[0]]?.id] || [],cell);
        return;
      }
      if (newValue?.readonly == true ||newValue?.data == dataa[cell[1]][fields[cell[0]]?.id] ||
        (newValue?.data == "" && !dataa[cell[1]][fields[cell[0]]?.id]) ) return;
      if (fields[cell[0]].dataType == "singleselect") {
        newValue =  newValue.data.value ;
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

  const handleColumnResize = (field, newSize, colIndex) => {
    let newarrr = [...(fields || fields1)];
    let obj = Object.assign({}, newarrr[colIndex]);
    obj.width = newSize;
    newarrr[colIndex] = obj;
    setFields(newarrr);
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
    
      if (newValue.kind === "number") {
        if (newValue?.data?.toString().length < 13 || !newValue?.data) {
          return newValue;
        } else return false;
      }
    },
    [dataa, fields]
  );

  const handleDeleteRow = (selection) => {
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
        } else if (
          dataType === "createdat" ||
          dataType === "createdby" ||
          dataType === "rowid" ||
          dataType === "updatedby" ||
          dataType === "updatedat"
        ) {
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: true,

            displayData: d || "",
            data: d || "",
          };
        } else if (dataType === "datetime") {
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
            displayData: d || "",
            data: d || "",
          };
        
        } 

        else if (dataType === "uri") {
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
            allowOverlay: true,
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
            displayData: d || "",
            data: d || "",
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
    }));
  }, [fields, fields1]);

  const handlegridselection = (event) => {
    setSelection(event);
  };

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
            <div style={{ marginTop: "5px" }}>Delete Rows</div>
            <div>
              <DeleteOutlineIcon />
            </div>
          </button>
        )}
      <div
        className="table-container"
        style={{ height: `${(window?.screen?.height * 50) / 100}px` }}
      >
        <DataEditor
          {...cellProps}
          width={window.screen.width}
          fillHandle={true}
          getCellContent={getData}
          onRowAppended={addRows}
          columns={realCols}
          rows={dataa.length}
          gridSelection={selection}
          rowMarkers="both"
          rowSelectionMode="multi"
          onGridSelectionChange={handlegridselection}
          onCellEdited={onCellEdited}
          onRowMoved={handleRowMoved}
          validateCell={validateCell}
          getCellsForSelection={true}
          showSearch={showSearch}
          onSearchClose={() => setShowSearch(false)}
          // gridSelection={handlegridselection}
          onCellClicked={handleUploadFileClick}
          onColumnResizeEnd={handleColumnResize}
          onHeaderMenuClick={onHeaderMenuClick} //iske niche ki 2 line mat hatana
          // gridSelection={{row:item.length === 0?CompactSelection.empty() : CompactSelection.fromSingleSelection(item)}}
          // onGridSelectionChange={(ele)=>{}}

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
            targetColumn: realCols.length - 1,
            render: () => (
              <select className="dropdown">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                {/* Add more options as needed */}
              </select>
            ),
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
