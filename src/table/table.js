import React, { useMemo, memo } from "react";
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
// import { cloneDeep } from "lodash";
import { useCellRangeSelection } from "react-table-plugins";
import { addRows, deleteRows } from "../store/table/tableThunk";
// import { updateTableData } from "../store/table/tableSlice";
import { Button } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import withScrolling from "react-dnd-scrolling";
import Preview from "./Preview";
import Cell from "./Cell";
import TableHeader  from "./TableHeader/TableHeader";
import { TableBody } from "./TableBody";
import PlusIcon from './img/Plus'


const ScrollingComponent = withScrolling("div");
const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 1000,
  Cell: Cell,
  Header: Header,
  sortType: "alphanumericFalsyLast",
};
// export default function Table({ columns, data, dispatch: dataDispatch, skipReset }) {

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
      state: { selectedCellIds, currentSelectedCellIds },
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

    return (
      <>
        {selectedFlatRows?.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
          sx={{marginRight: 'auto',mb:2}}
            onClick={() => {
              dataDispatch(deleteRows(selectedFlatRows));
            }}
            variant="contained"
          >
            delete selected rows
          </Button>
          </div>
        )}
        <DndProvider backend={HTML5Backend}>
           <ScrollingComponent
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
              cellsSelected={{ ...currentSelectedCellIds, ...selectedCellIds }}
              update={update}
             
            />

      
            
             
            <div className='tr add-row'
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
