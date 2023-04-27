import React, { useMemo, memo } from "react";
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useColumnOrder,
} from "react-table";
import Header from "../Header/Header";
import PropTypes from "prop-types";
// import { cloneDeep } from "lodash";
import { useCellRangeSelection } from "react-table-plugins";
import { addRows, deleteRows } from "../../store/table/tableThunk";
// import { updateTableData } from "../store/table/tableSlice";
import { Button } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import withScrolling from "react-dnd-scrolling";
import Preview from "../Preview";
import Cell from "../Cell/Cell";
import { TableHeader } from "../../table/TableHeader";
import { TableBody } from "../TableBody";
import PlusIcon from '../img/Plus'
import './table.css'

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
        // updateMyData,
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

   

    // useEffect(() => {
    //   if (Object.keys(selectedCellIds).length > 0) {
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

    return (
      <>
        {selectedFlatRows?.length > 0 && (
          <div className="divone" >
          <Button
          className="buttonone"
        
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
           className="scrollingcomp"
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
          <span className='svg-icon svg-gray plusicon' >
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
