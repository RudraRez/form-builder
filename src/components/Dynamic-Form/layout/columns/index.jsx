import React, { useState, useEffect } from "react";
import AddColumnButton from "./components/add-button";
import Column from "./components/column";
import "./style.scss";
import DynamicForm from "../..";

function Columns({ field, setFields, onFieldSelect, previewMode, control }) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns(
      field.fields?.length
        ? field.fields
        : [
            { id: "col-1", type: "column", fields: [] },
            { id: "col-2", type: "column", fields: [] },
          ]
    );
  }, [field.fields]);

  const updateColumns = (newColumns) => {
    setColumns(newColumns);
    setFields((prevFields) => {
      const updateNestedFields = (fields) => {
        return fields.map((layout) => {
          if (layout.id === field.id) {
            // this is for the columns layout to insert
            return { ...layout, fields: newColumns };
          }
          if (layout.type === "field-set" && layout.fields.length > 0) {
            return { ...layout, fields: updateNestedFields(layout.fields) };
          }
          if (layout.type === "tabs" && layout.tabs.length > 0) {
            return {
              ...layout,
              tabs: layout.tabs.map((tab) => ({
                ...tab,
                fields: updateNestedFields(tab.fields),
              })),
            };
          }
          return layout;
        });
      };
      return updateNestedFields(prevFields);
    });
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

  if (previewMode) {
    return (
      <div className="d-flex w-100 gap-3">
        {columns.map((col) => (
          <div key={col.id} className="w-100">
            {col.fields.map((child, _) => (
              <DynamicForm
                key={child.id}
                field={child}
                setFields={setFields}
                control={control}
                previewMode={previewMode}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-100">
      <div className="d-flex w-100 gap-3">
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
            size={columns.length}
          />
        ))}
      </div>
      {columns.length < 4 && <AddColumnButton addColumn={addColumn} />}
    </div>
  );
}

export default Columns;
