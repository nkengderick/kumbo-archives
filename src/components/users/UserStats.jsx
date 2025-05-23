import React from "react";
import {
  Users,
  UserCheck,
  Shield,
  FileText,
  User,
  TrendingUp,
} from "lucide-react";

const UserStats = ({ stats }) => {
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    percentage,
    description,
  }) => (
    <div className="card p-6 transform transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {percentage && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                {percentage}%
              </span>
              <span className="text-xs text-gray-500">of total</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${
            color === "blue"
              ? "from-blue-100 to-blue-200"
              : color === "green"
              ? "from-green-100 to-green-200"
              : color === "red"
              ? "from-red-100 to-red-200"
              : color === "purple"
              ? "from-purple-100 to-purple-200"
              : "from-amber-100 to-amber-200"
          } rounded-xl flex items-center justify-center shadow-sm`}
        >
          <Icon
            className={`w-6 h-6 ${
              color === "blue"
                ? "text-blue-600"
                : color === "green"
                ? "text-green-600"
                : color === "red"
                ? "text-red-600"
                : color === "purple"
                ? "text-purple-600"
                : "text-amber-600"
            }`}
          />
        </div>
      </div>
    </div>
  );

  const activePercentage =
    stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Total Users"
        value={stats.total}
        icon={Users}
        color="blue"
        description="All registered users"
      />

      <StatCard
        title="Active Users"
        value={stats.active}
        icon={UserCheck}
        color="green"
        percentage={activePercentage}
        description="Currently active"
      />

      <StatCard
        title="Administrators"
        value={stats.admins}
        icon={Shield}
        color="red"
        percentage={
          stats.total > 0 ? Math.round((stats.admins / stats.total) * 100) : 0
        }
        description="Full system access"
      />

      <StatCard
        title="Staff Members"
        value={stats.staff}
        icon={FileText}
        color="purple"
        percentage={
          stats.total > 0 ? Math.round((stats.staff / stats.total) * 100) : 0
        }
        description="Document management"
      />

      <StatCard
        title="Researchers"
        value={stats.researchers}
        icon={User}
        color="amber"
        percentage={
          stats.total > 0
            ? Math.round((stats.researchers / stats.total) * 100)
            : 0
        }
        description="Read-only access"
      />
    </div>
  );
};

export default UserStats;
