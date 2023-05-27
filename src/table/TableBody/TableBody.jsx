/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useCallback } from "react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import {updateCells } from "../../store/table/tableThunk";

 function TableBody({
  getTableBodyProps,
  rows,

  cellsSelected,
  prepareRow,
  totalColumnsWidth,
  update = { update },
selectedColumnIndex
})
 {
  const height=(window.screen.height*51)/100;
   const dispatch =  useDispatch()
   const tableId = useSelector((state) => state.table.tableId)
  const limit = 200;
  const hasNextPage = React.useMemo(() => rows.length <= limit, [rows, limit]) ; //true
  const itemCount = hasNextPage ? rows.length + 1 : rows.length;
  const isNextPageLoading1= useSelector((state)=>state.table?.isMoreData);//true
  const loadMoreItems = !isNextPageLoading1 ? () => {} : update;


  const isItemLoaded = useCallback(
    (index) => 
    {
      return  index+1 < rows.length || !isNextPageLoading1
    },
    [hasNextPage, rows]
  );

  const handleCopy = (event, value) => {
    
    event.clipboardData.setData("text/plain", value);
    event.preventDefault();
    document.execCommand("copy");
  };

  // document.addEventListener('keydown', function(event) {
  //   if (event.key === 'Backspace' && selectedColumnIndex) {
  //     console.log("backspace, we will add function here to clear column");
  //   }
  // });
  
  const handlePaste = ( event,row, cell) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    const arr = text.split(', ');
    
    for (let i = 0; i < arr.length; i++) {
      const updatedRowIndex = cell.row.original?.["fld" + tableId.substring(3) + "autonumber"] + i;
      if (cell?.column?.dataType !== "attachment") {
        const value = arr[i].replace(/(^"|"$)/g, ''); // Remove inverted commas
        dispatch(
          updateCells({
            columnId: cell.column.id,
            rowIndex: updatedRowIndex,
            value: value,
          })
        );
      }
    
    
   
    }
  };

  // const [index , setIndex] = useState([])

  const RenderRow = React.useCallback(
    (rows) => ({ index , style}) => {
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
          // style={{ ...rowStyle, width: totalColumnsWidth }}
          key={row.getRowProps().key}  role="row"  className={`tr  ${index}`}
          style={
            row.isSelected
              ? {
                ...rowStyle,
                display: 'flex', flex: '1 0 auto',
                  backgroundColor: "#e0edf2",
                  width: totalColumnsWidth,
                }
              : {
                ...rowStyle,
                display: 'flex', flex: '1 0 auto',
                  backgroundColor: "transparent",
                  width: totalColumnsWidth,
                }
          }
          data-id={`table-new-row-${row?.original?.id}`}
          id={`table-row-${index}`}
        >
          {row.cells.map((cell,key) => {
            
            return (
 
              <div 
            
              {...cell.getCellProps({
                onCopy: (event) => handleCopy(event, cell.value),
                onPaste: (event) => handlePaste(event, key, cell),
              })}
               key ={key} 
               data-id={`${index}-${key}`}
               data-column-id={cell.column.id}
               data-row-id={cell.row.original.id}
               
              //  {...cell.getCellProps()}
               
                
                className={`td ${
                  selectedColumnIndex && key ===selectedColumnIndex ? "selectedCol" : ""
                }`}
               style={
                cellsSelected[cell.id]
                  ? {
                      ...cell.getCellProps().style,
                      userSelect: "none",
                      flex: "none",
                       backgroundColor:"white"
                    }
                  : {
                      ...cell.getCellProps().style,
                      userSelect: "none",
                      flex: "none",
                      height: "35px",
                       backgroundColor:"white"               
                    }
              }
               >
                {cell.render("Cell")}
              
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, isItemLoaded, totalColumnsWidth,selectedColumnIndex]
  );

  return (
    <div
      style={{
        width: "auto",
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
          // width={800}
            height={height}
            // height={35*rows.length}
            itemCount={rows.length}
            itemSize={35}
             style={{overflowY:"auto"}}
            onItemsRendered={onItemsRendered}
            ref={ref}
            innerElementType={({ children, style, ...rest }) => (
                <div style={{ position: "relative" }} className="body">
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