import React from "react";
import { useDragLayer } from "react-dnd";

const Preview = () => {

  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  return isDragging ? (
    <div
      className="preview"
      style={{
        position: "fixed",
        pointerEvents: "none",
        left: 0,
        top: 0,
        height: `${document.getElementById("scroll").clientHeight}px`,
        width: `${document.getElementById("resizable-width").clientWidth}px`,
        transform: `translate(${currentOffset?.x}px, ${currentOffset?.y}px)`,
        background: "rgba(0, 0, 0, 0.25)"
      }}
    >
       {item.header}
    </div>
  ) : null;
};

export default Preview;
