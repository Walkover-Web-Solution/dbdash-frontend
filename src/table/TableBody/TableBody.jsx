/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useCallback } from "react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import {updateCells } from "../../store/table/tableThunk";
// import { getTableInfo } from "../../store/table/tableSelector";

 function TableBody({
  getTableBodyProps,
  rows,
  // hasNextPage,
  isNextPageLoading,
  cellsSelected,
  prepareRow,
  totalColumnsWidth,
  
  update = { update },
}) {
   const dispatch =  useDispatch()
   const hasNextPage= useSelector((state)=>state.table.isMoreData);
  //  useSelector((state)=>getTableInfo(state.isMoreData));
   console.log(hasNextPage)
  const itemCount = hasNextPage ? rows.length + 1 : rows.length;
  const loadMoreItems = isNextPageLoading ? () => {} : update;
  console.log(isNextPageLoading,"isnectg")
  const isItemLoaded = useCallback(
    (index) => !hasNextPage || index < rows.length,
    [hasNextPage, rows]
  );
  const handleCopy = (event, value) => {
    event.clipboardData.setData("text/plain", value);
    event.preventDefault();
    document.execCommand("copy");
  };
  const handlePaste = (
    event,
     row, cell
  ) => {
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
  const RenderRow = React.useCallback(
    (rows) =>
      ({ index,style}) => {
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
          <>
          <tr
          key={row.getRowProps().key}  role="row"  className={`tr ${index}`}
         


            {...restRow}
            style={
              row.isSelected
                ? {
                    ...rowStyle,
                    backgroundColor: "#e0edf2",
                    width: totalColumnsWidth,
                  }
                : {
                    ...rowStyle,
                    backgroundColor: "transparent",
                    width: totalColumnsWidth,
                  }
            }
            
            id={`table-row-${index}`}
          >
            {row.cells.map((cell, key) => {
              return (
                <td
                  key={key}
                  {...cell.getCellProps({
                    onCopy: (event) => handleCopy(event, cell.value),
                    onPaste: (event) => handlePaste(event, index, cell),
                  })}
                  style={
                    cellsSelected[cell.id]
                      ? {
                          ...cell.getCellProps().style,
                          userSelect: "none",
                          flex: "none",
                        }
                      : {
                          ...cell.getCellProps().style,
                          userSelect: "none",
                          flex: "none",
                          height: "35px",
                        }
                  }
                  className="td"
                >
                  {cell.render("Cell")}
                </td>
              );
            })}
          </tr>
         {/* <div className='tr add-row'
          onClick={() => dataDispatch(addRows({ type: "add_row" }))}
        >
          <span className='svg-icon svg-gray' style={{ marginRight: 4 }}>
            <PlusIcon />
          </span>
          New
        </div> */}
        </>
        );
      },
    [prepareRow, isItemLoaded, totalColumnsWidth]
  );

  return (
    <div
      style={{
        widht: "auto",
        // height: "100vh",
        
      }}
      id="scrollableDiv"
    >
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}

      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            height={382}
            itemCount={rows.length}
            itemSize={35}
            onItemsRendered={onItemsRendered}
            ref={ref}
            innerElementType={({ children, style, ...rest }) => (
                <div style={{ position: "relative",overflow:'hidden' }} className="body">
                  <div {...getTableBodyProps()} {...rest} style={style}>
                    {children}
                  </div>
                </div>
            )}
          >
            {RenderRow(rows)}
          </FixedSizeList>
         
        )}
      </InfiniteLoader>
    </div>
  );
}
export default memo(TableBody)