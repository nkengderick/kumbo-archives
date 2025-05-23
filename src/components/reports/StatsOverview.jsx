import React from "react";
import {
  FileText,
  Users,
  Eye,
  Download,
  Database,
  TrendingUp,
} from "lucide-react";

const StatsOverview = ({ stats }) => {
  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType,
    color,
  }) => (
    <div className="card p-6 transform transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className="flex items-center space-x-1">
              <TrendingUp
                className={`w-3 h-3 ${
                  changeType === "positive" ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${
            color === "blue"
              ? "from-blue-100 to-blue-200"
              : color === "green"
              ? "from-green-100 to-green-200"
              : color === "purple"
              ? "from-purple-100 to-purple-200"
              : color === "amber"
              ? "from-amber-100 to-amber-200"
              : "from-gray-100 to-gray-200"
          } rounded-xl flex items-center justify-center shadow-sm`}
        >
          <Icon
            className={`w-6 h-6 ${
              color === "blue"
                ? "text-blue-600"
                : color === "green"
                ? "text-green-600"
                : color === "purple"
                ? "text-purple-600"
                : color === "amber"
                ? "text-amber-600"
                : "text-gray-600"
            }`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Total Documents"
        value={stats.totalDocuments}
        icon={FileText}
        change="+12%"
        changeType="positive"
        color="blue"
      />

      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={Users}
        change="+3%"
        changeType="positive"
        color="green"
      />

      <StatCard
        title="Total Views"
        value={stats.totalViews}
        icon={Eye}
        change="+24%"
        changeType="positive"
        color="purple"
      />

      <StatCard
        title="Total Downloads"
        value={stats.totalDownloads}
        icon={Download}
        change="+18%"
        changeType="positive"
        color="amber"
      />

      <StatCard
        title="Storage Used"
        value={stats.storageUsed}
        icon={Database}
        change="+15%"
        changeType="positive"
        color="gray"
      />
    </div>
  );
};

export default StatsOverview;
