import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TabContent from "./components/tab-content";
import { useDispatch, useSelector } from "react-redux";
import { setFormFields } from "../../../../store/slices/form-slice";

function DynamicTabs({ field, control, previewMode }) {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.form.formJson.form.children);

  const tabs = field.tabs || [];

  const updateTabs = (newTabs) => {
    // function to update nested fields
    const updateNestedFields = (fields) =>
      fields.map((layout) => {
        if (layout.id === field.id) {
          return { ...layout, tabs: newTabs };
        }
        if (layout.type === "field-set") {
          return { ...layout, fields: updateNestedFields(layout.fields) };
        }
        if (layout.type === "columns") {
          return {
            ...layout,
            fields: layout.fields.map((column) => ({
              ...column,
              fields: updateNestedFields(column.fields),
            })),
          };
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
    dispatch(setFormFields(updateNestedFields(fields)));
  };

  const handleDrop = (tabId, item) => {
    console.log("i am inside dynamic-tabs");

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

  const moveField = (tabId, dragIndex, hoverIndex) => {
    const moveItem = (list, fromIndex, toIndex) => {
      const updatedList = [...list];
      const [removed] = updatedList.splice(fromIndex, 1);
      updatedList.splice(toIndex, 0, removed);
      return updatedList;
    };

    const newTabs = tabs.map((tab) => {
      if (tab.id === tabId) {
        return {
          ...tab,
          fields: moveItem(tab.fields, dragIndex, hoverIndex),
        };
      }
      return tab;
    });

    updateTabs(newTabs);
  };

  return (
    <div className="w-100">
      <Tabs defaultActiveKey={tabs[0]?.id || ""} className="mb-3">
        {tabs.map((tab) => (
          <Tab eventKey={tab.id} title={tab.label} key={tab.id}>
            <TabContent
              control={control}
              previewMode={previewMode}
              tab={tab}
              onDrop={handleDrop}
              handleDeleteField={handleDeleteField}
              moveField={moveField}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

export default DynamicTabs;
