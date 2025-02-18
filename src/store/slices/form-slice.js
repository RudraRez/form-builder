import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formJson: {
    version: "0.1",
    form: {
      key: "root",
      type: "container",
      children: [],
    },
  },
  editMode: false,
  fieldSelected: null,
  isPreviewMode: false,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormFields(state, action) {
      state.formJson.form.children = action.payload;
    },

    // select field
    onFieldSelect(state, action) {
      state.fieldSelected = action.payload;
      state.editMode = true; // open edit modal
    },

    // nested update field
    updateField(state, action) {
      const updatedField = action.payload;

      const updateNestedFields = (fields) =>
        fields.map((field) => {
          if (field.id === updatedField.id) {
            return updatedField;
          }

          if (field.type === "field-set" && field.fields) {
            return { ...field, fields: updateNestedFields(field.fields) };
          }

          if (field.type === "columns" && field.fields) {
            return {
              ...field,
              fields: field.fields.map((column) => ({
                ...column,
                fields: updateNestedFields(column.fields),
              })),
            };
          }

          if (field.type === "tabs" && field.tabs) {
            return {
              ...field,
              tabs: field.tabs.map((tab) => ({
                ...tab,
                fields: updateNestedFields(tab.fields),
              })),
            };
          }

          return field;
        });

      state.formJson.form.children = updateNestedFields(
        state.formJson.form.children
      );
    },

    // remove nested field
    removeField(state, action) {
      if (window.confirm("Are you sure you want to delete this item?")) {
        state.formJson.form.children = state.formJson.form.children.filter(
          (field) => field.id !== action.payload
        );
      }
    },

    closeEditModal(state) {
      state.fieldSelected = null;
      state.editMode = false;
    },
  },
});

export const {
  setFormFields,
  updateField,
  removeField,
  onFieldSelect,
  closeEditModal,
} = formSlice.actions;
export default formSlice.reducer;
