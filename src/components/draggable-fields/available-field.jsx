import React from "react";
import { useDrag } from "react-dnd";

const AvailableField = ({ field }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FIELD",
    item: { ...field },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`draggable-field ${field.type}`}
      style={{
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        padding: "8px",
        border: "1px solid #ddd",
        margin: "4px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {field.label}
    </div>
  );
};

export default AvailableField;
