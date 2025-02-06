import React from "react";
import { useDrop } from "react-dnd";
import DynamicForm from "..";
import DragField from "../../draggable-fields/drag-filed";
import bin from "../../../assets/svg/bin.svg";
import editPencil from "../../../assets/svg/edit-pencil.svg";

function FieldSet({ field, control, setFields, onFieldSelect, previewMode }) {
  const [, drop] = useDrop({
    accept: "FIELD",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      const isFieldAlreadyAdded = field.fields?.find((f) => f.id === item.id); // Check if field is already added

      if (!isFieldAlreadyAdded) {
        const timestamp = Date.now();
        const newField = {
          ...item,
          id: `${item.id}-${timestamp}`,
          name: `${item.id}-${timestamp}`,
        };

        const updatedField = {
          ...field,
          fields: [...(field.fields || []), newField],
        };

        setFields((prevFields) =>
          prevFields.map((f) => (f.id === field.id ? updatedField : f))
        );
      }
    },
  });

  const moveField = (dragIndex, hoverIndex) => {
    const updatedFields = [...field.fields];
    const draggedField = updatedFields.splice(dragIndex, 1)[0];
    updatedFields.splice(hoverIndex, 0, draggedField);

    const updatedField = { ...field, fields: updatedFields };

    setFields((prevFields) =>
      prevFields.map((f) => (f.id === field.id ? updatedField : f))
    );
  };

  const handleDeleteNestedField = (fieldId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedFields = field.fields.filter((f) => f.id !== fieldId);

      const updatedFieldSet = { ...field, fields: updatedFields };

      setFields((prevFields) =>
        prevFields.map((f) => (f.id === field.id ? updatedFieldSet : f))
      );
    }
  };

  return (
    <div ref={drop} style={{ width: "100%" }}>
      <h6
        style={{
          borderBottom: "3px solid #ddd",
          paddingBottom: "8px",
          fontSize: "1.2rem",
        }}
      >
        {field.label}
      </h6>
      {field.fields?.length ? (
        <div>
          {field.fields.map((child, index) => {
            return previewMode ? (
              <DynamicForm
                key={child.id}
                field={child}
                control={control}
                previewMode={previewMode}
              />
            ) : (
              <DragField
                key={child.id}
                index={index}
                id={child.id}
                moveField={moveField}
                type="FIELD_INSIDE"
              >
                <div className="card p-3 mb-3">
                  <div
                    className="position-absolute d-flex justify-content-end p-2"
                    style={{
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "4px",
                      zIndex: 10,
                    }}
                  >
                    <img
                      src={bin}
                      alt="Delete"
                      className="mx-1"
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteNestedField(child.id)}
                    />

                    <img
                      src={editPencil}
                      alt="Edit"
                      className="mx-1"
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => onFieldSelect(child)}
                    />
                  </div>
                  <DynamicForm
                    field={child}
                    control={control}
                    // setFields={setFields}
                    // onFieldSelect={onFieldSelect}
                    previewMode={previewMode}
                  />
                </div>
              </DragField>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#888", padding: "16px 0" }}>
          Drag fields here to add to the set
        </p>
      )}
    </div>
  );
}

export default FieldSet;
