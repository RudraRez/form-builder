import React from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import bin from "../../assets/svg/bin.svg";
import editPencil from "../../assets/svg/edit-pencil.svg";
import DragField from "../draggable-fields/drag-field";
import {
  onFieldSelect,
  removeField,
  setFormFields,
} from "../../store/slices/form-slice";
import FormRenderer from "../form-renderer";
import { useForm } from "react-hook-form";

const FormCanvas = ({ previewMode }) => {
  const dispatch = useDispatch();

  const { control } = useForm();

  const fields = useSelector((state) => state.form.formJson.form.children);

  // this only runs for 0 level nesting
  const [, drop] = useDrop({
    accept: ["FIELD"],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      const timestamp = Date.now();
      const newField = {
        ...item,
        id: `${item.id}-${timestamp}`,
        // name: `${item.name}-${timestamp}`,
      };
      dispatch(setFormFields([...fields, newField]));
    },
  });

  const moveField = (dragIndex, hoverIndex) => {
    const updatedFields = [...fields];
    const draggedField = updatedFields.splice(dragIndex, 1)[0];
    updatedFields.splice(hoverIndex, 0, draggedField);
    dispatch(setFormFields(updatedFields));
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
          // todo : this will be common
          <DragField
            key={field.id}
            index={index}
            id={field.id}
            moveField={moveField}
            type="CANVAS"
          >
            <div
              className={`nested-fields card p-2 mb-3 ${
                field.type === "columns" ? "pt-5 " : ""
              }`}
            >
              <div>
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
                    onClick={() => dispatch(removeField(field.id))}
                  />
                  <img
                    src={editPencil}
                    alt="Edit"
                    className="mx-1"
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    onClick={() => dispatch(onFieldSelect(field))}
                  />
                </div>
                <FormRenderer
                  field={field}
                  previewMode={previewMode}
                  control={control}
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
