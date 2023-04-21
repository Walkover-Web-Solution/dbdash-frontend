import React from 'react';
import { useDragLayer } from "react-dnd";

const Preview = () => {
  const { isDragging,currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  return isDragging ? (
    <div className="preview"
      style={{
        position: "fixed",
        pointerEvents: "none",
        left: 0,
        top: 0,
        transform: `translate(${currentOffset?.x}px, ${currentOffset?.y}px) rotate(25deg)`,
        background: "red"
      }}
    >
      {/* {item.header} */}
    </div>
  ) : null;
};

export default Preview;
