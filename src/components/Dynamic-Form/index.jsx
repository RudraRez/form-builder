import React from "react";
import InputField from "./fields/input-field";
import CheckBox from "./fields/check-box";
import Dropdown from "./fields/dropdown";
import Radio from "./fields/radio";
// import Section from "./layout/section";
import FieldSet from "./layout/field-set";
import Columns from "./layout/columns";

const DynamicForm = ({
  field,
  control,
  setFields,
  onFieldSelect,
  previewMode,
}) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        {field.type === "field-set" ? (
          <FieldSet
            field={field}
            control={control}
            setFields={setFields}
            onFieldSelect={onFieldSelect}
            previewMode={previewMode}
          />
        ) : field.type === "columns" ? (
          <Columns
            field={field}
            control={control}
            setFields={setFields}
            onFieldSelect={onFieldSelect}
            previewMode={previewMode}
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
