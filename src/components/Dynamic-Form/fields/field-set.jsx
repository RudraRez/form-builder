import React from "react";
import DynamicForm from "..";
import { useDrop } from "react-dnd";

function FieldSet({ field, control, setFields, handleDelete }) {
  const [, drop] = useDrop({
    accept: "FIELD",
    drop: (item, monitor) => {
      // Prevent the event from bubbling up to the FormCanvas
      if (monitor.didDrop()) {
        return;
      }

      const isFieldAlreadyAdded = field.fields?.some((f) => f.id === item.id);

      if (!isFieldAlreadyAdded) {
        const timestamp = Date.now();
        const newField = {
          ...item,
          id: `${item.id}-${timestamp}`,
          name: `${item.id}-${timestamp}`,
        };

        // Update the parent field's fields array
        const updatedField = {
          ...field,
          fields: [...(field.fields || []), newField],
        };

        // Update the main fields state
        setFields((prevFields) =>
          prevFields.map((f) => (f.id === field.id ? updatedField : f))
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }), // Only check if directly over
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        border: "1px dashed #ddd",
        padding: "8px",
        marginTop: "8px",
        minHeight: "50px",
        backgroundColor: field.fields?.length ? "#f9f9f9" : "#fff",
        width: "100%",
      }}
    >
      <h6>{field.label}</h6>
      {field.fields?.length ? (
        field.fields.map((child, childIndex) => (
          <DynamicForm
            key={child.id}
            field={child}
            control={control}
            handleDelete={(childId) => handleDelete(field.id, childId)}
          />
        ))
      ) : (
        <p>Drag fields here to add to the set</p>
      )}
    </div>
  );
}

export default FieldSet;
