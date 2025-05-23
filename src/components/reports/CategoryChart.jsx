import React from "react";

const CategoryChart = ({ data }) => {
  // Convert object to array and sort by count
  const categories = Object.entries(data)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const total = categories.reduce((sum, cat) => sum + cat.count, 0);

  // Color palette for categories
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-amber-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-cyan-500",
  ];

  // Calculate angles for pie chart (simplified representation)
  let currentAngle = 0;
  const segments = categories.map((category, index) => {
    const percentage = (category.count / total) * 100;
    const angle = (category.count / total) * 360;
    const segment = {
      ...category,
      percentage,
      angle,
      startAngle: currentAngle,
      color: colors[index % colors.length],
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <div className="space-y-6">
      {/* Simplified Pie Chart Representation */}
      <div className="relative">
        <div className="w-48 h-48 mx-auto relative">
          {/* Center circle */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>

          {/* Segments represented as progress rings */}
          {segments.map((segment, index) => (
            <div
              key={segment.name}
              className="absolute inset-0 rounded-full"
              style={{
                transform: `rotate(${segment.startAngle}deg)`,
              }}
            >
              <div
                className={`absolute inset-0 rounded-full border-8 border-transparent ${segment.color.replace(
                  "bg-",
                  "border-"
                )} opacity-80`}
                style={{
                  clipPath: `conic-gradient(from 0deg, transparent 0deg, transparent ${segment.angle}deg, black ${segment.angle}deg)`,
                }}
              ></div>
            </div>
          ))}

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white rounded-full w-24 h-24 flex items-center justify-center border-4 border-gray-100">
              <div>
                <p className="text-lg font-bold text-gray-800">{total}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <div
            key={segment.name}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
              <span className="font-medium text-gray-800">{segment.name}</span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">{segment.count}</p>
              <p className="text-xs text-gray-600">
                {segment.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Most Popular</p>
            <p className="font-semibold text-gray-800">
              {segments[0]?.name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Categories</p>
            <p className="font-semibold text-gray-800">{segments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
