import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Upload,
  Users,
  Database,
  Search,
  BarChart3,
  ChevronRight,
  TrendingUp,
  Star,
  Eye,
  Download,
  Calendar,
  Archive,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDocuments } from "../context/DocumentContext";
import { useAnalytics } from "../context/AnalyticsContext";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { getPopularDocuments, getRecentDocuments } = useDocuments();
  const {
    dashboardData,
    isLoading,
    error,
    fetchDashboardAnalytics,
    isDashboardStale,
    clearError,
    formatTimeAgo,
  } = useAnalytics();

  const [recentDocuments, setRecentDocuments] = useState([]);
  const [popularDocuments, setPopularDocuments] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch analytics data
        await fetchDashboardAnalytics();

        // Fetch documents data
        const [recent, popular] = await Promise.all([
          getRecentDocuments(5),
          getPopularDocuments(3),
        ]);

        setRecentDocuments(recent);
        setPopularDocuments(popular);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadDashboardData();
  }, [fetchDashboardAnalytics, getRecentDocuments, getPopularDocuments]);

  // Auto-refresh stale data
  useEffect(() => {
    if (isDashboardStale()) {
      fetchDashboardAnalytics();
    }
  }, [isDashboardStale, fetchDashboardAnalytics]);

  const handleRefresh = async () => {
    await fetchDashboardAnalytics(true);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    change,
    description,
    loading = false,
  }) => (
    <div className="card p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          )}
          {change && !loading && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span
                className={`text-sm font-medium ${
                  color === "green" ? "text-green-600" : "text-blue-600"
                }`}
              >
                {change}
              </span>
              <span className="text-xs text-gray-500">from last month</span>
            </div>
          )}
          {description && !loading && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
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
              : "from-amber-100 to-amber-200"
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
                : "text-amber-600"
            }`}
          />
        </div>
      </div>
    </div>
  );

  const DocumentCard = ({ document, showStats = false }) => (
    <div
      className="card p-4 group cursor-pointer"
      onClick={() => navigate(`/documents/${document._id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-kumbo-green-600 transition-colors">
            {document.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {document.description}
          </p>
        </div>
        <div className="ml-3 flex-shrink-0">
          <Star
            className={`w-4 h-4 ${
              document.isStarred
                ? "text-amber-500 fill-current"
                : "text-gray-300"
            }`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span
          className={`px-2 py-1 rounded-full font-medium ${
            document.category === "Financial"
              ? "bg-blue-100 text-blue-700"
              : document.category === "Legal"
              ? "bg-red-100 text-red-700"
              : document.category === "Cultural"
              ? "bg-purple-100 text-purple-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {document.category}
        </span>
        <span className="text-gray-500">{document.fileSizeFormatted}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{new Date(document.createdAt).toLocaleDateString()}</span>
        </div>

        {showStats && (
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{document.analytics?.viewCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{document.analytics?.downloadCount || 0}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const QuickActionCard = ({
    title,
    description,
    icon: Icon,
    color,
    onClick,
    disabled = false,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`card p-6 text-left transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } bg-gradient-to-br ${
        color === "green"
          ? "from-kumbo-green-600 to-kumbo-green-700 text-white"
          : color === "amber"
          ? "from-kumbo-gold-500 to-kumbo-gold-600 text-white"
          : color === "purple"
          ? "from-purple-600 to-purple-700 text-white"
          : "from-blue-600 to-blue-700 text-white"
      }`}
    >
      <Icon className="w-8 h-8 mb-3 opacity-90" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Archive className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-red-800 font-medium">
                Failed to load dashboard data
              </p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-kumbo-green-600 to-kumbo-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-kumbo-green-100 mb-4">
              Here's what's happening with your digital archives today.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>
                  Role:{" "}
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Archive className="w-4 h-4" />
                <span>{dashboardData.totalDocuments} documents in archive</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
              title="Refresh dashboard"
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Archive className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value={dashboardData.totalDocuments?.toLocaleString() || "0"}
          icon={FileText}
          color="blue"
          change="+12%"
          description="All archived documents"
          loading={isLoading}
        />

        <StatCard
          title="This Month"
          value={dashboardData.monthlyUploads || 0}
          icon={Upload}
          color="green"
          change="+8%"
          description="New uploads"
          loading={isLoading}
        />

        <StatCard
          title="Active Users"
          value={dashboardData.activeUsers || 0}
          icon={Users}
          color="purple"
          change="+3%"
          description="System users"
          loading={isLoading}
        />

        <StatCard
          title="Storage Used"
          value={dashboardData.storageUsed || "0 GB"}
          icon={Database}
          color="amber"
          change="+15%"
          description={`${
            dashboardData.storagePercentage || 0
          }% of total capacity`}
          loading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-gray-800">
                  Recent Documents
                </h2>
                <p className="text-sm text-gray-600">
                  Latest additions to your archive
                </p>
              </div>
              <button
                onClick={() => navigate("/search")}
                className="flex items-center space-x-2 text-kumbo-green-600 hover:text-kumbo-green-700 transition-colors"
              >
                <span className="text-sm font-medium">View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc, index) => (
                  <div
                    key={doc._id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <DocumentCard document={doc} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Archive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent documents found</p>
                  {hasPermission("upload") && (
                    <button
                      onClick={() => navigate("/upload")}
                      className="mt-2 text-kumbo-green-600 hover:text-kumbo-green-700 font-medium"
                    >
                      Upload your first document
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Popular Documents */}
          <div className="card p-6">
            <h3 className="text-lg font-heading font-bold text-gray-800 mb-4">
              Most Viewed
            </h3>
            <div className="space-y-3">
              {popularDocuments.length > 0 ? (
                popularDocuments.map((doc, index) => (
                  <div
                    key={doc._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/documents/${doc._id}`)}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-amber-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm line-clamp-1">
                        {doc.title}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>{doc.analytics?.viewCount || 0} views</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No popular documents yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Storage Overview */}
          <div className="card p-6">
            <h3 className="text-lg font-heading font-bold text-gray-800 mb-4">
              Storage Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Used Storage</span>
                  <span className="font-medium text-gray-800">
                    {dashboardData.storageUsed} / {dashboardData.totalStorage}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-kumbo-green-500 to-kumbo-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${dashboardData.storagePercentage || 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {100 - (dashboardData.storagePercentage || 0)}% available
                  space remaining
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  By Category
                </h4>
                <div className="space-y-2">
                  {dashboardData.popularCategories
                    ?.slice(0, 3)
                    .map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600">{category.name}</span>
                        <span className="font-medium text-gray-800">
                          {category.percentage}%
                        </span>
                      </div>
                    )) || (
                    <div className="text-center py-2 text-gray-500">
                      <p className="text-xs">No category data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-heading font-bold text-gray-800 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Upload Document"
            description="Add new documents to the archive"
            icon={Upload}
            color="green"
            onClick={() => navigate("/upload")}
            disabled={!hasPermission("upload")}
          />

          <QuickActionCard
            title="Search Archives"
            description="Find documents quickly and easily"
            icon={Search}
            color="amber"
            onClick={() => navigate("/search")}
          />

          <QuickActionCard
            title="View Reports"
            description="Analyze usage and statistics"
            icon={BarChart3}
            color="purple"
            onClick={() => navigate("/reports")}
            disabled={!hasPermission("read")}
          />
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-gray-800">
            Recent Activity
          </h2>
          <button
            onClick={() => navigate("/analytics/activity")}
            className="text-sm text-kumbo-green-600 hover:text-kumbo-green-700 font-medium"
          >
            View All Activity
          </button>
        </div>

        <div className="space-y-4">
          {dashboardData.activities?.length > 0 ? (
            dashboardData.activities.slice(0, 5).map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "upload"
                      ? "bg-green-100 text-green-600"
                      : activity.type === "view"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "user"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {activity.type === "upload" ? (
                    <Upload className="w-5 h-5" />
                  ) : activity.type === "view" ? (
                    <Eye className="w-5 h-5" />
                  ) : activity.type === "user" ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.action}:{" "}
                    <span className="text-kumbo-green-600">
                      {activity.item}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    by {activity.user} •{" "}
                    {activity.timeFormatted || formatTimeAgo(activity.time)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">
                Start using the system to see activity here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium text-green-800">System Status</span>
          </div>
          <p className="text-green-600 mt-1">All systems operational</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Last Update</span>
          </div>
          <p className="text-blue-600 mt-1">
            {dashboardData.lastUpdated
              ? formatTimeAgo(dashboardData.lastUpdated)
              : "Never"}
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-800">API Connection</span>
          </div>
          <p className="text-purple-600 mt-1">Connected to backend</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
