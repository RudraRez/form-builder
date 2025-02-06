import React from "react";
import { useDrop } from "react-dnd";
import DynamicForm from "../Dynamic-Form";
import bin from "../../assets/svg/bin.svg";
import editPencil from "../../assets/svg/edit-pencil.svg";
import DragField from "../draggable-fields/drag-filed";

const FormCanvas = ({ fields, setFields, control, onFieldSelect }) => {
  const [, drop] = useDrop({
    accept: "FIELD",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

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
    if (window.confirm("Are you sure you want to delete this item?")) {
      setFields((prevFields) =>
        prevFields.filter((field) => field.id !== fieldId)
      );
    }
  };

  const moveField = (dragIndex, hoverIndex) => {
    const updatedFields = [...fields];
    const draggedField = updatedFields.splice(dragIndex, 1)[0];
    updatedFields.splice(hoverIndex, 0, draggedField);
    setFields(updatedFields);
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
          <DragField
            key={field.id}
            index={index}
            id={field.id}
            moveField={moveField}
            type="CANVAS"
          >
            <div
              className={`nested-fields card row p-2 mb-3 ${
                field.type == "columns" ? "pt-5 " : ""
              }`}
            >
              <div className="col">
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
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    onClick={() => handleDelete(field.id)}
                  />
                  <img
                    src={editPencil}
                    alt="Edit"
                    className="mx-1"
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    onClick={() => onFieldSelect(field)}
                  />
                </div>
                <DynamicForm
                  field={field}
                  control={control}
                  setFields={setFields}
                  onFieldSelect={onFieldSelect}
                />
              </div>
            </div>
          </DragField>
        ))
      )}
    </div>
  );
};

export default FormCanvas;
