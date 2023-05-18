import React, {useMemo, memo } from "react";
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useColumnOrder,
} from "react-table";
import Header from "./Header";
import PropTypes from "prop-types";
import { useCellRangeSelection } from "react-table-plugins";
import { addRows, deleteRows } from "../store/table/tableThunk";
import { Button } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import withScrolling from "react-dnd-scrolling";
import Preview from "./Preview";
import Cell from "./Cell";
import TableHeader  from "./TableHeader/TableHeader";
import { TableBody } from "./TableBody";
import PlusIcon from './img/Plus'
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {  DeleteOutlined } from "@mui/icons-material";


const ScrollingComponent = withScrolling("div");
const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 1000,
  Cell: Cell,
  Header: Header,
  sortType: "alphanumericFalsyLast",
};

const Table = memo(
  ({
    isNextPageLoading,
    columns,
    data,
    dispatch: dataDispatch,
    update,
    hasNextPage,
  }) => {

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
      rows,
      prepareRow,
      selectedFlatRows,
      state: { selectedCellIds, currentSelectedCellIds},
      totalColumnsWidth,
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
        },
      },
      useCellRangeSelection,
      useFlexLayout,
      useResizeColumns,
      useSortBy,
      useRowSelect,
      useColumnOrder
    );
    useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { target, contentRect } = entry;
          const columnId = target.getAttribute("data-column-id");
    
          // Handle column width change
          console.log(`Column ${columnId} width has changed to ${contentRect.width}px`);
        }
      });
    
      const headerCells = document.querySelectorAll(".rt-th");
      headerCells.forEach((headerCell) => {
        resizeObserver.observe(headerCell, { box: "border-box" });
      });
    
      return () => {
        resizeObserver.disconnect();
      };
    }, []);
    
    

    const tableData= useSelector((state)=>state.table);//true
    const lastRowIndex = tableData?.data?.length - 1;
    useEffect(() => {
      const firstColumnValue = tableData.data[lastRowIndex];
      const tableRowChildNodes =  document.querySelector(`div[data-id="table-new-row-${firstColumnValue?.id}"]`)?.childNodes[1]
      if(tableRowChildNodes){
        const tableRowAttribute = tableRowChildNodes.getAttribute("data-id")
        setTimeout(()=>{
          const td = document.querySelector(`div[data-id="${tableRowAttribute}"]`);
          const match =
            (td && td?.querySelector("textarea")) || td?.querySelector("input");
            if (match) {
              match.addEventListener("focus", () => {
                match.style.border = "2px solid blue";
              });
              match.addEventListener("blur", () => {
                match.style.border = "none";
              });
              match.focus();
            }
        },1000)
      }
    }, [lastRowIndex])

    return (
      <>
        {selectedFlatRows?.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
          sx={{position:"absolute",right:"1%",top:"16.5%"}}
            onClick={() => {
              dataDispatch(deleteRows(selectedFlatRows));
            }}
            variant="contained"
          >
            <DeleteOutlined style={{fontSize:"19px"}}/>
          </Button>
          </div>
        )}
        <DndProvider backend={HTML5Backend}>
           <ScrollingComponent id="scroll"

            style={{ display:"flex",overflowY:"scroll",overflowX:"scroll",height:"74.1vh",width:"99.6vw"}}
          >
            <table >
              
            <TableHeader
              getTableProps={getTableProps}
              headerGroups={headerGroups}
              columns={columns}
              
            />
     
            <TableBody 
              getTableBodyProps={getTableBodyProps}
              rows={rows}
              hasNextPage={hasNextPage}
              isNextPageLoading={isNextPageLoading}
              totalColumnsWidth={totalColumnsWidth}
              prepareRow={prepareRow}
              cellsSelected={{ ...currentSelectedCellIds, ...selectedCellIds}}
              update={update}
            />

      
            
              <div className='tr add-row' 
              style={{ position: 'sticky' ,bottom: 0,left: 0}}
          onClick={() => dataDispatch(addRows({ type: "add_row" }))}
        >
          <span className='svg-icon svg-gray' style={{ marginRight: 4,mt:0,p:0 }}>
            <PlusIcon />
          </span>
          New
        </div>   
        
            </table>
            
          </ScrollingComponent>
          <Preview />
        </DndProvider>
      </>
    );
  }
);
Table.displayName = "Table";
export default Table;

Table.propTypes = {
  columns: PropTypes.any,
  hasMore: PropTypes.any,
  update: PropTypes.any,
  data: PropTypes.any,
  dispatch: PropTypes.any,
  skipReset: PropTypes.any,
  setColumns: PropTypes.func,
  isNextPageLoading:PropTypes.bool,
  hasNextPage: PropTypes.func,
};
