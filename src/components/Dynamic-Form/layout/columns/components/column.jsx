import React from "react";
import { useDrop } from "react-dnd";
import bin from "../../../../../assets/svg/bin.svg";
import DragField from "../../../../draggable-fields/drag-filed";
import editPencil from "../../../../../assets/svg/edit-pencil.svg";
import DynamicForm from "../../..";

const Column = ({
  column,
  onDrop,
  removeColumn,
  setFields,
  onFieldSelect,
  previewMode,
  control,
  handleDeleteField,
  moveField,
  size,
}) => {
  const [, drop] = useDrop({
    accept: "FIELD",
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      onDrop(column.id, item);
    },
  });

  return (
    <div
      ref={drop}
      className="column p-3 position-relative"
      style={{
        flex: 1,
        border: "2px dashed #ddd",
        backgroundColor: "#f9f9f9",
      }}
    >
      {size > 1 && (
        <img
          src={bin}
          alt="bin"
          className="position-absolute bin"
          style={{
            top: "1px",
            right: "1px",
            width: "20px",
            height: "20px",
            cursor: "pointer",
            zIndex: 20,
          }}
          onClick={() => removeColumn(column.id)}
        />
      )}
      {column.fields.length > 0 ? (
        column.fields.map((child, index) => (
          <DragField
            key={child.id}
            id={child.id}
            index={index}
            type="FIELD_INSIDE"
            moveField={(dragIndex, hoverIndex) =>
              moveField(column.id, dragIndex, hoverIndex)
            }
          >
            <div className="card p-3 mb-3" style={{ position: "relative" }}>
              <div
                className="button-container"
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "10px",
                  display: "flex",
                  gap: "5px",
                  zIndex: 10,
                  background: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "4px",
                  padding: "2px",
                }}
              >
                <img
                  src={bin}
                  alt="Delete Field"
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteField(column.id, child.id)}
                />
                <img
                  src={editPencil}
                  alt="Edit Field"
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
                setFields={setFields}
                previewMode={previewMode}
                onFieldSelect={onFieldSelect}
              />
            </div>
          </DragField>
        ))
      ) : (
        <p className="text-center text-muted">Drag fields here</p>
      )}
    </div>
  );
};

export default Column;
