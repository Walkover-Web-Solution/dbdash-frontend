
import React, {
  useRef, useMemo,
  useEffect
} from 'react';

import { useDrop, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import ItemTypes from "./ItemTypes";

import PropTypes from 'prop-types';



export default function DraggableHeader({ columns,
  index, reoder, key
}) {
  // const ItemTypes = {
  //     COLUMN: 'column'
  //   };
  const ref = useRef();
  const { id, label } = columns;
  const Header = label
  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    // collect: (monitor) => ({
    //   isOver: monitor.isOver(),
    //   canDrop: monitor.canDrop(),
    // })
    drop: (monitor) => (
        reoder(monitor, index)
    )
  })
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: ItemTypes.COLUMN },
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

  drag(drop(ref));

  const memoizedColumn = useMemo(() => columns.render("label"), [columns]);
  // console.log("columns", columns);
  const opacity = isDragging ? 0 : 1;

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <>
      <div className='td' key={key}
        ref={ref}
        {...columns.getHeaderProps()}
        style={{ cursor: "move", opacity }}
      >
        {memoizedColumn}
      </div>
    </>

  );

}

DraggableHeader.propTypes = {
  columns: PropTypes.any,
  index: PropTypes.number,
  reoder: PropTypes.func,
  key: PropTypes.number,
}