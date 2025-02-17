import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import DynamicForm from "../../dynamic-form";
import { useSelector } from "react-redux";

function PreviewModal({ show, onClose }) {
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm();

  const formJsonNew = useSelector((state) => state.form.formJson);

  const formSubmit = (data) => {
    console.log(data);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Preview Mode</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formJsonNew && formJsonNew.form.children?.length > 0 ? (
          <form onSubmit={handleSubmit(formSubmit)}>
            {formJsonNew.form.children.map((field) => (
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
                // disabled={!isValid}
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

export default PreviewModal;
