import React from "react";
import {
  Star,
  Eye,
  Download,
  Calendar,
  User,
  MoreVertical,
  Share2,
} from "lucide-react";

// File type icons mapping
const fileTypeIcons = {
  PDF: "📄",
  DOCX: "📝",
  XLSX: "📊",
  PPTX: "📋",
  JPG: "🖼️",
  PNG: "🖼️",
  MP4: "🎥",
  MP3: "🎵",
};

const DocumentCard = ({
  document,
  showStats = false,
  onView,
  onDownload,
  onStar,
}) => {
  const getCategoryColor = (category) => {
    const colors = {
      Financial: "bg-blue-100 text-blue-700 border-blue-200",
      Legal: "bg-red-100 text-red-700 border-red-200",
      Administrative: "bg-green-100 text-green-700 border-green-200",
      Cultural: "bg-purple-100 text-purple-700 border-purple-200",
      Infrastructure: "bg-orange-100 text-orange-700 border-orange-200",
      Education: "bg-indigo-100 text-indigo-700 border-indigo-200",
      Healthcare: "bg-pink-100 text-pink-700 border-pink-200",
      Heritage: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleView = () => {
    if (onView) onView(document);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (onDownload) onDownload(document);
  };

  const handleStar = (e) => {
    e.stopPropagation();
    if (onStar) onStar(document);
  };

  return (
    <div
      className="card p-4 group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
      onClick={handleView}
    >
      {/* Header with file type icon and star */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-kumbo-green-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">
              {fileTypeIcons[document.type] || "📄"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-kumbo-green-600 transition-colors text-sm">
              {document.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleStar}
            className={`p-1 rounded-full transition-all duration-200 ${
              document.isStarred
                ? "text-amber-500 hover:text-amber-600"
                : "text-gray-300 hover:text-amber-500"
            }`}
          >
            <Star
              className={`w-4 h-4 ${document.isStarred ? "fill-current" : ""}`}
            />
          </button>

          <button className="p-1 text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {document.description}
      </p>

      {/* Category and File Size */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
            document.category
          )}`}
        >
          {document.category}
        </span>
        <span className="text-xs text-gray-500 font-medium">
          {document.size}
        </span>
      </div>

      {/* Author and Date */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-1">
          <User className="w-3 h-3" />
          <span className="truncate">{document.author}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(document.date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats (if enabled) */}
      {showStats && (
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{document.viewCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{document.downloadCount || 0}</span>
            </div>
          </div>

          {document.keywords && document.keywords.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-400">
                {document.keywords.slice(0, 2).join(", ")}
                {document.keywords.length > 2 && "..."}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={handleView}
          className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-kumbo-green-600 text-white text-xs rounded-lg hover:bg-kumbo-green-700 transition-colors"
        >
          <Eye className="w-3 h-3" />
          <span>View</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download className="w-3 h-3" />
        </button>

        <button className="flex items-center justify-center p-2 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors">
          <Share2 className="w-3 h-3" />
        </button>
      </div>

      {/* Keywords tags (bottom) */}
      {document.keywords && document.keywords.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {document.keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {keyword}
              </span>
            ))}
            {document.keywords.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                +{document.keywords.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
