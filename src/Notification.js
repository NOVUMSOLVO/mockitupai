import React, { useEffect } from 'react';

export default function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const baseStyle = "fixed top-5 right-5 p-4 rounded-md shadow-lg text-white z-[100]";
  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type] || typeStyles.info}`}>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 text-xl font-semibold leading-none hover:text-gray-200"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}