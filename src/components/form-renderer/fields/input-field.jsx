import React from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";

function InputField({ field, control }) {
  return (
    <div className="d-flex flex-column w-100">
      <Form.Label>
        {field.label}
        {field.validation?.required && (
          <span className="text-danger ms-1">*</span>
        )}
      </Form.Label>
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.defaultValue || ""}
        rules={field.validation || {}}
        render={({ field: controllerField, fieldState: { error } }) => (
          <>
            <Form.Control
              {...controllerField}
              type={field.type !== "textarea" ? field.type : undefined}
              as={field.type === "textarea" ? "textarea" : "input"}
              placeholder={field.placeholder || ""}
            />
            {error && <p className="text-danger mt-1">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
}

export default InputField;
