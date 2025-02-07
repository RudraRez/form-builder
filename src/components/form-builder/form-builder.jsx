import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { fieldComponents, fieldList } from "../../data/fieldList";
import FormCanvas from "./form-canvas";
import FieldEditor from "./field-editor";
import "./form-builder.css";
import { useForm } from "react-hook-form";
import DraggableField from "../draggable-fields/available-field";
import PreviewModal from "./modal/preview-modal";
import JsonModal from "./modal/json-modal";

const FormBuilder = () => {
  const { control } = useForm();

  const [formFields, setFormFields] = useState([]); // Form fields main childrens json
  const [activeField, setActiveField] = useState(null); // Field being edited
  const [isPreviewMode, setIsPreviewMode] = useState(false); // for modal preview
  const [generatedJson, setGeneratedJson] = useState(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Handle field selection
  const handleFieldSelection = (field) => {
    setActiveField(field);
  };

  // Update field in the form
  const updateField = (updatedField) => {
    const updateNestedFields = (fields) => {
      return fields.map((field) => {
        if (field.id === updatedField.id) {
          return updatedField;
        }

        if (field.type === "field-set") {
          return {
            ...field,
            fields: updateNestedFields(field.fields),
          };
        }

        if (field.type === "columns") {
          return {
            ...field,
            fields: field.fields.map((column) => ({
              ...column,
              fields: updateNestedFields(column.fields), // Fix: Update fields inside each column
            })),
          };
        }

        return field;
      });
    };

    setFormFields((prevFields) => updateNestedFields(prevFields));
  };

  // Create JSON from form fields
  const createFormJson = () => {
    const formJson = {
      version: "1.0",
      form: {
        key: "root",
        type: "container",
        children: formFields,
      },
    };
    setGeneratedJson(formJson);
  };

  const openJsonModal = () => {
    createFormJson();
    setIsJsonModalOpen(!isJsonModalOpen);
  };

  const togglePreviewMode = () => {
    createFormJson();
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className="text-center">Form Builder</h1>
      <div className="my-2">
        <button className="btn btn-secondary my-3" onClick={togglePreviewMode}>
          Preview Mode
        </button>

        <button onClick={openJsonModal} className="btn btn-primary my-3 mx-3">
          Generate JSON
        </button>

        <PreviewModal
          show={isPreviewMode}
          onClose={() => setIsPreviewMode(false)}
          formJson={generatedJson}
        />
        <JsonModal
          show={isJsonModalOpen}
          onClose={() => setIsJsonModalOpen(false)}
          formJson={generatedJson}
        />

        <div className="row">
          {/* Left Panel - Available Fields */}
          <div className="col-md left-pannel">
            <div className="available-fields card p-1 shadow-sm">
              <h5 className="card-title mb-3">Available Fields</h5>
              {fieldList.map((field) => (
                <DraggableField key={field.id} field={field} />
              ))}
              <h5 className="card-title my-3">Layout</h5>
              {fieldComponents.map((field) => (
                <DraggableField key={field.id} field={field} />
              ))}
            </div>
          </div>

          {/* Middle Panel - Form Canvas */}
          <div className="col-md">
            <FormCanvas
              fields={formFields}
              setFields={setFormFields}
              onFieldSelect={handleFieldSelection}
              control={control}
              isPreview={isPreviewMode}
            />
          </div>

          {/* Right Panel - Field Editor */}
          <div className="col-md-3">
            {activeField ? (
              <FieldEditor field={activeField} onFieldUpdate={updateField} />
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
