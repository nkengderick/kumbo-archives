/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import {
  X,
  Edit,
  Check,
  AlertCircle,
  Tag,
  User,
  Building,
  Globe,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Calendar,
  FileText,
  Image,
  RefreshCw,
} from "lucide-react";

const FilePreview = ({
  file,
  viewMode,
  isSelected,
  onSelect,
  onRemove,
  onUpdateMetadata,
  onAddKeyword,
  onRemoveKeyword,
  categories,
  departments,
  getFileIcon,
  formatFileSize,
  style,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMetadata, setEditedMetadata] = useState(file.metadata);
  const [newKeyword, setNewKeyword] = useState("");
  const keywordInputRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "uploading":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-amber-600 bg-amber-50 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "uploading":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleSaveMetadata = () => {
    onUpdateMetadata(editedMetadata);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedMetadata(file.metadata);
    setIsEditing(false);
  };

  const handleMetadataChange = (field, value) => {
    setEditedMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      onAddKeyword(newKeyword.trim());
      setNewKeyword("");
    }
  };

  const handleKeywordKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddKeyword();
    }
  };

  // Grid view component
  if (viewMode === "grid") {
    return (
      <div
        className="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md animate-slide-up"
        style={style}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="rounded border-gray-300 text-kumbo-green-600 focus:ring-kumbo-green-500"
            />

            {/* File preview/icon */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-2xl">{getFileIcon(file.name)}</span>
              )}

              {/* Status indicator */}
              <div
                className={`absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                  file.status === "completed"
                    ? "bg-green-500"
                    : file.status === "uploading"
                    ? "bg-blue-500"
                    : file.status === "error"
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
              ></div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit metadata"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onRemove}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File info */}
        <div className="space-y-3">
          {isEditing ? (
            // Edit mode
            <div className="space-y-3">
              <input
                type="text"
                value={editedMetadata.title}
                onChange={(e) => handleMetadataChange("title", e.target.value)}
                className="w-full text-sm font-medium px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
                placeholder="Document title"
              />

              <textarea
                value={editedMetadata.description}
                onChange={(e) =>
                  handleMetadataChange("description", e.target.value)
                }
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
                rows="2"
                placeholder="Description"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editedMetadata.category}
                  onChange={(e) =>
                    handleMetadataChange("category", e.target.value)
                  }
                  className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={editedMetadata.department}
                  onChange={(e) =>
                    handleMetadataChange("department", e.target.value)
                  }
                  className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={editedMetadata.isPublic}
                    onChange={(e) =>
                      handleMetadataChange("isPublic", e.target.checked)
                    }
                    className="rounded border-gray-300 text-kumbo-green-600 focus:ring-kumbo-green-500"
                  />
                  <span>Public access</span>
                </label>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMetadata}
                    className="px-3 py-1 bg-kumbo-green-600 text-white text-sm rounded-lg hover:bg-kumbo-green-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // View mode
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800 line-clamp-2">
                {file.metadata.title}
              </h3>
              {file.metadata.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {file.metadata.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-1 rounded-full font-medium ${
                    file.metadata.category === "Financial"
                      ? "bg-blue-100 text-blue-700"
                      : file.metadata.category === "Legal"
                      ? "bg-red-100 text-red-700"
                      : file.metadata.category === "Cultural"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {file.metadata.category}
                </span>
                <span className="text-gray-500">
                  {formatFileSize(file.size)}
                </span>
              </div>
            </div>
          )}

          {/* Keywords */}
          <div>
            <div className="flex flex-wrap gap-1 mb-2">
              {file.metadata.keywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md group hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                  onClick={() => onRemoveKeyword(index)}
                  title="Click to remove"
                >
                  {keyword}
                  <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center space-x-2">
                <input
                  ref={keywordInputRef}
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                  className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
                  placeholder="Add keyword"
                />
                <button
                  onClick={handleAddKeyword}
                  className="p-1 text-kumbo-green-600 hover:text-kumbo-green-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Status and progress */}
          <div className="space-y-2">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(
                file.status
              )}`}
            >
              {getStatusIcon(file.status)}
              <span className="text-sm font-medium capitalize">
                {file.status}
              </span>
              {file.status === "uploading" && (
                <span className="text-sm">{Math.round(file.progress)}%</span>
              )}
            </div>

            {file.status === "uploading" && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
            )}

            {file.error && <p className="text-xs text-red-600">{file.error}</p>}
          </div>
        </div>
      </div>
    );
  }

  // List view component
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-md animate-slide-up"
      style={style}
    >
      <div className="flex items-center space-x-4">
        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded border-gray-300 text-kumbo-green-600 focus:ring-kumbo-green-500"
        />

        {/* File icon/preview */}
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-xl">{getFileIcon(file.name)}</span>
          )}
        </div>

        {/* File information */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={editedMetadata.title}
                onChange={(e) => handleMetadataChange("title", e.target.value)}
                className="text-sm font-medium px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
                placeholder="Document title"
              />

              <select
                value={editedMetadata.category}
                onChange={(e) =>
                  handleMetadataChange("category", e.target.value)
                }
                className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={editedMetadata.department}
                onChange={(e) =>
                  handleMetadataChange("department", e.target.value)
                }
                className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMetadata}
                  className="px-3 py-2 bg-kumbo-green-600 text-white text-sm rounded-lg hover:bg-kumbo-green-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">
                  {file.metadata.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      file.metadata.category === "Financial"
                        ? "bg-blue-100 text-blue-700"
                        : file.metadata.category === "Legal"
                        ? "bg-red-100 text-red-700"
                        : file.metadata.category === "Cultural"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {file.metadata.category}
                  </span>
                  <span>{file.metadata.department}</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${getStatusColor(
              file.status
            )}`}
          >
            {getStatusIcon(file.status)}
            <span className="text-sm font-medium capitalize">
              {file.status}
            </span>
            {file.status === "uploading" && (
              <span className="text-sm">{Math.round(file.progress)}%</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit metadata"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onRemove}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload progress bar for list view */}
      {file.status === "uploading" && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${file.progress}%` }}
          ></div>
        </div>
      )}

      {/* Error message */}
      {file.error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {file.error}
        </div>
      )}
    </div>
  );
};

export default FilePreview;
