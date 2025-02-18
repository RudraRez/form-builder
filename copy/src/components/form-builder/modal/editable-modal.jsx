import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { dropDownOptions } from "../../../data/fieldList";
import { useDispatch } from "react-redux";
import { updateField } from "../../../store/slices/form-slice";

function EditableModal({ show, onClose, field }) {
  const dispatch = useDispatch();

  const [editedField, setEditedField] = useState(field);
  const [validationString, setValidationString] = useState(
    JSON.stringify(field?.validation || {}, null, 2)
  );
  const [jsonError, setJsonError] = useState(null);

  useEffect(() => {
    setEditedField(field);
    setValidationString(JSON.stringify(field.validation || {}, null, 2));
  }, [field]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "options") {
      setEditedField({
        ...editedField,
        options: value.split("#").map((opt) => opt.trim()),
      });
    } else if (name === "required") {
      setEditedField({
        ...editedField,
        validation: {
          ...editedField.validation,
          required: checked,
        },
      });
    } else if (name === "validation") {
      setValidationString(value);
      try {
        const parsed = JSON.parse(value);
        setEditedField((prev) => ({ ...prev, validation: parsed }));
        setJsonError(null);
      } catch (err) {
        setJsonError("Invalid JSON format");
      }
    } else {
      setEditedField((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (!jsonError) {
      dispatch(updateField(editedField)); // this is the action to update the field
      onClose();
    } else {
      alert("Please fix the JSON errors before saving.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Field</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-3 card">
          <form className="row">
            <div className="mb-3 col-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={editedField.name || ""}
                onChange={handleChange}
                // disabled
              />
            </div>
            <div className="mb-3 col-6">
              <label className="form-label">Label</label>
              <input
                type="text"
                className="form-control"
                name="label"
                value={editedField.label || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-6">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                name="type"
                value={editedField.type || "text"}
                onChange={handleChange}
              >
                {dropDownOptions &&
                  dropDownOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>

            {editedField.placeholder !== undefined && (
              <div className="mb-3 col-6">
                <label className="form-label">Placeholder</label>
                <input
                  type="text"
                  className="form-control"
                  name="placeholder"
                  value={editedField.placeholder || ""}
                  onChange={handleChange}
                />
              </div>
            )}
            {editedField.defaultValue !== undefined && (
              <div className="mb-3 col-6">
                <label className="form-label">Default Value</label>
                <input
                  type="text"
                  className="form-control"
                  name="defaultValue"
                  value={editedField.defaultValue || ""}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="mb-3 mx-3 form-check">
              <input
                type="checkbox"
                className="form-check-input "
                name="required"
                checked={editedField.validation?.required || false}
                onChange={handleChange}
              />
              <label className="form-check-label">Required</label>
            </div>
            {editedField.options !== undefined && (
              <div className="mb-3">
                <label className="form-label">Options</label>
                <input
                  type="text"
                  className="form-control"
                  name="options"
                  value={editedField.options?.join("#") || ""}
                  onChange={handleChange}
                />
                <small className="text-muted">
                  Separate options with `#` (e.g., Option 1#Option 2).
                </small>
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Validation (JSON)</label>
              <textarea
                className="form-control"
                name="validation"
                rows="3"
                value={validationString}
                onChange={handleChange}
              />
              {jsonError && <small className="text-danger">{jsonError}</small>}
              <small className="text-muted">
                Edit validation rules in JSON format (e.g.,
                {' {"required": "This field is required"}'}).
              </small>
            </div>
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default EditableModal;
