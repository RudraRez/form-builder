import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TabContent from "./components/tab-content";

function DynamicTabs({
  field,
  setFields,
  onFieldSelect,
  control,
  previewMode,
}) {
  const [tabs, setTabs] = useState(() =>
    Array.isArray(field?.tabs) && field.tabs.length > 0
      ? field.tabs
      : [
          { id: "tab-1", label: "Tab 1", type: "tab", fields: [] },
          { id: "tab-2", label: "Tab 2", type: "tab", fields: [] },
        ]
  );

  const updateTabs = (newTabs) => {
    console.log("newTabs", newTabs);
    setTabs(newTabs);
    setFields((prevFields) => {
      console.log("prevFields", prevFields);
      const updateNestedFields = (fields) => {
        return fields.map((layout) => {
          if (layout.id === field.id) {
            return { ...layout, tabs: newTabs };
          }
          return layout;
        });
      };
      return updateNestedFields(prevFields);
    });
  };

  const handleDrop = (tabId, item) => {
    if (!item || !item.id) return;

    const timestamp = Date.now();
    const newField = {
      ...item,
      id: `${item.id}-${timestamp}`,
      name: `${item.id}-${timestamp}`,
    };

    if (!newField.type || Object.keys(newField).length === 0) return;

    const newTabs = tabs.map((tab) =>
      tab.id === tabId
        ? {
            ...tab,
            fields: [...tab.fields, newField],
          }
        : tab
    );
    updateTabs(newTabs);
  };

  const addTab = () => {
    if (tabs.length < 4) {
      updateTabs([
        ...tabs,
        {
          id: `tab-${tabs.length + 1}`,
          label: `Tab ${tabs.length + 1}`,
          fields: [],
        },
      ]);
    }
  };

  const removeTab = (tabId) => {
    if (tabs.length > 1) {
      updateTabs(tabs.filter((tab) => tab.id !== tabId));
    }
  };

  const handleDeleteField = (tabId, fieldId) => {
    const newTabs = tabs.map((tab) =>
      tab.id === tabId
        ? {
            ...tab,
            fields: tab.fields.filter((f) => f.id !== fieldId),
          }
        : tab
    );

    updateTabs(newTabs);
  };

  return (
    <div className="w-100">
      <Tabs defaultActiveKey={tabs[0]?.id || "tab-1"} className="mb-3">
        {tabs.map((tab) => (
          <Tab eventKey={tab.id} title={tab.label} key={tab.id}>
            <TabContent
              tab={tab}
              onDrop={handleDrop}
              removeTab={removeTab}
              onFieldSelect={onFieldSelect}
              handleDeleteField={handleDeleteField}
              control={control}
              setFields={setFields}
              previewMode={previewMode}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

export default DynamicTabs;
