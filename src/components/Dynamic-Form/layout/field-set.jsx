import React from "react";
import { useDrop } from "react-dnd";
import DynamicForm from "..";
import DragField from "../../draggable-fields/drag-filed";
import bin from "../../../assets/svg/bin.svg";
import editPencil from "../../../assets/svg/edit-pencil.svg";

function FieldSet({ field, control, setFields, onFieldSelect, previewMode }) {
  const [, drop] = useDrop({
    accept: ["FIELD"],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      console.log("i am inside fieldset");

      // Ensure the field is not already inside the field-set
      const isFieldAlreadyAdded = field.fields?.some((f) => f.id === item.id);
      if (isFieldAlreadyAdded) return;

      const timestamp = Date.now();
      const newField = {
        ...item,
        id: `${item.id}-${timestamp}`,
        name: `${item.id}-${timestamp}`,
      };

      // Call the onDrop function passed from the parent component
      onDrop(field.id, newField);
    },
  });

  const onDrop = (fieldId, newField) => {
    setFields((prevFields) => {
      const updateNestedFields = (fields) => {
        return fields.map((layout) => {
          if (layout.id === fieldId) {
            return { ...layout, fields: [...(layout.fields || []), newField] };
          }
          if (layout.type === "field-set" && layout.fields?.length > 0) {
            return { ...layout, fields: updateNestedFields(layout.fields) };
          }
          if (layout.type === "columns" && layout.fields?.length > 0) {
            return { ...layout, fields: updateNestedFields(layout.fields) };
          }
          if (layout.type === "tabs" && layout.tabs?.length > 0) {
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

  const moveField = (dragIndex, hoverIndex) => {
    const updatedFields = [...field.fields];
    const draggedField = updatedFields.splice(dragIndex, 1)[0];
    updatedFields.splice(hoverIndex, 0, draggedField);
  
    const updatedFieldSet = { ...field, fields: updatedFields };
  
    setFields((prevFields) => {
      const updateNestedFields = (fields) => {
        return fields.map((layout) => {
          if (layout.id === field.id) {
            return updatedFieldSet;
          }
          if (layout.type === "field-set" && layout.fields?.length > 0) {
            return { ...layout, fields: updateNestedFields(layout.fields) };
          }
          if (layout.type === "columns" && layout.fields?.length > 0) {
            return { ...layout, fields: updateNestedFields(layout.fields) };
          }
          if (layout.type === "tabs" && layout.tabs?.length > 0) {
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
  

  
  const handleDeleteNestedField = (fieldId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setFields((prevFields) => {
        const updateNestedFields = (fields) => {
          return fields
            .map((layout) => {
              if (layout.id === fieldId) {
                return null; 
              }
              if (layout.type === "field-set" && layout.fields?.length > 0) {
                return { ...layout, fields: updateNestedFields(layout.fields) };
              }
              if (layout.type === "columns" && layout.fields?.length > 0) {
                return { ...layout, fields: updateNestedFields(layout.fields) };
              }
              if (layout.type === "tabs" && layout.tabs?.length > 0) {
                return {
                  ...layout,
                  tabs: layout.tabs.map((tab) => ({
                    ...tab,
                    fields: updateNestedFields(tab.fields),
                  })),
                };
              }
              return layout;
            })
            .filter(Boolean); // Remove null values (deleted items)
        };
  
        return updateNestedFields(prevFields);
      });
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
                type="FIELD"
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
                    setFields={setFields}
                    onFieldSelect={onFieldSelect}
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
