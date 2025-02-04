import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import DynamicForm from "../Dynamic-Form";

function PreviewModeModel({ show, onClose, fieldJson }) {
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm();

  const formSubmit = (data) => {
    console.log(data);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Preview Mode</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fieldJson && fieldJson.form.children.length > 0 ? (
          <form onSubmit={handleSubmit(formSubmit)}>
            {fieldJson.form.children.map((field) => (
              <DynamicForm
                key={field.id}
                field={field}
                control={control}
                previewMode={show}
              />
            ))}
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
        ) : (
          <p>No form fields available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PreviewModeModel;
