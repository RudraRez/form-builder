import React from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormFields,
  onFieldSelect,
  removeField,
} from "../../../store/slices/form-slice";
import DragField from "../../draggable-fields/drag-field";
import bin from "../../../assets/svg/bin.svg";
import editPencil from "../../../assets/svg/edit-pencil.svg";
import FormRenderer from "..";

function FieldSet({ field, control, previewMode }) {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.form.formJson.form.children);

  const [, drop] = useDrop({
    accept: ["FIELD"],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      console.log("i am inside field-set");

      const timestamp = Date.now();
      const newField = {
        ...item,
        id: `${item.id}-${timestamp}`,
        name: `${item.id}-${timestamp}`,
      };

      // id of the section in which the component is dropped
      onDrop(field.id, newField);
    },
  });

  const onDrop = (fieldId, newField) => {
    const updateNestedFields = (fields) => {
      return fields.map((layout) => {
        if (layout.id === fieldId) {
          return { ...layout, fields: [...(layout.fields || []), newField] };
        }
        if (layout.type === "field-set") {
          return { ...layout, fields: updateNestedFields(layout.fields) };
        }
        if (layout.type === "columns") {
          return {
            ...layout,
            fields: layout.fields.map((column) => ({
              ...column,
              fields: updateNestedFields(column.fields),
            })),
          };
        }
        if (layout.type === "tabs") {
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

  const moveField = (dragIndex, hoverIndex) => {
    if (!field.fields) return;

    const updatedFields = [...field.fields];
    const draggedField = updatedFields.splice(dragIndex, 1)[0];
    updatedFields.splice(hoverIndex, 0, draggedField);

    const updateNestedFields = (fields) => {
      return fields.map((layout) => {
        if (layout.id === field.id) {
          return { ...layout, fields: updatedFields };
        }
        if (layout.type === "field-set") {
          return { ...layout, fields: updateNestedFields(layout.fields) };
        }
        if (layout.type === "columns") {
          return {
            ...layout,
            fields: layout.fields.map((column) => ({
              ...column,
              fields: updateNestedFields(column.fields),
            })),
          };
        }
        if (layout.type === "tabs") {
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

  const handleDeleteNestedField = (fieldId) => {
    const updateNestedFields = (fields) => {
      return fields.map((layout) => {
        if (layout.id === field.id) {
          return {
            ...layout,
            fields: layout.fields.filter((field) => field.id !== fieldId),
          };
        }
        if (layout.type === "field-set") {
          return { ...layout, fields: updateNestedFields(layout.fields) };
        }
        if (layout.type === "columns") {
          return {
            ...layout,
            fields: layout.fields.map((column) => ({
              ...column,
              fields: updateNestedFields(column.fields),
            })),
          };
        }
        if (layout.type === "tabs") {
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
    dispatch(removeField(fieldId));
  };

  return (
    <div ref={drop} style={{ width: "100%", minHeight: "50px" }}>
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
          {field.fields.map((child, index) =>
            previewMode ? (
              <FormRenderer
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
                type="FIELD"
                moveField={moveField}
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
                      onClick={() => dispatch(onFieldSelect(child))}
                    />
                  </div>
                  <FormRenderer
                    field={child}
                    control={control}
                    previewMode={previewMode}
                  />
                </div>
              </DragField>
            )
          )}
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
