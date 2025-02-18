import React, { useState, useEffect } from "react";
import AddColumnButton from "./components/add-button";
import Column from "./components/column";
import DynamicForm from "../..";
import { useDispatch, useSelector } from "react-redux";
import { setFormFields } from "../../../../store/slices/form-slice";
import "./style.scss";

function Columns({ field, previewMode, control }) {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.form.formJson.form.children);

  const [columns, setColumns] = useState(() =>
    field.fields?.length > 0
      ? field.fields
      : [
          { id: "col-1", type: "column", fields: [] },
          { id: "col-2", type: "column", fields: [] },
        ]
  );

  useEffect(() => {
    if (field.fields && field.fields.length > 0) {
      setColumns(field.fields);
    }
  }, [field.fields]);

  const updateColumns = (newColumns) => {
    setColumns(newColumns);

    const updateNestedFields = (fields) => {
      return fields.map((layout) => {
        if (layout.id === field.id) {
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

    dispatch(setFormFields(updateNestedFields(fields)));
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
        { id: `col-${columns.length + 1}`, type: "column", fields: [] },
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

  return previewMode ? (
    <div className="d-flex w-100 gap-3">
      {columns.map((col) => (
        <div key={col.id} className="w-100">
          {col.fields.map((child) => (
            <DynamicForm
              key={child.id}
              field={child}
              control={control}
              previewMode={previewMode}
            />
          ))}
        </div>
      ))}
    </div>
  ) : (
    <div className="w-100">
      <div className="d-flex w-100 gap-3">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            onDrop={handleDrop}
            removeColumn={removeColumn}
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
