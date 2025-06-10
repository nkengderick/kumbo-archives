import React, { useState, useCallback, useMemo } from "react";
import {
  Upload,
  File,
  Check,
  AlertCircle,
  X,
  Loader2,
  Eye,
  EyeOff,
  Plus,
  Tag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDocuments } from "../context/DocumentContext";
import FileUploadZone from "../components/upload/FileUploadZone";
import FilePreview from "../components/upload/FilePreview";
import BulkActions from "../components/upload/BulkActions";

const UploadPage = () => {
  const { user } = useAuth();
  const { uploadDocument, isUploading, uploadProgress, error, clearError } =
    useDocuments();

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [notification, setNotification] = useState(null);

  // Predefined departments (could also come from an API)
  const departments = [
    "Administration",
    "Finance",
    "Cultural Affairs",
    "Public Works",
    "Health Services",
    "Education",
    "Planning & Development",
    "Legal Affairs",
    "Land Registry",
    "External",
  ];

  const categories = useMemo(
    () => [
      "Administrative",
      "Financial",
      "Legal",
      "Cultural",
      "Infrastructure",
      "Education",
      "Healthcare",
      "Heritage",
      "Planning",
      "Environmental",
      "Social",
      "Economic",
    ],
    []
  );

  // Document status options
  const statusOptions = [
    { value: "draft", label: "Draft", color: "text-amber-600" },
    { value: "published", label: "Published", color: "text-green-600" },
    { value: "archived", label: "Archived", color: "text-gray-600" },
  ];

  // Language options
  const languageOptions = ["English", "French", "Local Language"];

  // File type icons mapping
  const fileTypeIcons = {
    PDF: "📄",
    DOC: "📝",
    DOCX: "📝",
    XLS: "📊",
    XLSX: "📊",
    PPT: "📺",
    PPTX: "📺",
    JPG: "🖼️",
    JPEG: "🖼️",
    PNG: "🖼️",
    GIF: "🖼️",
    TXT: "📃",
    CSV: "📋",
  };

  // Show notification helper
  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

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
          category: categories[0] || "Administrative",
          department: user?.department || "Administration",
          author: user?.name || "Unknown",
          keywords: [],
          language: "English",
          isPublic: false,
          status: "published",
          tags: [],
          priority: "normal",
          expirationDate: "",
          accessLevel: "internal",
          relatedDocuments: [],
          version: "1.0",
          changeLog: "Initial upload",
        },
        preview: null,
        error: null,
        expanded: false, // For showing/hiding detailed form
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
    [user, categories]
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

  // Toggle file expanded state
  const toggleFileExpanded = (fileId) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, expanded: !f.expanded } : f))
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

  // Add tag to file
  const addTag = (fileId, tag) => {
    if (!tag.trim()) return;

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              metadata: {
                ...f.metadata,
                tags: [...(f.metadata.tags || []), tag.trim()],
              },
            }
          : f
      )
    );
  };

  // Remove tag from file
  const removeTag = (fileId, tagIndex) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              metadata: {
                ...f.metadata,
                tags: f.metadata.tags.filter((_, index) => index !== tagIndex),
              },
            }
          : f
      )
    );
  };

  // Upload single file using DocumentContext
  const uploadSingleFile = async (fileItem) => {
    try {
      // Update file status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: "uploading", progress: 0 } : f
        )
      );

      // Create FormData
      const formData = new FormData();
      formData.append("file", fileItem.file);
      formData.append("title", fileItem.metadata.title);
      formData.append("description", fileItem.metadata.description);
      formData.append("category", fileItem.metadata.category);
      formData.append("department", fileItem.metadata.department);
      formData.append("author", fileItem.metadata.author);
      formData.append("language", fileItem.metadata.language);
      formData.append("isPublic", fileItem.metadata.isPublic);
      formData.append("status", fileItem.metadata.status);
      formData.append("priority", fileItem.metadata.priority);
      formData.append("accessLevel", fileItem.metadata.accessLevel);
      formData.append("version", fileItem.metadata.version);
      formData.append("changeLog", fileItem.metadata.changeLog);

      // Add expiration date if provided
      if (fileItem.metadata.expirationDate) {
        formData.append("expirationDate", fileItem.metadata.expirationDate);
      }

      // Add keywords as JSON string
      if (fileItem.metadata.keywords.length > 0) {
        formData.append("keywords", JSON.stringify(fileItem.metadata.keywords));
      }

      // Add tags as JSON string
      if (fileItem.metadata.tags.length > 0) {
        formData.append("tags", JSON.stringify(fileItem.metadata.tags));
      }

      // Add related documents if any
      if (fileItem.metadata.relatedDocuments.length > 0) {
        formData.append(
          "relatedDocuments",
          JSON.stringify(fileItem.metadata.relatedDocuments)
        );
      }

      // Upload using DocumentContext
      const uploadedDocument = await uploadDocument(formData);

      // Update file status to completed
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? { ...f, status: "completed", progress: 100, uploadedDocument }
            : f
        )
      );

      return uploadedDocument;
    } catch (error) {
      // Update file status to error
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? { ...f, status: "error", error: error.message, progress: 0 }
            : f
        )
      );
      throw error;
    }
  };

  // Upload all pending files
  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    clearError(); // Clear any previous errors

    try {
      let successCount = 0;
      let errorCount = 0;

      // Upload files sequentially to avoid overwhelming the server
      for (const fileItem of pendingFiles) {
        try {
          await uploadSingleFile(fileItem);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to upload ${fileItem.name}:`, error);
        }
      }

      // Show results notification
      if (successCount > 0) {
        showNotification(
          `Successfully uploaded ${successCount} document${
            successCount !== 1 ? "s" : ""
          }`,
          "success"
        );
      }

      if (errorCount > 0) {
        showNotification(
          `Failed to upload ${errorCount} document${
            errorCount !== 1 ? "s" : ""
          }`,
          "error"
        );
      }

      // Auto-clear completed files after delay
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.status !== "completed"));
      }, 3000);
    } catch (error) {
      showNotification("Upload process failed. Please try again.", "error");
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
      case "metadata":
        setShowBulkEdit(true);
        break;
      default:
        break;
    }
  };

  // Apply bulk metadata update
  const applyBulkMetadata = (metadata) => {
    selectedFiles.forEach((fileId) => {
      updateFileMetadata(fileId, metadata);
    });
    setShowBulkEdit(false);
    clearSelection();
    showNotification(
      `Updated metadata for ${selectedFiles.length} files`,
      "success"
    );
  };

  const pendingFiles = files.filter((f) => f.status === "pending");
  const uploadingFiles = files.filter((f) => f.status === "uploading");
  const completedFiles = files.filter((f) => f.status === "completed");
  const errorFiles = files.filter((f) => f.status === "error");

  // Enhanced File Preview Component
  const EnhancedFilePreview = ({ fileItem, index }) => {
    const [keywordInput, setKeywordInput] = useState("");
    const [tagInput, setTagInput] = useState("");

    const handleKeywordAdd = (e) => {
      e.preventDefault();
      if (keywordInput.trim()) {
        addKeyword(fileItem.id, keywordInput);
        setKeywordInput("");
      }
    };

    const handleTagAdd = (e) => {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(fileItem.id, tagInput);
        setTagInput("");
      }
    };

    return (
      <div
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* File Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getFileIcon(fileItem.name)}</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 truncate">
                {fileItem.name}
              </h3>
              <p className="text-sm text-gray-500">
                {formatFileSize(fileItem.size)} •{" "}
                {getFileExtension(fileItem.name)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Status indicator */}
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                fileItem.status === "pending"
                  ? "bg-amber-100 text-amber-700"
                  : fileItem.status === "uploading"
                  ? "bg-blue-100 text-blue-700"
                  : fileItem.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {fileItem.status}
            </div>
            <button
              onClick={() => toggleFileExpanded(fileItem.id)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              {fileItem.expanded ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => removeFile(fileItem.id)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar for uploading files */}
        {fileItem.status === "uploading" && (
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${uploadProgress || fileItem.progress || 0}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Error display */}
        {fileItem.status === "error" && fileItem.error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {fileItem.error}
          </div>
        )}

        {/* Basic metadata form */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              value={fileItem.metadata.title}
              onChange={(e) =>
                updateFileMetadata(fileItem.id, { title: e.target.value })
              }
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              placeholder="Enter document title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={fileItem.metadata.description}
              onChange={(e) =>
                updateFileMetadata(fileItem.id, { description: e.target.value })
              }
              rows={2}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              placeholder="Brief description of the document"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={fileItem.metadata.category}
                onChange={(e) =>
                  updateFileMetadata(fileItem.id, { category: e.target.value })
                }
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                value={fileItem.metadata.department}
                onChange={(e) =>
                  updateFileMetadata(fileItem.id, {
                    department: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expanded metadata form */}
          {fileItem.expanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={fileItem.metadata.language}
                    onChange={(e) =>
                      updateFileMetadata(fileItem.id, {
                        language: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={fileItem.metadata.status}
                    onChange={(e) =>
                      updateFileMetadata(fileItem.id, {
                        status: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={fileItem.metadata.priority}
                    onChange={(e) =>
                      updateFileMetadata(fileItem.id, {
                        priority: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Level
                  </label>
                  <select
                    value={fileItem.metadata.accessLevel}
                    onChange={(e) =>
                      updateFileMetadata(fileItem.id, {
                        accessLevel: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="restricted">Restricted</option>
                    <option value="confidential">Confidential</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={fileItem.metadata.version}
                    onChange={(e) =>
                      updateFileMetadata(fileItem.id, {
                        version: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="e.g., 1.0, 2.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={fileItem.metadata.expirationDate}
                    onChange={(e) =>
                      updateFileMetadata(fileItem.id, {
                        expirationDate: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change Log
                </label>
                <textarea
                  value={fileItem.metadata.changeLog}
                  onChange={(e) =>
                    updateFileMetadata(fileItem.id, {
                      changeLog: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="What changed in this version?"
                />
              </div>

              {/* Keywords section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <form
                  onSubmit={handleKeywordAdd}
                  className="flex space-x-2 mb-2"
                >
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="Add keyword"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex flex-wrap gap-1">
                  {fileItem.metadata.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(fileItem.id, index)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <form onSubmit={handleTagAdd} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="Add tag"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex flex-wrap gap-1">
                  {fileItem.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(fileItem.id, index)}
                        className="ml-1 text-green-500 hover:text-green-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Public/Private toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`public-${fileItem.id}`}
                  checked={fileItem.metadata.isPublic}
                  onChange={(e) =>
                    updateFileMetadata(fileItem.id, {
                      isPublic: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`public-${fileItem.id}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  Make this document publicly accessible
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            notification.type === "success"
              ? "bg-green-100 border border-green-200 text-green-800"
              : notification.type === "error"
              ? "bg-red-100 border border-red-200 text-red-800"
              : "bg-blue-100 border border-blue-200 text-blue-800"
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Upload Error</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

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
                disabled={isUploading || uploadingFiles.length > 0}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {isUploading || uploadingFiles.length > 0 ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <span>
                  {isUploading || uploadingFiles.length > 0
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
        disabled={isUploading || uploadingFiles.length > 0}
      />

      {/* Upload Progress Overview */}
      {uploadingFiles.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Upload Progress
          </h3>
          <div className="space-y-4">
            {uploadingFiles.map((file) => (
              <div key={file.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {file.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {uploadProgress || file.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${uploadProgress || file.progress || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="card">
          {/* File List Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Documents ({files.length})
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

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const allExpanded = files.every((f) => f.expanded);
                    setFiles((prev) =>
                      prev.map((f) => ({ ...f, expanded: !allExpanded }))
                    );
                  }}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  {files.every((f) => f.expanded)
                    ? "Collapse All"
                    : "Expand All"}
                </button>
              </div>
            </div>
          </div>

          {/* File List Content */}
          <div className="p-6 space-y-4">
            {files.map((fileItem, index) => (
              <EnhancedFilePreview
                key={fileItem.id}
                fileItem={fileItem}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Bulk Edit Modal */}
      {showBulkEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Bulk Edit Metadata ({selectedFiles.length} files)
              </h3>
              <button
                onClick={() => setShowBulkEdit(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const metadata = {
                  category: formData.get("category"),
                  department: formData.get("department"),
                  language: formData.get("language"),
                  status: formData.get("status"),
                  priority: formData.get("priority"),
                  accessLevel: formData.get("accessLevel"),
                  isPublic: formData.get("isPublic") === "on",
                };
                // Remove empty values
                Object.keys(metadata).forEach((key) => {
                  if (metadata[key] === "" || metadata[key] === null) {
                    delete metadata[key];
                  }
                });
                applyBulkMetadata(metadata);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    <option value="">Keep current</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    <option value="">Keep current</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    name="language"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    <option value="">Keep current</option>
                    {languageOptions.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    <option value="">Keep current</option>
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    <option value="">Keep current</option>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Level
                  </label>
                  <select
                    name="accessLevel"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    <option value="">Keep current</option>
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="restricted">Restricted</option>
                    <option value="confidential">Confidential</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  id="bulk-public"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="bulk-public"
                  className="ml-2 text-sm text-gray-700"
                >
                  Make all selected documents publicly accessible
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Apply Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkEdit(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Guidelines & Document Fields
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Supported File Types
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(fileTypeIcons).map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                >
                  {type}
                </span>
              ))}
            </div>

            <h4 className="font-medium text-gray-800 mb-2">Required Fields</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Document Title</li>
              <li>• Category</li>
              <li>• Department</li>
              <li>• File upload</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">Optional Fields</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Description</li>
              <li>• Keywords & Tags</li>
              <li>• Language (default: English)</li>
              <li>• Status (default: Published)</li>
              <li>• Priority (default: Normal)</li>
              <li>• Access Level (default: Internal)</li>
              <li>• Version Number</li>
              <li>• Expiration Date</li>
              <li>• Change Log</li>
              <li>• Public Access Toggle</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-medium text-gray-800 mb-2">
              File Requirements
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Maximum file size: 10 MB</li>
              <li>• Use descriptive filenames</li>
              <li>• Add relevant keywords and tags for better searchability</li>
              <li>• Select appropriate category and department</li>
              <li>• Provide meaningful descriptions for important documents</li>
              <li>• Use version numbers for document revisions</li>
              <li>• Set appropriate access levels for sensitive documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
