import React from "react";
import InputField from "./fields/input-field";
import CheckBox from "./fields/check-box";
import Dropdown from "./fields/dropdown";
import Radio from "./fields/radio";
import FieldSet from "./layout/field-set";
import Columns from "./layout/columns";
import DynamicTabs from "./layout/dynamic-tabs";
import { useForm } from "react-hook-form";

const FormRenderer = ({ previewMode, field }) => {
  const { control } = useForm();

  return (
    <div>
      <div className="form-group">
        {field.type === "field-set" ? (
          <FieldSet field={field} control={control} previewMode={previewMode} />
        ) : field.type === "columns" ? (
          <Columns field={field} control={control} previewMode={previewMode} />
        ) : field.type == "tabs" ? (
          <DynamicTabs
            field={field}
            control={control}
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

export default FormRenderer;
