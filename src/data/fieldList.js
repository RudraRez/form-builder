export const fieldList = [
  {
    id: "text",
    label: "Text Input",
    type: "text",
    name: "text",
    placeholder: "Enter text here",
    required: true,
    validation: { required: "This field is required" },
  },
  {
    id: "number",
    label: "Number Input",
    type: "number",
    name: "number",
    defaultValue: 0,
    required: true,
    validation: { required: "This field is required" },
  },
  {
    id: "textarea",
    label: "Textarea",
    type: "textarea",
    name: "textarea",
    placeholder: "Enter text here",
    required: true,
    validation: { required: "This field is required" },
  },
  {
    id: "checkbox",
    label: "Checkbox",
    type: "checkbox",
    name: "checkbox",
    defaultValue: false,
    required: true,
    validation: { required: "This field is required" },
  },
  {
    id: "radio",
    label: "Radio",
    type: "radio",
    name: "radio",
    defaultValue: "Option 1",
    options: ["Option 1", "Option 2"],
    required: true,
    validation: { required: "This field is required" },
  },
  {
    id: "select",
    label: "Dropdown",
    type: "select",
    options: ["Option 1", "Option 2"],
    name: "select",
    defaultValue: "Option 1",
    required: true,
    validation: { required: "This field is required" },
  },
];

export const fieldComponents = [
  {
    id: "field-set",
    label: "Field Set",
    type: "field-set",
    fields: [],
  },
];

export const dropDownOptions = [
  { value: "text", label: "Text Input" },
  { value: "number", label: "Number Input" },
  { value: "password", label: "Password Input" },
  { value: "email", label: "Email Input" },
  { value: "time", label: "Time Input" },
  { value: "date", label: "Date Input" },
  { value: "url", label: "URL Input" },
  { value: "textarea", label: "Textarea" },
];
