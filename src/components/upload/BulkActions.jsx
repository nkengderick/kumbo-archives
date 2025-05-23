import React, { useState } from "react";
import {
  CheckSquare,
  Square,
  Trash2,
  Tag,
  Building,
  Globe,
  X,
  ChevronDown,
  Edit,
} from "lucide-react";

const BulkActions = ({
  selectedCount,
  onAction,
  onSelectAll,
  onClearSelection,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleAction = (action) => {
    onAction(action);
    setShowActions(false);
    setShowCategoryModal(false);
  };

  const actions = [
    {
      id: "remove",
      label: "Remove Selected",
      icon: Trash2,
      color: "text-red-600 hover:bg-red-50",
      description: "Remove selected files from upload queue",
    },
    {
      id: "category",
      label: "Set Category",
      icon: Tag,
      color: "text-blue-600 hover:bg-blue-50",
      description: "Apply category to all selected files",
    },
    {
      id: "department",
      label: "Set Department",
      icon: Building,
      color: "text-purple-600 hover:bg-purple-50",
      description: "Apply department to all selected files",
    },
    {
      id: "visibility",
      label: "Set Visibility",
      icon: Globe,
      color: "text-green-600 hover:bg-green-50",
      description: "Set public/private access for selected files",
    },
  ];

  return (
    <div className="relative flex items-center space-x-3">
      {/* Selection Info */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        <CheckSquare className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">
          {selectedCount} file{selectedCount !== 1 ? "s" : ""} selected
        </span>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSelectAll}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          title="Select all files"
        >
          <Square className="w-4 h-4" />
          <span>All</span>
        </button>

        <button
          onClick={onClearSelection}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
          <span>Clear</span>
        </button>

        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="flex items-center space-x-2 px-4 py-2 bg-kumbo-green-600 text-white rounded-lg hover:bg-kumbo-green-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Actions</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Actions Dropdown Menu */}
          {showActions && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10 animate-slide-up">
              <div className="p-2">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      if (action.id === "category") {
                        setShowCategoryModal(true);
                      } else {
                        handleAction(action.id);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${action.color}`}
                  >
                    <action.icon className="w-4 h-4" />
                    <div className="text-left">
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs opacity-75">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Set Category for Selected Files
                </h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">
                  This will apply the selected category to all {selectedCount}{" "}
                  selected files.
                </p>

                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400">
                  <option value="">Select a category</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Financial">Financial</option>
                  <option value="Legal">Legal</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Heritage">Heritage</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleAction("category");
                    setShowCategoryModal(false);
                  }}
                  className="px-6 py-2 bg-kumbo-green-600 text-white rounded-lg hover:bg-kumbo-green-700 transition-colors"
                >
                  Apply Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default BulkActions;
