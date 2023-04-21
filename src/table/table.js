/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useMemo, useEffect, useCallback,memo } from "react";
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
import { cloneDeep } from "lodash";
import { useCellRangeSelection } from "react-table-plugins";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import {
  deleteRows,
} from "../store/table/tableThunk";
import { updateTableData } from "../store/table/tableSlice";
import { Button } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import withScrolling from "react-dnd-scrolling";
import Preview from "./Preview";
import Cell from "./Cell";
import { TableHeader } from "./TableHeader";

const ScrollingComponent = withScrolling("div");

const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell: Cell,
  // Cell: EditableCell,
  Header: Header,
  sortType: "alphanumericFalsyLast",
};
// export default function Table({ columns, data, dispatch: dataDispatch, skipReset }) {

const  Table = memo ( ({updateMyData,isNextPageLoading, columns, data, dispatch: dataDispatch,update,hasNextPage }) => {

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
    // state: { selectedCellIds },
    state: { selectedCellIds, currentSelectedCellIds },

    totalColumnsWidth
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      dataDispatch,
      updateMyData,
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
  
  let cellsSelected = { ...currentSelectedCellIds, ...selectedCellIds };

  useEffect(() => {
    if (Object.keys(selectedCellIds).length > 0) {
      const newData = cloneDeep(data);
      const firstValue = Object.keys(selectedCellIds)[0].split("_");
      const newValueToReplace = newData[firstValue[1]][firstValue[0]];
      {
        selectedCellIds >= 1 &&
          Object.keys(selectedCellIds)?.forEach((key, i) => {
            const keyName = key.split("_")[0];
            const index = key.split("_")[1];
            if (i === 0 || firstValue[0] != keyName) return;
            newData[index][keyName] = newValueToReplace;
          });
      }
      dataDispatch(updateTableData(newData));
    }
  }, [selectedCellIds]);

  const itemCount = hasNextPage ? rows.length + 1 : rows.length;
  const loadMoreItems = isNextPageLoading ? () => {} : update;
  const isItemLoaded = useCallback(
    (index) => !hasNextPage || index < rows.length,
    [hasNextPage, rows]
  );
  const handleCopy = (event, value) => {
    event.clipboardData.setData("text/plain", value);
    event.preventDefault();
    document.execCommand("copy");
  };
  const handlePaste = (event,
    //  row, cell
     ) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    console.log('text',text)
    // dispatch(
    //   updateCells({
    //     columnId: cell.column.id,
    //     rowIndex: cell.row.original.id,
    //     value: text,
    //   })
    // );
  };
  const RenderRow = React.useCallback(
    (rows) => ({ index, style }) => {
      if (!isItemLoaded(index))
        return (
          <div className="tr">
            <div className="td">Loading</div>
          </div>
        );
      const row = rows[index];
      prepareRow(row);
      const { style: rowStyle, ...restRow } = row.getRowProps({ style });
      return (
        <div
          {...restRow}
          style=
            {
              row.isSelected ?
               { ...rowStyle, backgroundColor: '#e0edf2', width: totalColumnsWidth  } : {
                ...rowStyle, backgroundColor: 'transparent', width: totalColumnsWidth 
              }
            }
            key={index}
            className={`tr ${index}`}
            id={`table-row-${index}`}
        >
          {row.cells.map((cell, key) => {
            return (
              <div key={key}
              {...cell.getCellProps(
                {
                  onCopy: event => handleCopy(event, cell.value),
                  onPaste: event => handlePaste(event, index, cell)
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
                  : { ...cell.getCellProps().style, userSelect: 'none', flex: 'none', height: '30px' }
              }
              // {...cell.getCellProps()}    
                            className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, isItemLoaded, totalColumnsWidth]
  );

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
      <DndProvider backend={HTML5Backend}>
        <ScrollingComponent style={{ overflow:"hidden", maxHeight: 450,minHeight: 350 }}>
          <TableHeader
          getTableProps={getTableProps}
          headerGroups ={headerGroups}
          columns={columns}
          />
          <div 
        style={{
          widht :"auto",
        height: "100vh",
        overflowX: "hidden",
      }}
      id="scrollableDiv">sfsdfsddsd
         <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                height={500}
                itemCount={rows.length}
                itemSize={35}
                width={800}
                onItemsRendered={onItemsRendered}
                ref={ref}
                innerElementType={({ children, style, ...rest }) => (
                  <>
                    <div style={{ position: "relative" }} className="body">
                      <div {...getTableBodyProps()} {...rest} style={style}>
                        {children}
                      </div>
                    </div>
                  </>
                )}
              >
                {RenderRow(rows)}
              </FixedSizeList>
            )}
          </InfiniteLoader>
     
        </div>
        </ScrollingComponent>
        <Preview />
      </DndProvider>
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
  // columns:PropTypes.any,
  // data:PropTypes.any,
  // dispatch:PropTypes.any,
  // skipReset:PropTypes.any,
  setColumns: PropTypes.func,
};
