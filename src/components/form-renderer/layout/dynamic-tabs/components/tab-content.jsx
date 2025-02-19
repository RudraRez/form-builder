import React from "react";
import { useDrop } from "react-dnd";
import bin from "../../../../../assets/svg/bin.svg";
import editPencil from "../../../../../assets/svg/edit-pencil.svg";
import DragField from "../../../../draggable-fields/drag-field";
import FormRenderer from "../../..";
import { useDispatch } from "react-redux";
import { onFieldSelect } from "../../../../../store/slices/form-slice";

function TabContent({
  tab,
  onDrop,
  handleDeleteField,
  control,
  previewMode,
  moveField,
}) {
  const dispatch = useDispatch();

  const [, drop] = useDrop({
    accept: ["FIELD"],

    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      onDrop(tab.id, item);
    },
  });

  if (previewMode) {
    return (
      <>
        {tab.fields.map((child, index) => (
          <div key={index}>
            <FormRenderer
              field={child}
              control={control}
              previewMode={previewMode}
            />
          </div>
        ))}
      </>
    );
  }

  return (
    <div ref={drop} style={{ minHeight: "200px" }}>
      {tab.fields.length > 0 ? (
        tab.fields.map((child) => (
          <DragField
            key={child.id}
            id={child.id}
            type="FIELD"
            moveField={(dragIndex, hoverIndex) =>
              moveField(tab.id, dragIndex, hoverIndex)
            }
          >
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
                  onClick={() => dispatch(onFieldSelect(child))}
                />
              </div>
              <FormRenderer
                field={child}
                control={control}
                previewMode={previewMode}
              />
            </div>
          </DragField>
        ))
      ) : (
        <p className="text-center">Drop fields here</p>
      )}
    </div>
  );
}

export default TabContent;
