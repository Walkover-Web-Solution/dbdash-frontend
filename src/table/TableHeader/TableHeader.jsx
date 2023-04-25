/* eslint-disable react/prop-types */
import React, { memo, useCallback } from "react";
import DraggableHeader from "./DraggableHeader";
import { updateColumnOrder } from "../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import clsx from "clsx";

function TableHeader({ getTableProps, headerGroups, columns }) {
  const dispatch = useDispatch();
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

  return (
    <thead {...getTableProps()}  className={clsx("table", isTableResizing() && "noselect")}>
      <div className="calculate">
        <div {...headerGroups[0].getHeaderGroupProps()} className="tr">
          {headerGroups[0].headers?.map((column, index) => (
            <th key={index}>
            <React.Fragment key={index}>
              <DraggableHeader reoder={reoder} columns={column} index={index} />
            </React.Fragment>
            </th>
          ))}
        </div>
      </div>
    </thead>
  );
}
export default memo(TableHeader);
