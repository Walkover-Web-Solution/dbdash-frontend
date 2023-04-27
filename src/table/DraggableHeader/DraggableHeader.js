import React, { useEffect, memo } from "react";
import { useDrop, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import ItemTypes from "../ItemTypes";
import PropTypes from "prop-types";
import './DraggableHeader.css'
function DraggableHeader({ columns, index, reoder, key }) {
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const { id, label } = columns;

  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    drop: (monitor) => reoder(monitor, index),
  });

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.COLUMN },
    begin: () => ({ id, index, header: label }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  preview(drop(dropRef));
  drag(dragRef);

  const isNotNumber = typeof columns?.id !== "number";
  
  return (
    <div
      className="td bg-white border-radius-md"
      key={key}
      {...columns.getHeaderProps()}
      ref={isNotNumber ? dropRef : null}
    >
      <div className="movecursor" ref={isNotNumber ? dragRef : null}>
        {columns.render("Header")}
      </div>
      {isNotNumber && (
        <div {...columns.getResizerProps()} className="resizer" />
      )}
    </div>
  );
}

DraggableHeader.propTypes = {
  columns: PropTypes.any,
  index: PropTypes.number,
  reoder: PropTypes.func,
  key: PropTypes.number,
};

export default memo(DraggableHeader);
