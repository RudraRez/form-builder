import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
// import { CopyToClipboard } from "react-copy-to-clipboard";

const JsonModal = ({ show, onClose }) => {
  const [copied, setCopied] = useState(false);

  //   const handleCopy = () => {
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  //   };

  const formJsonNew = useSelector((state) => state.form.formJson);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Generated Form JSON</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formJsonNew ? (
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              background: "#f8f9fa",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          >
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "14px",
              }}
            >
              {JSON.stringify(formJsonNew, null, 2)}
            </pre>
          </div>
        ) : (
          <p>No JSON available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {/* <CopyToClipboard
          text={JSON.stringify(fieldJson, null, 2)}
          onCopy={handleCopy}
        >
          <Button variant="success">{copied ? "Copied!" : "Copy JSON"}</Button>
        </CopyToClipboard> */}
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JsonModal;
