import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicForm from "../dynamic-form";
import bin from "../../assets/svg/bin.svg";
import editPencil from "../../assets/svg/edit-pencil.svg";
import {
  onFieldSelect,
  removeField,
  setFormFields,
  updateField,
} from "../../store/slices/form-slice";
import { useDroppable, useDndMonitor } from "@dnd-kit/core";

const FormCanvas = ({ control }) => {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.form.formJson.form.children);

  const { isOver, setNodeRef } = useDroppable({
    id: "canvas",
  });

  useDndMonitor({
    onDragEnd(event) {
      const { over, active } = event;

      if (over?.id === "canvas" && active?.data?.current?.field) {
        const newField = { ...active.data.current.field, id: Date.now() };
        dispatch(setFormFields([...fields, newField]));
      }
    },
  });

  const style = {
    border: isOver ? "2px dashed green" : "2px dashed gray",
    minHeight: "200px",
    padding: "10px",
  };

  return (
    <div ref={setNodeRef} style={style} className="form-canvas-container">
      <h5>Form Canvas</h5>
      {fields.length === 0 ? (
        <p>Drag fields here to build your form</p>
      ) : (
        fields.map((field) => (
          <div
            key={field.id}
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
              <DynamicForm field={field} control={control} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FormCanvas;
