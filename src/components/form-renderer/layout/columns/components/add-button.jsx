import React from "react";
import add from "../../../../../assets/svg/add.svg";

const AddColumnButton = ({ addColumn }) => (
  <div className="d-flex justify-content-center mt-3">
    <img
      src={add}
      alt="Add Column"
      style={{ width: "30px", height: "30px", cursor: "pointer" }}
      onClick={addColumn}
    />
  </div>
);

export default AddColumnButton;
