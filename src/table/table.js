import React, { useMemo, useEffect } from "react";
import clsx from "clsx";
import { useTable, useFlexLayout, useResizeColumns, useRowSelect, useSortBy } from "react-table";
import Cell from "./Cell";
import Header from "./Header";
import PlusIcon from "./img/Plus";
import PropTypes from 'prop-types';
import { cloneDeep } from "lodash";
import { useCellRangeSelection } from 'react-table-plugins'
import { addRows ,deleteRows} from "../store/table/tableThunk";
import { updateTableData } from "../store/table/tableSlice";
import { Button } from "@mui/material";

const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell: Cell,
  Header: Header,
  sortType: "alphanumericFalsyLast"
};

export default function Table({ columns, data,dispatch:dataDispatch, skipReset }) {

  // const [selectedRange, setSelectedRange] = useState({});  
  // console.log(selectedRange);
  const handleCopy = (event, value) => {
    event.clipboardData.setData('text/plain', value);
    event.preventDefault();
    document.execCommand('copy');
  };
  const handlePaste = (event,row,cell) => {
    event.preventDefault();
      const text = event.clipboardData.getData('text/plain');
       const newData = cloneDeep(data);
       newData[row][cell.column.id] = text.trim();

    dataDispatch(updateTableData(newData))
  };

  const sortTypes = useMemo(
    () => ({
      alphanumericFalsyLast(rowA, rowB, columnId, desc) {
        if (!rowA.values[columnId] && !rowB.values[columnId]) {
          return 0;
        }

        if (!rowA.values[columnId]) {
          return desc ? -1 : 1;
        }

        if (!rowB.values[columnId]) {
          return desc ? 1 : -1;
        }

        return isNaN(rowA.values[columnId])
          ? rowA.values[columnId].localeCompare(rowB.values[columnId])
          : rowA.values[columnId] - rowB.values[columnId];
      }
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups,rows, prepareRow,
     selectedFlatRows,  
    state: { selectedCellIds, currentSelectedCellIds  },
     
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      dataDispatch,
      autoResetSortBy: !skipReset,
      autoResetFilters: !skipReset,
      autoResetRowState: !skipReset,
      sortTypes,
      cellIdSplitBy: '_',
      initialState: {
        selectedCellIds: {}
      }
    },
    useCellRangeSelection,
    useFlexLayout,
    useResizeColumns,
    useSortBy,
    useRowSelect
  );

  useEffect(() => {
    if(Object.keys(selectedCellIds).length > 0) {
      const newData = cloneDeep(data)
      const firstValue =Object.keys(selectedCellIds)[0].split('_');
      const newValueToReplace = newData[firstValue[1]][firstValue[0]];
      Object.keys(selectedCellIds).forEach((key, i) => {
        const keyName = key.split('_')[0] 
        const index = key.split('_')[1]
        if(i === 0 ||firstValue[0] != keyName ) return;
        
  
        newData[index][keyName] = newValueToReplace;
      })
      dataDispatch(updateTableData(newData))
      
    }
  }, [selectedCellIds])

  let cellsSelected = { ...currentSelectedCellIds, ...selectedCellIds }


  // const handleCellMouseDown = (rowIndex, columnIndex) => {
  //   setSelectedRange({
  //     startRow: rowIndex,
  //     endRow: rowIndex,
  //     startColumn: columnIndex,
  //     endColumn: columnIndex
  //   });
  // };
  

  // const handleCellMouseOver = (rowIndex, columnIndex) => {
  //   setSelectedRange(prevRange => {
  //     return {
  //       ...prevRange,
  //       endRow: rowIndex,
  //       endColumn: columnIndex
  //     };
  //   });
  // };

  function isTableResizing() {
    for (let headerGroup of headerGroups) {
      for (let column of headerGroup.headers) {
        if (column.isResizing) {
          return true;
        }
      }
    }

    return false;
  }
  
  

  return (
    <>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map(row => row.original)
            },
            null,
            2
          )}
        </code>
      </pre> */}
      {selectedFlatRows?.length > 0 && <Button sx = {{m:2}} onClick={()=>{
        dataDispatch(deleteRows(selectedFlatRows))
      }}>delete selected rows</Button>}
      <div {...getTableProps()} className={clsx("table", isTableResizing() && "noselect")}>
        <div>
          <div {...headerGroups[0].getHeaderGroupProps()} className='tr'>
            {headerGroups[0].headers.map((column) => {
              return (
                column.render("Header")
              )
            })}
          </div>

        </div>
        <div {...getTableBodyProps()}>
          {rows.map((row, rowIndex ) => {
            prepareRow(row);
            return (
              <div  key={rowIndex} {...row.getRowProps()} className= {'tr'+rowIndex}
              style=
              {
                row.isSelected ? { ...row.getRowProps().style, backgroundColor: 'blue' } : {
                  ...row.getRowProps().style
                }
              }>
                {row.cells.map((cell,columnIndex) => {
                  return (
                    
                    <div key={columnIndex}
                    // onMouseDown={() => handleCellMouseDown(rowIndex, columnIndex)}
                    // onMouseOver={() => handleCellMouseOver(rowIndex, columnIndex)}
                    {...cell.getCellRangeSelectionProps()}
                    {...cell.getCellProps(
                      {
                        onCopy: event => handleCopy(event, cell.value),
                    onPaste : event => handlePaste(event, rowIndex, cell)  
                  }
                  )} 
                  
                  // suppressContentEditableWarning={true}
                  // contentEditable
                  style=
                  {
                    cellsSelected[cell.id]
                      ? { ...cell.getCellProps().style, 
                        // backgroundColor: '#6beba80'
                       userSelect: 'none' }
                      : {...cell.getCellProps().style, userSelect: 'none' }
                  }
                  className='td'> 
                    {cell.render("Cell")}
                  </div>
                )})}
              </div>
            );
          })}
          <div className='tr add-row' 
          onClick={() => dataDispatch(addRows({ type: "add_row" }))}
          >
            <span className='svg-icon svg-gray' style={{ marginRight: 4 }}>
              <PlusIcon />
            </span>
            New
          </div>
        </div>
      </div>
      {/* <pre>
        <code>
        {JSON.stringify({ selectedCellIds, currentSelectedCellIds }, null, 2)}
        </code>
      </pre> */}
    </>
  );
}


Table.propTypes = {
  columns:PropTypes.any,
  data:PropTypes.any,
  dispatch:PropTypes.any,
  skipReset:PropTypes.any
};