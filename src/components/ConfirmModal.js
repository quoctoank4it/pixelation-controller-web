import React, { useState } from "react";

// Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <h2>{message}</h2>
        <button
          style={{
            padding: "10px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: 100,
          }}
          onClick={onConfirm}
        >
          Xác nhận
        </button>
        <button
          style={{
            padding: "10px",
            backgroundColor: "while",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: 100,
            marginLeft: 20,
          }}
          onClick={onClose}
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

// Styles
const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyles = {
  background: "white",
  padding: "20px",
  borderRadius: "5px",
  textAlign: "center",
};

export default ConfirmModal;
