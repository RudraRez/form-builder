import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { fieldComponents, fieldList } from "../../data/fieldlist";
import FormCanvas from "./form-canvas";
import FieldEditor from "./field-editor";
import "./form-builder.css";
import { useForm } from "react-hook-form";
import DraggableField from "../draggable-fields/draggable-field";

const FormBuilder = () => {
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm();

  const [fields, setFields] = useState([]); // for form fields
  const [selectedField, setSelectedField] = useState(null); // for editing
  const [isPreview, setIsPreview] = useState(false); // Toggle Preview mode

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    console.log(field, "-----");
  };

  const onSubmit = () => {
    console.log(fields, " ----");
  };

  const formSubmit = (data) => {
    console.log(data);
  };

  const togglePreview = () => setIsPreview((prev) => !prev);

  const handleFieldUpdate = (updatedField) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className="text-center">FORM BUILDER</h1>
      <div className="my-4">
        <button className="btn btn-secondary my-3" onClick={togglePreview}>
          {isPreview ? "Edit Mode" : "Preview Mode"}
        </button>
        <div className="row">
          {/* Left Panel - Fields */}
          <div className="col-md-3">
            <div className="available-fields card p-3 shadow-sm">
              <h5 className="card-title mb-3">Fields</h5>
              {fieldList.map((field) => (
                <DraggableField key={field.id} field={field} />
              ))}
              <h5 className="card-title my-3">Field - Component</h5>
              {fieldComponents.map((field) => (
                <DraggableField key={field.id} field={field} />
              ))}
            </div>
          </div>

          {/* Middle Panel - Form Canvas */}
          <div className="col-md-6">
            <form
              className="form-canvas card p-3 shadow-sm"
              onSubmit={handleSubmit(formSubmit)}
            >
              <FormCanvas
                fields={fields}
                setFields={setFields}
                onFieldSelect={handleFieldSelect}
                control={control}
                isPreview={isPreview}
              />
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isValid}
                >
                  Submit Form
                </button>
              </div>
            </form>
          </div>

          {/* Right Panel - Field Editor */}
          <div className="col-md-3">
            {selectedField ? (
              <FieldEditor
                field={selectedField}
                onFieldUpdate={handleFieldUpdate}
              />
            ) : (
              <div className="card p-3 shadow-sm">
                <h5 className="text-center">Select a Field to Edit</h5>
              </div>
            )}
          </div>
        </div>
      </div>

      <button onClick={onSubmit}>BB</button>
    </DndProvider>
  );
};

export default FormBuilder;
