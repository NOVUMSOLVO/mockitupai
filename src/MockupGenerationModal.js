import React, { useState, useEffect, useRef } from 'react';
import './MockupGenerationModal.css';

export default function MockupGenerationModal({ isOpen, onClose, template, onGenerate }) {
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null); // New state for logo preview URL
  const [internalIsUploading, setInternalIsUploading] = useState(false);
  const [internalUploadProgress, setInternalUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Clean up logo preview when modal is closed or new template selected
  useEffect(() => {
    if (!isOpen) {
      setLogoFile(null);
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
      }
      setInternalIsUploading(false);
      setInternalUploadProgress(0);
    }
  }, [isOpen, logoPreview]);

  // Effect to revoke old object URL when a new file is selected
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      // Revoke previous object URL if one exists
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
      // Create a new object URL for the selected file
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoFile(null);
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
      }
    }
  };

  const handleGenerateClick = async () => {
    if (!logoFile || !template) return;

    setInternalIsUploading(true);
    setInternalUploadProgress(0); // Reset progress

    // Simulate progress for client-side feedback before actual upload starts in App.js
    // This is a simplified simulation. Real progress comes from Firebase uploadTask.
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        setInternalUploadProgress(progress);
      } else {
        clearInterval(interval);
      }
    }, 100); // Simulate progress update every 100ms

    try {
      await onGenerate(template, logoFile);
      // App.js will handle success/error notification and closing the modal
    } catch (error) {
      // Error is handled by App.js's notification system
      console.error("Generation failed in modal:", error); // Log for debugging
    } finally {
      clearInterval(interval); // Clear interval in case of early exit
      setInternalIsUploading(false);
      // Don't reset progress here, let App.js control modal closure
      // which will trigger cleanup effect.
    }
  };

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Generate Mockup: <span className="text-indigo-600">{template.name}</span></h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Your Logo (PNG, JPG, SVG)
            </label>
            <input
              type="file"
              id="logoUpload"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.svg"
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-700
                         hover:file:bg-indigo-100"
            />
          </div>

          {/* Logo Preview Section */}
          {logoPreview && (
            <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
              <img 
                src={logoPreview} 
                alt="Selected logo preview" 
                className="max-h-40 max-w-full mx-auto rounded object-contain" 
              />
            </div>
          )}

          {internalIsUploading && (
            <div className="upload-progress-container">
              <div 
                className="upload-progress-bar" 
                style={{ width: `${internalUploadProgress}%` }}
              ></div>
              <p className="upload-progress-text">{internalUploadProgress}% Uploaded</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={internalIsUploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={!logoFile || internalIsUploading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {internalIsUploading ? 'Generating...' : `Generate with ${template.name}`}
          </button>
        </div>
      </div>
    </div>
  );
}