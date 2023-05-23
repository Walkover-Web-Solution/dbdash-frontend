/* eslint-disable react/prop-types */
import React, { memo, useCallback, useEffect, useRef} from "react";
import DraggableHeader from "./DraggableHeader";
import { updateColumnOrder } from "../../store/table/tableThunk";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

function TableHeader({ getTableProps, headerGroups, columns, selectedColumnIndex, setSelectedColumnIndex }) {
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

  const handleHeaderClick = (columnIndex) => {
    if (selectedColumnIndex === columnIndex) {
      setSelectedColumnIndex(null);
    } else {
      setSelectedColumnIndex(columnIndex);
      
    }
  };

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
          oldIndex: item.index - 1,
          newIndex: newIndex - 1,
        })
      );
    },
    [columns]
  );
  
  const AllTableInfo = useSelector((state) => state);
  const ref = useRef()
  const headerRef = useRef(null);
  // const[part, setpart] = useState([])
  let selectedColumnId= AllTableInfo?.table?.columns;
  let selectedColumnIdToGetData  =  selectedColumnId[selectedColumnIndex]?.id
  useEffect(() => {
    let particularData = [];
  AllTableInfo?.table?.data.forEach((item)=>{
if(selectedColumnIdToGetData in item){
  const value = item[selectedColumnIdToGetData]
  particularData.push(value);
}
  })
  // setpart(particularData)
  ref.current = particularData
  
  }, [selectedColumnIdToGetData])


  
  useEffect(() => {
    const handleClickOutsideHeader = (event) => {
      // Check if the clicked element is a header cell
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setSelectedColumnIndex(null); // Unselect the column
      }
    };

    const handleKeyDown = (event) => {
      if (selectedColumnIndex) {
        if ((event.ctrlKey && event.key === 'c') || (event.metaKey && event.key === 'c')) {
          copyArrayToClipboard();
        }
      }
    };

    document.body.addEventListener("click", handleClickOutsideHeader);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.removeEventListener("click", handleClickOutsideHeader);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedColumnIndex]);
 
  


function copyArrayToClipboard() {
  const text = ref.current.join(' ');
  navigator.clipboard.writeText(text)
} 


  return (
    <thead {...getTableProps()} className={clsx("table", isTableResizing() && "noselect")} >
      <div className="calculate">
      <div ref={headerRef} {...headerGroups[0]?.getHeaderGroupProps()} className="tr">
          {headerGroups[0]?.headers?.map((column, index) => (
            <th
              key={index}
              className={selectedColumnIndex !== null && index === selectedColumnIndex ? "selected" : ""}
              onClick={() => {
                handleHeaderClick(index);
              }}
            >
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