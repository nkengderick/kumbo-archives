import React from "react";
import { Upload, Clock, CheckCircle, AlertCircle } from "lucide-react";

const UploadProgress = ({ files, progress }) => {
  const totalFiles = files.length;
  const completedFiles = files.filter((f) => f.status === "completed").length;
  const errorFiles = files.filter((f) => f.status === "error").length;

  // Calculate overall progress
  const overallProgress =
    totalFiles > 0
      ? files.reduce((sum, file) => sum + (progress[file.id] || 0), 0) /
        totalFiles
      : 0;

  // Calculate estimated time remaining
  const getEstimatedTime = () => {
    const averageProgress = overallProgress;
    if (averageProgress === 0) return "Calculating...";

    const remainingProgress = 100 - averageProgress;
    const estimatedSeconds = (remainingProgress / averageProgress) * 30; // Rough estimation

    if (estimatedSeconds < 60) {
      return `${Math.round(estimatedSeconds)}s remaining`;
    } else {
      return `${Math.round(estimatedSeconds / 60)}m remaining`;
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Upload in Progress
            </h3>
            <p className="text-sm text-gray-600">
              {completedFiles} of {totalFiles} files completed
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(overallProgress)}%
          </div>
          <div className="text-xs text-gray-500 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{getEstimatedTime()}</span>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Overall Progress
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${overallProgress}%` }}
          >
            {/* Animated progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Individual File Progress */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          File Upload Status
        </h4>

        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            {/* Status Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                file.status === "completed"
                  ? "bg-green-100"
                  : file.status === "error"
                  ? "bg-red-100"
                  : "bg-blue-100"
              }`}
            >
              {file.status === "completed" ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : file.status === "error" ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {file.metadata.title}
                </p>
                <span className="text-xs text-gray-500">
                  {progress[file.id]
                    ? `${Math.round(progress[file.id])}%`
                    : "0%"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    file.status === "completed"
                      ? "bg-green-500"
                      : file.status === "error"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${progress[file.id] || 0}%` }}
                ></div>
              </div>

              {/* File Details */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">
                  {file.metadata.category} •{" "}
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </span>
                <span
                  className={`text-xs font-medium ${
                    file.status === "completed"
                      ? "text-green-600"
                      : file.status === "error"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {file.status === "completed"
                    ? "Complete"
                    : file.status === "error"
                    ? "Failed"
                    : "Uploading..."}
                </span>
              </div>

              {/* Error Message */}
              {file.error && (
                <p className="text-xs text-red-600 mt-1">{file.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{totalFiles}</div>
            <div className="text-xs text-gray-600">Total Files</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {completedFiles}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">{errorFiles}</div>
            <div className="text-xs text-gray-600">Errors</div>
          </div>
        </div>
      </div>

      {/* Upload Speed Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-700">
            Upload speed: ~2.1 MB/s • Network: Excellent
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
