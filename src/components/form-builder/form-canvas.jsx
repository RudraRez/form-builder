import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import DynamicForm from "../Dynamic-Form";

const FormCanvas = ({
  fields,
  setFields,
  control,
  onFieldSelect,
  isPreview,
}) => {
  const [, drop] = useDrop({
    accept: "FIELD",
    drop: (item, monitor) => {
      // Check if the drop was already handled by a nested drop target (e.g., FieldSet)
      if (monitor.didDrop()) {
        return;
      }

      const isFieldAlreadyAdded = fields.find((f) => f.id === item.id);

      if (!isFieldAlreadyAdded) {
        const timestamp = Date.now();
        const newField = {
          ...item,
          id: `${item.id}-${timestamp}`,
          name: `${item.id}-${timestamp}`,
        };
        setFields((prevFields) => [...prevFields, newField]);
      }
    },
  });

  const handleDelete = (fieldId) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.id !== fieldId)
    );
  };

  const Field = ({ field, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    const [, drop] = useDrop({
      accept: "CANVAS",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          const updatedFields = [...fields];
          const [draggedField] = updatedFields.splice(draggedItem.index, 1);
          updatedFields.splice(index, 0, draggedField);
          setFields(updatedFields);
          draggedItem.index = index;
        }
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: "CANVAS",
      item: { id: field.id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`card p-3 mb-3 position-relative ${
          isDragging ? "border-secondary bg-light" : "border-primary"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          opacity: isDragging ? 0.7 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        {isHovered && (
          <div
            className="hover-overlay d-flex flex-column justify-content-center align-items-center"
            onClick={() => onFieldSelect(field)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              zIndex: 10,
              borderRadius: "4px",
              textAlign: "center",
              padding: "10px",
              cursor: "grab",
            }}
          >
            <p style={{ margin: "0 0 10px", fontSize: "14px" }}>
              Click to edit or drag to move
            </p>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(field.id)}
              style={{ marginTop: "10px" }}
            >
              Delete
            </button>
          </div>
        )}
        <DynamicForm
          field={field}
          control={control}
          handleDelete={handleDelete}
          setFields={setFields}
        />
      </div>
    );
  };

  return (
    <div
      ref={drop}
      className="form-canvas-container"
      style={{
        padding: "16px",
        border: "2px dashed #ccc",
        minHeight: "200px",
        backgroundColor: "#fafafa",
      }}
    >
      <h5>Form Canvas</h5>
      {fields.length === 0 ? (
        <p>Drag fields here to build your form</p>
      ) : (
        fields.map((field, index) => (
          <Field key={field.id} field={field} index={index} />
        ))
      )}
    </div>
  );
};

export default FormCanvas;
