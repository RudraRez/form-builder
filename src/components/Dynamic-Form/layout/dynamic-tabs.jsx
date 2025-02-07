import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useDrop } from "react-dnd";
import DragField from "../../draggable-fields/drag-filed";
import bin from "../../../assets/svg/bin.svg";
import editPencil from "../../../assets/svg/edit-pencil.svg";
import DynamicForm from "..";

function DynamicTabs({ field, setFields, onFieldSelect, control }) {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    setTabs(
      Array.isArray(field?.tabs) && field.tabs.length > 0
        ? field.tabs
        : [
            { id: "tab-1", label: "Tab 1", type: "tab", fields: [] },
            { id: "tab-2", label: "Tab 2", type: "tab", fields: [] },
          ]
    );
  }, [field?.tabs]);

  const updateTabs = (newTabs) => {
    setTabs(newTabs);
    setFields((prevFields) =>
      prevFields.map((f) => (f.id === field.id ? { ...f, tabs: newTabs } : f))
    );
  };

  const handleDrop = (tabId, item) => {
    const newTabs = tabs.map((tab) =>
      tab.id === tabId
        ? {
            ...tab,
            fields: [
              ...tab.fields,
              { ...item, id: `${item.id}-${Date.now()}` },
            ],
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
    updateTabs(
      tabs.map((tab) =>
        tab.id === tabId
          ? { ...tab, fields: tab.fields.filter((f) => f.id !== fieldId) }
          : tab
      )
    );
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
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

function TabContent({
  tab,
  onDrop,
  handleDeleteField,
  control,
  onFieldSelect,
}) {
  const [, drop] = useDrop({
    accept: "FIELD",
    drop: (item) => onDrop(tab.id, item),
  });

  return (
    <div ref={drop} style={{ minHeight: "200px" }}>
      {tab.fields.length > 0 ? (
        tab.fields.map((child) => (
          <DragField key={child.id} id={child.id} type="DYNAMIC_TAB">
            <div className="card p-3 mb-3">
              <div
                className="position-absolute d-flex justify-content-end p-2"
                style={{
                  top: 0,
                  right: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "4px",
                  zIndex: 10,
                }}
              >
                <img
                  src={bin}
                  alt="Delete"
                  className="mx-1"
                  style={{ width: "20px", cursor: "pointer" }}
                  onClick={() => handleDeleteField(tab.id, child.id)}
                />
                <img
                  src={editPencil}
                  alt="Edit"
                  className="mx-1"
                  style={{ width: "20px", cursor: "pointer" }}
                  onClick={() => onFieldSelect(child)}
                />
              </div>
              <DynamicForm field={child} control={control} />
            </div>
          </DragField>
        ))
      ) : (
        <p className="text-center">Drop fields here</p>
      )}
    </div>
  );
}

export default DynamicTabs;
