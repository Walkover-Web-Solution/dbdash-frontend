import React, { useMemo , useCallback,memo } from "react";
import clsx from "clsx";
import {useTable,useFlexLayout,useResizeColumns,useSortBy,useColumnOrder,usePagination,useRowSelect} from "react-table";
import Cell from "./Cell";
import Header from "./Header";
import PlusIcon from "./img/Plus";
import PropTypes from "prop-types";
// import { cloneDeep } from "lodash";
// import { useCellRangeSelection } from "react-table-plugins";
import {addRows,deleteRows,updateCells,updateColumnOrder,} from "../store/table/tableThunk";
// import { updateTableData } from "../store/table/tableSlice";
import { Button } from "@mui/material";
import { useDispatch,useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import withScrolling from "react-dnd-scrolling";
import 'simplebar-react/dist/simplebar.min.css';
//import SimpleBar from 'simplebar-react';
import Preview from "./Preview";
import DraggableHeader from "./DraggableHeader";
import { getTableInfo } from "../store/table/tableSelector";

const ScrollingComponent = withScrolling("div");
const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell: Cell,
  Header: Header,
  sortType: "alphanumericFalsyLast",
};
const  Table = memo ( ({ columns, data, dispatch: dataDispatch,update ,page:pageNo }) => {
  const handleCopy = (event, value) => {
    event.clipboardData.setData("text/plain", value);
    event.preventDefault();
    document.execCommand("copy");
  };
  const dispatch = useDispatch();
  const handlePaste = (event, row, cell) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    dispatch(
      updateCells({
        columnId: cell.column.id,
        rowIndex: cell.row.original.id,
        value: text,
      })
    );
  };

  

  const tableInfo=useSelector((state)=>getTableInfo(state));
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
      },
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    selectedFlatRows,
    page,
    canPreviousPage,
    nextPage,
    previousPage,
    gotoPage,
    state: { pageIndex  },
    state: { selectedCellIds, currentSelectedCellIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      dataDispatch,
      sortTypes,
      cellIdSplitBy: "_",
      initialState: {
        selectedCellIds: {},
        columnOrder: columns,
        pageSize : 100,
        pageIndex :pageNo - 1
      },
    },
    useFlexLayout,
    useResizeColumns,
    useSortBy,
    useColumnOrder,
    usePagination,
    useRowSelect
  );
 

  const reoder = useCallback(
    (item, newIndex) => {
      const newOrder = Array.from(columns);
      const { index: currentIndex } = item;
      const [removedColumn] = newOrder.splice(currentIndex, 1);
      newOrder.splice(newIndex, 0, removedColumn);
      dispatch(
        updateColumnOrder({
          columns: newOrder,
          id: item?.id,
          oldIndex:item.index - 1 ,
          newIndex : newIndex  - 1
        })
      );
      //call redux make thunk and reducer pass new column order and update
    },
    [columns]
  );
  // useEffect(() => {
  //   if (Object.keys(selectedCellIds).length > 1) {
  //     const newData = cloneDeep(data);
  //     const firstValue = Object.keys(selectedCellIds)[0].split("_");
  //     const newValueToReplace = newData[firstValue[1]][firstValue[0]];
  //     {
  //       selectedCellIds >= 1 &&
  //         Object.keys(selectedCellIds)?.forEach((key, i) => {
  //           const keyName = key.split("_")[0];
  //           const index = key.split("_")[1];
  //           if (i === 0 || firstValue[0] != keyName) return;
  //           newData[index][keyName] = newValueToReplace;
  //         });
  //     }
  //     dataDispatch(updateTableData(newData));
  //   }
  // }, [selectedCellIds]);
  let cellsSelected = { ...currentSelectedCellIds, ...selectedCellIds };
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
      {selectedFlatRows?.length > 0 && (
        <Button
          sx={{ m: 2 }}
          onClick={() => {
            dataDispatch(deleteRows(selectedFlatRows));
          }}
        >
          delete selected rows
        </Button>
      )}

      <DndProvider backend={HTML5Backend} >
        <ScrollingComponent style={{display:"flex", overflowY:"scroll", height:"100%",width:"97vw"}} key={headerGroups[0].headers.length}>
        {/* <SimpleBar id="scrollableDiv" style={{
        // width: "98vw",
        // 45px height replaced by hesder height
        height: "60vh",
        overflowX: "hidden" ,
   
      }}> */}
          <table  >
          <thead
        
         
            {...getTableProps()}
            className={clsx("table", isTableResizing() && "noselect")}
            
          >
            <div className="calculate">
              <div style={{}} {...headerGroups[0].getHeaderGroupProps()} className="tr">
                {
                  headerGroups[0].headers?.map((column, index) => {
                    return (
                      <React.Fragment key={index}>
                        {/* {  column.render("Header")} */}
                        <DraggableHeader
                          reoder={reoder}
                          // key={column.id}
                          columns={column}
                          index={index}
                        />
                      </React.Fragment>
                    );
                  })}
              </div>
            </div>
          </thead>
          
         
      
          <tbody className={clsx("table", isTableResizing() && "noselect")} {...getTableBodyProps()} >
            {page?.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr key={rowIndex} {...row.getRowProps()} className={`tr ${rowIndex}`}
                  style=
                  {
                    row.isSelected ? { ...row.getRowProps().style, backgroundColor: '#E0EDF2' } : {
                      ...row.getRowProps().style, backgroundColor: 'transparent'
                    }
                  }>
                  {row.cells.map((cell, columnIndex) => {
                    return (
                      <td key={columnIndex}
                        // {...cell.getCellRangeSelectionProps()}
                        {...cell.getCellProps(
                          {
                            onCopy: event => handleCopy(event, cell.value),
                            onPaste: event => handlePaste(event, rowIndex, cell)
                          }
                        )}
                        style=
                        {
                          cellsSelected[cell.id]
                            ? {
                              ...cell.getCellProps().style,
                              // backgroundColor: '#6beba80'
                              userSelect: 'none', flex: 'none',
                            }
                            : { ...cell.getCellProps().style, userSelect: 'none', flex: 'none', height: '35px' }
                        }
                        className='td'>
                        {cell.render("Cell")}
                      </td>
                    )
                  })}
                </tr>
              );
            })}
          {  pageIndex ==0 && <tr className='tr add-row'
              onClick={() => dataDispatch(addRows({ type: "add_row" }))}
            >
              <td colSpan={headerGroups[0].headers.length}>
              <span className='svg-icon svg-gray' style={{ marginRight: 4 }}>
                <PlusIcon />
              </span>
              New
              </td>
            </tr>}
          </tbody>
         
          </table>
        {/* </SimpleBar> */}
        
        </ScrollingComponent>
        
        <Preview />
      </DndProvider>

      <div className="pagination"  style={{marginTop:"2.5vh",position:"fixed", left: '45%'}}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"home"}
        </button>
        {" "}
      
        
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"previous"}
        </button>{" "}
        <button disabled={tableInfo.isMoreData == false  &&  pageIndex+1 == pageNo } onClick={() => {
          
          if(   parseInt(data?.length / 100, 10)  > pageIndex+1){
            nextPage()
          }
          else{

            update(pageIndex) 
          }
          }}>
          {"next"}
        </button>{" "}
        <span>
        
        </span>
      </div>
     
    </>
  );
})
Table.displayName  = 'Table'
export default Table
Table.propTypes = {
  columns: PropTypes.any,
  hasMore:PropTypes.any,
  update:PropTypes.any,
  data: PropTypes.any,
  dispatch: PropTypes.any,
  skipReset: PropTypes.any,
  setColumns: PropTypes.func,
  page:PropTypes.number,
};