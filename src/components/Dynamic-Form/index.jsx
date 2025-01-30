import React from "react";
import FieldSet from "./fields/field-set";
import InputField from "./fields/input-field";
import CheckBox from "./fields/check-box";
import Dropdown from "./fields/dropdown";
import Radio from "./fields/radio";

const DynamicForm = ({ field, control, handleDelete, setFields }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        {field.type === "field-set" ? (
          <FieldSet
            field={field}
            control={control}
            handleDelete={handleDelete}
            setFields={setFields}
          />
        ) : field.type === "checkbox" ? (
          <CheckBox field={field} control={control} />
        ) : field.type === "select" ? (
          <Dropdown field={field} control={control} />
        ) : field.type === "radio" ? (
          <Radio field={field} control={control} />
        ) : (
          <InputField field={field} control={control} />
        )}
      </div>
    </div>
  );
};

export default DynamicForm;
