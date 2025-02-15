import { useState ,useCallback } from "react";

const useNestedField = (initialFields) => {
  const [fields, setFields] = useState(initialFields);

  const updateColumns = useCallback((newColumns, fieldId) => {
    setFields((prevFields) => {
      const updateNestedFields = (fields) => {
        return fields.map((layout) => {
          if (layout.id === fieldId) {
            return { ...layout, fields: newColumns };
          }
          if (layout.type === "field-set" && layout.fields.length > 0) {
            return { ...layout, fields: updateNestedFields(layout.fields) };
          }
          if (layout.type === "tabs" && layout.tabs.length > 0) {
            return {
              ...layout,
              tabs: layout.tabs.map((tab) => ({
                ...tab,
                fields: updateNestedFields(tab.fields),
              })),
            };
          }
          return layout;
        });
      };
      return updateNestedFields(prevFields);
    });
  }, []);

  return { columns, fields, updateColumns };
};

export default useNestedField;
