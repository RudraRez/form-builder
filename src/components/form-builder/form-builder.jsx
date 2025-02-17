import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FormCanvas from "./form-canvas";
import { useForm } from "react-hook-form";
import DraggableField from "../draggable-fields/available-field";
import PreviewModal from "./modal/preview-modal";
import JsonModal from "./modal/json-modal";
import EditableModal from "./modal/editable-modal";
import { closeEditModal } from "../../store/slices/form-slice";
import "./form-builder.css";
import { fieldInputs, fieldLayouts } from "../../utils/field-list";

const FormBuilder = () => {
  const { control } = useForm();
  const dispatch = useDispatch();

  const formFields = useSelector((state) => state.form.formJson.form.children); // this is the form fields
  const activeField = useSelector((state) => state.form.fieldSelected); // this id for edit field
  // const isEditableModalOpen = useSelector((state) => state.form.editMode); // this id for edit field

  // this is for modal state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  const openJsonModal = () => {
    setIsJsonModalOpen(!isJsonModalOpen);
  };

  const togglePreviewMode = () => {
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
        />

        <JsonModal
          show={isJsonModalOpen}
          onClose={() => setIsJsonModalOpen(false)}
        />

        {activeField && (
          <EditableModal
            show={isEditableModalOpen}
            field={activeField} // this is the field to edit because i have to show modal with field is selected
            onClose={() => dispatch(closeEditModal())}
          />
        )}

        <div className="row">
          <div className="col-md left-panel">
            <div className="available-fields card p-1 shadow-sm">
              <h5 className="card-title mb-3">Available Fields</h5>
              {fieldInputs.map((field) => (
                <div key={field.id}>
                  <DraggableField field={field} />
                </div>
              ))}
              <h5 className="card-title my-3">Layout</h5>
              {fieldLayouts.map((field) => (
                <div key={field.id}>
                  <DraggableField field={field} />
                </div>
              ))}
            </div>
          </div>
          <div className="col-md">
            <FormCanvas
              fields={formFields}
              control={control}
              isPreview={isPreviewMode}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
