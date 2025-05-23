import React from "react";
import {
  Star,
  Eye,
  Download,
  Calendar,
  User,
  FileText,
  Share2,
  MoreVertical,
} from "lucide-react";
import { fileTypeIcons } from "../../data/mockData";

const DocumentList = ({ document, onView, onDownload, onStar }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Financial: "bg-blue-100 text-blue-700",
      Legal: "bg-red-100 text-red-700",
      Administrative: "bg-green-100 text-green-700",
      Cultural: "bg-purple-100 text-purple-700",
      Infrastructure: "bg-orange-100 text-orange-700",
      Education: "bg-indigo-100 text-indigo-700",
      Healthcare: "bg-pink-100 text-pink-700",
      Heritage: "bg-amber-100 text-amber-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
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
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleView}
    >
      <div className="flex items-center space-x-4">
        {/* File Type Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-kumbo-green-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">
              {fileTypeIcons[document.type] || "📄"}
            </span>
          </div>
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 group-hover:text-kumbo-green-600 transition-colors mb-1">
                {document.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                {document.description}
              </p>

              {/* Metadata Row */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{document.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(document.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>{document.size}</span>
                </div>
                {document.viewCount && (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{document.viewCount} views</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {/* Category Badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  document.category
                )}`}
              >
                {document.category}
              </span>

              {/* Star Button */}
              <button
                onClick={handleStar}
                className={`p-2 rounded-full transition-all duration-200 ${
                  document.isStarred
                    ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                    : "text-gray-300 hover:text-amber-500 hover:bg-amber-50"
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    document.isStarred ? "fill-current" : ""
                  }`}
                />
              </button>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button
                  onClick={handleView}
                  className="p-2 text-kumbo-green-600 hover:bg-kumbo-green-50 rounded-lg transition-colors"
                  title="View Document"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share Document"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="More Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Keywords */}
          {document.keywords && document.keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {document.keywords.slice(0, 4).map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{keyword}
                </span>
              ))}
              {document.keywords.length > 4 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                  +{document.keywords.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
