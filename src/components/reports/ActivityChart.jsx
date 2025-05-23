import React from "react";
import { Upload, Download } from "lucide-react";

const ActivityChart = ({ data }) => {
  // Find max value for scaling
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.uploads, item.downloads))
  );

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-kumbo-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Uploads</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Downloads</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48">
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center space-y-2"
            >
              {/* Bars */}
              <div className="flex items-end space-x-1 h-40 w-full justify-center">
                {/* Upload bar */}
                <div className="flex flex-col items-center">
                  <div
                    className="bg-kumbo-green-500 rounded-t-sm w-6 transition-all duration-500 hover:bg-kumbo-green-600 cursor-pointer relative group"
                    style={{ height: `${(item.uploads / maxValue) * 160}px` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {item.uploads} uploads
                    </div>
                  </div>
                </div>

                {/* Download bar */}
                <div className="flex flex-col items-center">
                  <div
                    className="bg-blue-500 rounded-t-sm w-6 transition-all duration-500 hover:bg-blue-600 cursor-pointer relative group"
                    style={{ height: `${(item.downloads / maxValue) * 160}px` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {item.downloads} downloads
                    </div>
                  </div>
                </div>
              </div>

              {/* Month label */}
              <span className="text-xs text-gray-600 font-medium">
                {item.month}
              </span>
            </div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-40 flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Upload className="w-4 h-4 text-kumbo-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Total Uploads
            </span>
          </div>
          <p className="text-xl font-bold text-kumbo-green-600">
            {data.reduce((sum, item) => sum + item.uploads, 0)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Download className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Total Downloads
            </span>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.downloads, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
