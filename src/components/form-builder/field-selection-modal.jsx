import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

const FieldSelectionModal = ({ show, onClose, onSelect }) => {
  const availableFields = [
    { id: "input", label: "Input Field", type: "input" },
    { id: "checkbox", label: "Checkbox", type: "checkbox" },
    { id: "dropdown", label: "Dropdown", type: "dropdown" },
    { id: "radio", label: "Radio Button", type: "radio" },
    // Add more fields as needed
  ];

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Field</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {availableFields.map((field) => (
            <ListGroup.Item
              key={field.id}
              action
              onClick={() => onSelect(field)}
            >
              {field.label}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FieldSelectionModal;
