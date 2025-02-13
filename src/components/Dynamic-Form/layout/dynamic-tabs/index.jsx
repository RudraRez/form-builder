import React from "react";
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
  const tabs = field.tabs || [];

  const updateTabs = (newTabs) => {
    setFields((prevFields) => {
      const updateNestedFields = (fields) =>
        fields.map((layout) => {
          if (layout.id === field.id) {
            return { ...layout, tabs: newTabs };
          }
          if (layout.type === "field-set" && layout.fields?.length) {
            return { ...layout, fields: updateNestedFields(layout.fields) };
          }
          if (layout.type === "tabs" && layout.tabs?.length) {
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

      return updateNestedFields(prevFields);
    });
  };

  const handleDrop = (tabId, item) => {
    const newField = {
      ...item,
      id: `${item.id}-${Date.now()}`,
      name: `${item.name}-${Date.now()}`,
    };

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
      <Tabs defaultActiveKey={tabs[0]?.id || ""} className="mb-3">
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
