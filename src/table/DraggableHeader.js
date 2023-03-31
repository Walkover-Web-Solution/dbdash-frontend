
import React, { useMemo,useEffect} from 'react';
import { useDrop, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import ItemTypes from "./ItemTypes";
import PropTypes from 'prop-types';

export default function DraggableHeader({ columns,
  index, reoder, key})
  {

    const dropRef = React.useRef(null)
    const dragRef = React.useRef(null)
  
  // const ref = useRef();
  const { id, label } = columns;

  const Header = label
  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    drop: (monitor) => (
        reoder(monitor, index)
    )
  })
  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.COLUMN},
    begin: () => {
      return {
        id,
        index,
        header: Header
      };
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  // drag(drop(ref));

  const memoizedColumn = useMemo(() => columns.render("Header"), [columns]);
  // console.log("columns", columns);
  // const opacity = isDragging ? 0 : 1;

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  preview(drop(dropRef))
  drag(dragRef)

  return (

      <div className='td bg-white shadow-5 border-radius-md' key={key}
       ref={dropRef}>
        <td ref={dragRef}>move</td>
{memoizedColumn}
      
    </div>

  );

}

DraggableHeader.propTypes = {
  columns: PropTypes.any,
  index: PropTypes.number,
  reoder: PropTypes.func,
  key: PropTypes.number,
}