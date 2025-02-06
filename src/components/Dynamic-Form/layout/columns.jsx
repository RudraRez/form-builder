import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import DynamicForm from "..";
import bin from "../../../assets/svg/bin.svg";
import add from "../../../assets/svg/add.svg";
import DragField from "../../draggable-fields/drag-filed";
import editPencil from "../../../assets/svg/edit-pencil.svg";

function Columns({ field, setFields, onFieldSelect, previewMode, control }) {
  const [columns, setColumns] = useState([]);

  // Sync local state with global fields
  useEffect(() => {
    setColumns(
      field.fields?.length
        ? field.fields
        : [
            { id: "col-1", type: "column", fields: [] },
            { id: "col-2", type: "column", fields: [] },
          ]
    );
  }, [field.fields]); // When `field.fields` changes, update `columns`.

  const updateColumns = (newColumns) => {
    setColumns(newColumns);
    setFields((prevFields) =>
      prevFields.map((f) =>
        f.id === field.id ? { ...f, fields: newColumns } : f
      )
    );
  };

  const handleDrop = (columnId, item) => {
    const newColumns = columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            fields: [
              ...col.fields,
              {
                ...item,
                id: `${item.id}-${Date.now()}`,
                name: `${item.name}-${Date.now()}`,
              },
            ],
          }
        : col
    );
    updateColumns(newColumns);
  };

  const addColumn = () => {
    if (columns.length < 4) {
      updateColumns([
        ...columns,
        { id: `col-${columns.length + 1}`, fields: [] },
      ]);
    }
  };

  const removeColumn = (columnId) => {
    if (columns.length > 1) {
      updateColumns(columns.filter((col) => col.id !== columnId));
    }
  };

  const handleDeleteField = (columnId, fieldId) => {
    const newColumns = columns.map((col) =>
      col.id === columnId
        ? { ...col, fields: col.fields.filter((f) => f.id !== fieldId) }
        : col
    );
    updateColumns(newColumns);
  };

  const moveField = (columnId, dragIndex, hoverIndex) => {
    const moveItem = (list, fromIndex, toIndex) => {
      const updatedList = [...list];
      const [removed] = updatedList.splice(fromIndex, 1);
      updatedList.splice(toIndex, 0, removed);
      return updatedList;
    };

    const newColumns = columns.map((col) =>
      col.id === columnId
        ? { ...col, fields: moveItem([...col.fields], dragIndex, hoverIndex) }
        : col
    );
    updateColumns(newColumns);
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="d-flex w-100" style={{ gap: "10px" }}>
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            onDrop={handleDrop}
            removeColumn={removeColumn}
            setFields={setFields}
            onFieldSelect={onFieldSelect}
            previewMode={previewMode}
            control={control}
            handleDeleteField={handleDeleteField}
            moveField={moveField}
          />
        ))}
      </div>
      <AddColumnButton addColumn={addColumn} />
    </div>
  );
}

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
}) => {
  const [, drop] = useDrop({
    accept: "FIELD",
    drop: (item) => onDrop(column.id, item),
  });

  return (
    <div
      ref={drop}
      className="column p-2 position-relative"
      style={{
        flex: 1,
        border: "2px dashed #ddd",
        backgroundColor: "#f9f9f9",
      }}
    >
      <img
        src={bin}
        alt="Delete Column"
        className="position-absolute"
        style={{
          top: "10px",
          right: "10px",
          width: "20px",
          height: "20px",
          cursor: "pointer",
          zIndex: 20,
        }}
        onClick={() => removeColumn(column.id)}
      />
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

const AddColumnButton = ({ addColumn }) => (
  <div className="d-flex justify-content-center mt-3">
    <img
      src={add}
      alt="Add Column"
      style={{ width: "30px", height: "30px", cursor: "pointer" }}
      onClick={addColumn}
    />
  </div>
);

export default Columns;
