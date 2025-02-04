import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { fieldComponents, fieldList } from "../../data/fieldlist";
import FormCanvas from "./form-canvas";
import FieldEditor from "./field-editor";
import "./form-builder.css";
import { useForm } from "react-hook-form";
import DraggableField from "../draggable-fields/available-field";
import PreviewModeModel from "./preview-mode-model";

const FormBuilder = () => {
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm();

  const [fields, setFields] = useState([]); // for form fields
  const [selectedField, setSelectedField] = useState(null); // for editing
  const [isPreview, setIsPreview] = useState(false); // Toggle Preview mode
  const [fieldJson, setFieldJson] = useState(null);

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    console.log(field, "-----");
  };

  const formSubmit = (data) => {
    console.log(data);
  };

  const handleFieldUpdate = (updatedField) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
  };

  const generateJSON = () => {
    const formJSON = {
      version: "1.0",
      form: {
        key: "root",
        type: "container",
        children: fields,
      },
    };
    setFieldJson(formJSON);
    console.log(JSON.stringify(formJSON, null, 2));
  };

  const togglePreview = () => {
    generateJSON();
    setIsPreview(true);
  };

  const closePreview = () => {
    setIsPreview(false); // Close the modal
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className="text-center">FORM BUILDER</h1>
      <div className="my-4">
        <button className="btn btn-secondary my-3" onClick={togglePreview}>
          {isPreview ? "Edit Mode" : "Preview Mode"}
        </button>

        <button onClick={generateJSON} className="btn btn-primary my-3 mx-3">
          Generate JSON
        </button>
        <PreviewModeModel
          show={isPreview}
          onClose={closePreview}
          fieldJson={fieldJson}
        />
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
            <FormCanvas
              fields={fields}
              setFields={setFields}
              onFieldSelect={handleFieldSelect}
              control={control}
              isPreview={isPreview}
            />
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
    </DndProvider>
  );
};

export default FormBuilder;
