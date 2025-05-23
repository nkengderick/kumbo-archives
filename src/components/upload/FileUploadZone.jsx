import React, { useState, useRef } from "react";
import { Upload, FolderPlus, Camera, File } from "lucide-react";

const FileUploadZone = ({ onFileSelect, onDrop, onDragOver, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only set to false if we're leaving the entire drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) {
      onDrop(e);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
    // Reset the input so the same file can be selected again
    e.target.value = "";
  };

  const handleFolderInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
    e.target.value = "";
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const openFolderDialog = () => {
    if (!disabled) {
      folderInputRef.current?.click();
    }
  };

  return (
    <div className="card">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragOver && !disabled
            ? "border-kumbo-green-500 bg-kumbo-green-50 scale-105"
            : disabled
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 hover:border-kumbo-green-400 hover:bg-kumbo-green-50"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Upload Icon */}
        <div
          className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
            isDragOver && !disabled
              ? "bg-kumbo-green-500 text-white scale-110"
              : disabled
              ? "bg-gray-200 text-gray-400"
              : "bg-kumbo-green-100 text-kumbo-green-600"
          }`}
        >
          <Upload className="w-8 h-8" />
        </div>

        {/* Main Text */}
        <h3
          className={`text-xl font-semibold mb-2 transition-colors ${
            disabled ? "text-gray-400" : "text-gray-800"
          }`}
        >
          {isDragOver && !disabled
            ? "Drop files here to upload"
            : disabled
            ? "Upload in progress..."
            : "Drop files here or click to browse"}
        </h3>

        <p
          className={`text-sm mb-8 transition-colors ${
            disabled ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {disabled
            ? "Please wait while files are being uploaded"
            : "Supports PDF, DOCX, XLSX, PPTX, JPG, PNG up to 10MB each"}
        </p>

        {/* Upload Options */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={openFileDialog}
            disabled={disabled}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-kumbo-green-600 text-white hover:bg-kumbo-green-700 hover:scale-105 shadow-lg"
            }`}
          >
            <File className="w-5 h-5" />
            <span>Choose Files</span>
          </button>

          <button
            onClick={openFolderDialog}
            disabled={disabled}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-kumbo-tan-400 text-kumbo-green-800 hover:bg-kumbo-tan-500 hover:scale-105 shadow-lg"
            }`}
          >
            <FolderPlus className="w-5 h-5" />
            <span>Upload Folder</span>
          </button>
        </div>

        {/* Additional Options */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-4">
            Or try these quick options:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              disabled={disabled}
              className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo</span>
            </button>

            <button
              disabled={disabled}
              className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Scan Document</span>
            </button>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.doc,.docx,.xlsx,.xls,.pptx,.ppt,.jpg,.jpeg,.png,.gif"
          onChange={handleFileInputChange}
        />

        <input
          ref={folderInputRef}
          type="file"
          multiple
          webkitdirectory=""
          className="hidden"
          onChange={handleFolderInputChange}
        />

        {/* Drag overlay */}
        {isDragOver && !disabled && (
          <div className="absolute inset-0 bg-kumbo-green-500 bg-opacity-10 rounded-xl border-2 border-kumbo-green-500 flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-12 h-12 text-kumbo-green-600 mx-auto mb-2" />
              <p className="text-kumbo-green-700 font-semibold">
                Drop to upload files
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Tips */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Upload Tips:</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>
                • You can select multiple files at once or drag and drop entire
                folders
              </li>
              <li>
                • Files will be processed individually with metadata forms for
                each
              </li>
              <li>
                • Large files may take longer to upload - please be patient
              </li>
              <li>• All uploads are automatically scanned for security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;
