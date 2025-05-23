/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useCallback } from "react";
import {
  Upload,
  File,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDocuments } from "../context/DocumentContext";
import {
  documentCategories,
  departments,
  fileTypeIcons,
} from "../data/mockData";
import FileUploadZone from "../components/upload/FileUploadZone";
import FilePreview from "../components/upload/FilePreview";
import UploadProgress from "../components/upload/UploadProgress";
import BulkActions from "../components/upload/BulkActions";

const UploadPage = () => {
  const { user } = useAuth();
  const { addDocument, addNotification } = useDocuments();

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  // eslint-disable-next-line no-unused-vars
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  // Check if user has upload permissions
  const canUpload = user?.role === "admin" || user?.role === "staff";

  if (!canUpload) {
    return (
      <div className="p-6 animate-fade-in">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Upload Not Permitted
          </h2>
          <p className="text-gray-600 mb-4">
            You need staff or administrator privileges to upload documents.
          </p>
          <p className="text-sm text-gray-500">
            Contact your administrator if you need upload access.
          </p>
        </div>
      </div>
    );
  }

  // Handle file selection
  const handleFileSelect = useCallback(
    (selectedFiles) => {
      const newFiles = Array.from(selectedFiles).map((file, index) => ({
        id: Date.now() + index,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "pending", // pending, uploading, completed, error
        progress: 0,
        metadata: {
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          description: "",
          category: "Administrative",
          department: user?.department || "Administration",
          author: user?.name || "Unknown",
          keywords: [],
          language: "English",
          isPublic: false,
        },
        preview: null,
        error: null,
      }));

      // Generate previews for images
      newFiles.forEach((fileItem) => {
        if (fileItem.file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileItem.id ? { ...f, preview: e.target.result } : f
              )
            );
          };
          reader.readAsDataURL(fileItem.file);
        }
      });

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [user]
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFiles = e.dataTransfer.files;
      handleFileSelect(droppedFiles);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Remove file
  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
  };

  // Update file metadata
  const updateFileMetadata = (fileId, metadata) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, metadata: { ...f.metadata, ...metadata } } : f
      )
    );
  };

  // Add keyword to file
  const addKeyword = (fileId, keyword) => {
    if (!keyword.trim()) return;

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              metadata: {
                ...f.metadata,
                keywords: [...(f.metadata.keywords || []), keyword.trim()],
              },
            }
          : f
      )
    );
  };

  // Remove keyword from file
  const removeKeyword = (fileId, keywordIndex) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              metadata: {
                ...f.metadata,
                keywords: f.metadata.keywords.filter(
                  (_, index) => index !== keywordIndex
                ),
              },
            }
          : f
      )
    );
  };

  // Simulate file upload
  const uploadFile = async (fileItem) => {
    return new Promise((resolve) => {
      const duration = 2000 + Math.random() * 3000; // 2-5 seconds
      const interval = 100;
      let progress = 0;

      const updateProgress = () => {
        progress += (interval / duration) * 100;

        setUploadProgress((prev) => ({
          ...prev,
          [fileItem.id]: Math.min(progress, 100),
        }));
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                  ...f,
                  progress: Math.min(progress, 100),
                  status: progress >= 100 ? "completed" : "uploading",
                }
              : f
          )
        );

        if (progress < 100) {
          setTimeout(updateProgress, interval);
        } else {
          resolve();
        }
      };

      setTimeout(updateProgress, interval);
    });
  };

  // Upload all files
  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setUploading(true);

    // Update status to uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.status === "pending" ? { ...f, status: "uploading" } : f
      )
    );

    try {
      // Upload files concurrently
      await Promise.all(pendingFiles.map((fileItem) => uploadFile(fileItem)));

      // Add documents to the system
      pendingFiles.forEach((fileItem) => {
        const documentData = {
          title: fileItem.metadata.title,
          description: fileItem.metadata.description,
          category: fileItem.metadata.category,
          department: fileItem.metadata.department,
          author: fileItem.metadata.author,
          keywords: fileItem.metadata.keywords,
          language: fileItem.metadata.language,
          type: getFileExtension(fileItem.name),
          size: formatFileSize(fileItem.size),
          isStarred: false,
          viewCount: 0,
          downloadCount: 0,
        };

        addDocument(documentData);
      });

      // Show success notification
      addNotification(
        `Successfully uploaded ${pendingFiles.length} document${
          pendingFiles.length !== 1 ? "s" : ""
        }`,
        "success"
      );

      // Clear completed files after a delay
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.status !== "completed"));
        setUploadProgress({});
      }, 2000);
    } catch (error) {
      // Handle upload errors
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "error", error: "Upload failed" }
            : f
        )
      );

      addNotification("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Utility functions
  const getFileExtension = (filename) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (filename) => {
    const ext = getFileExtension(filename);
    return fileTypeIcons[ext] || "📄";
  };

  // File selection for bulk operations
  const toggleFileSelection = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    const allFileIds = files.map((f) => f.id);
    setSelectedFiles(allFileIds);
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  // Bulk operations
  const handleBulkAction = (action) => {
    switch (action) {
      case "remove":
        selectedFiles.forEach((fileId) => removeFile(fileId));
        clearSelection();
        break;
      case "category":
        setShowBulkEdit(true);
        break;
      default:
        break;
    }
  };

  const pendingFiles = files.filter((f) => f.status === "pending");
  const uploadingFiles = files.filter((f) => f.status === "uploading");
  const completedFiles = files.filter((f) => f.status === "completed");
  const errorFiles = files.filter((f) => f.status === "error");

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">
            Upload Documents
          </h1>
          <p className="text-gray-600">
            Add new documents to the Kumbo Council digital archive
          </p>
        </div>

        {files.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </div>
            {pendingFiles.length > 0 && (
              <button
                onClick={handleUploadAll}
                disabled={uploading}
                className="btn-primary flex items-center space-x-2"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <span>
                  {uploading
                    ? "Uploading..."
                    : `Upload ${pendingFiles.length} File${
                        pendingFiles.length !== 1 ? "s" : ""
                      }`}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-800">{files.length}</p>
            </div>
            <File className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {pendingFiles.length}
              </p>
            </div>
            <Upload className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedFiles.length}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600">
                {errorFiles.length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* File Upload Zone */}
      <FileUploadZone
        onFileSelect={handleFileSelect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        disabled={uploading}
      />

      {/* Upload Progress Overview */}
      {uploadingFiles.length > 0 && (
        <UploadProgress files={uploadingFiles} progress={uploadProgress} />
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="card">
          {/* File List Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Files ({files.length})
                </h2>

                {selectedFiles.length > 0 && (
                  <BulkActions
                    selectedCount={selectedFiles.length}
                    onAction={handleBulkAction}
                    onSelectAll={selectAllFiles}
                    onClearSelection={clearSelection}
                  />
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-kumbo-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-kumbo-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="space-y-1 w-4 h-4">
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* File List Content */}
          <div
            className={`p-6 ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {files.map((fileItem, index) => (
              <FilePreview
                key={fileItem.id}
                file={fileItem}
                viewMode={viewMode}
                isSelected={selectedFiles.includes(fileItem.id)}
                onSelect={() => toggleFileSelection(fileItem.id)}
                onRemove={() => removeFile(fileItem.id)}
                onUpdateMetadata={(metadata) =>
                  updateFileMetadata(fileItem.id, metadata)
                }
                onAddKeyword={(keyword) => addKeyword(fileItem.id, keyword)}
                onRemoveKeyword={(index) => removeKeyword(fileItem.id, index)}
                categories={documentCategories}
                departments={departments}
                getFileIcon={getFileIcon}
                formatFileSize={formatFileSize}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Supported File Types
            </h4>
            <div className="flex flex-wrap gap-2">
              {["PDF", "DOCX", "XLSX", "PPTX", "JPG", "PNG"].map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              File Requirements
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Maximum file size: 10 MB</li>
              <li>• Descriptive filename recommended</li>
              <li>• Add relevant keywords for better searchability</li>
              <li>• Select appropriate category and department</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
