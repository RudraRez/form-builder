import React from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";

function Radio({ field, control }) {
  return (
    <div className="d-flex flex-column w-100">
      <Form.Label>
        {field.label}
        {field.validation?.required && (
          <span className="text-danger ms-1">*</span>
        )}
      </Form.Label>
      <Controller
        name={field.id}
        control={control}
        defaultValue={field.defaultValue || ""}
        rules={field.validation || {}}
        render={({ field: controllerField, fieldState: { error } }) => (
          <div>
            {field.options.map((option) => (
              <Form.Check
                key={option}
                type="radio"
                label={option}
                value={option}
                {...controllerField}
              />
            ))}
            {error && <p className="text-danger">{error.message}</p>}
          </div>
        )}
      />
    </div>
  );
}

export default Radio;
