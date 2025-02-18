import { useDraggable } from "@dnd-kit/core";
import React from "react";

const DraggableField = ({ field }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field.id, // Unique id for each field
    data: { field },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style} // Enable smooth dragging
      className="draggable-field"
    >
      {field.label}
    </div>
  );
};

export default DraggableField;
