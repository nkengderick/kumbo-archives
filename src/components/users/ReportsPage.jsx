import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  FileText,
  Users,
  Activity,
  PieChart,
  LineChart,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useDocuments } from "../../context/DocumentContext";
import { useUsers } from "../../context/UserContext"; // Add this import
import { useAnalytics } from "../../context/AnalyticsContext";
import ChartCard from "../../components/reports/ChartCard";
import StatsOverview from "../../components/reports/StatsOverview";
import ActivityChart from "../../components/reports/ActivityChart";
import CategoryChart from "../../components/reports/CategoryChart";

const ReportsPage = () => {
  const { documents } = useDocuments();
  const { users, userStats, fetchUsers, fetchUserStats } = useUsers(); // Use UserContext
  const {
    dashboardData,
    detailedAnalytics,
    userAnalytics,
    isLoading,
    error,
    fetchDashboardAnalytics,
    fetchDetailedAnalytics,
    fetchUserAnalytics,
    refreshAllData,
    isDashboardStale,
    formatTimeAgo,
    lastUpdated,
  } = useAnalytics();

  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("overview");

  // Fetch analytics data on component mount and when date range changes
  useEffect(() => {
    const loadAnalytics = async () => {
      await fetchDashboardAnalytics();
      await fetchUsers(); // Fetch users from UserContext
      await fetchUserStats(); // Fetch user stats

      if (reportType === "usage") {
        await fetchDetailedAnalytics(dateRange);
      }
      if (reportType === "users") {
        await fetchUserAnalytics();
      }
    };

    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate dynamic statistics from analytics context and user context
  const stats = {
    totalDocuments: dashboardData.totalDocuments || documents.length,
    totalUsers: dashboardData.activeUsers || userStats.total || users.length,
    totalViews: documents.reduce(
      (sum, doc) => sum + (doc.analytics?.viewCount || doc.viewCount || 0),
      0
    ),
    totalDownloads: documents.reduce(
      (sum, doc) =>
        sum + (doc.analytics?.downloadCount || doc.downloadCount || 0),
      0
    ),
    storageUsed: dashboardData.storageUsed || "0 GB",
    storagePercentage: dashboardData.storagePercentage || 0,
    monthlyUploads: dashboardData.monthlyUploads || 0,
    activeUsers: userStats.active || users.filter((u) => u.isActive).length,
    adminUsers:
      userStats.admins || users.filter((u) => u.role === "admin").length,
    staffUsers:
      userStats.staff || users.filter((u) => u.role === "staff").length,
    researcherUsers:
      userStats.researchers ||
      users.filter((u) => u.role === "researcher").length,
  };

  // Get documents by category from analytics or fallback to local calculation
  const documentsByCategory =
    dashboardData.popularCategories.length > 0
      ? dashboardData.popularCategories.reduce((acc, cat) => {
          acc[cat.name] = cat.count;
          return acc;
        }, {})
      : documents.reduce((acc, doc) => {
          acc[doc.category] = (acc[doc.category] || 0) + 1;
          return acc;
        }, {});

  // Get activity data from analytics context
  const getActivityData = () => {
    if (
      dashboardData.monthlyActivity &&
      dashboardData.monthlyActivity.length > 0
    ) {
      return dashboardData.monthlyActivity.map((item) => ({
        ...item,
        period: dateRange === "year" ? `2024-${item.month}` : item.month,
      }));
    }

    // Fallback to sample data if no analytics data
    return [
      { month: "Jan", uploads: 12, downloads: 45, period: "Jan" },
      { month: "Feb", uploads: 19, downloads: 52, period: "Feb" },
      { month: "Mar", uploads: 15, downloads: 38, period: "Mar" },
      { month: "Apr", uploads: 22, downloads: 67, period: "Apr" },
      { month: "May", uploads: 18, downloads: 43, period: "May" },
      { month: "Jun", uploads: 25, downloads: 71, period: "Jun" },
    ];
  };

  const exportReport = (type) => {
    // Enhanced report export with analytics data
    const reportData = {
      type,
      dateRange,
      generatedAt: new Date().toISOString(),
      stats,
      dashboardData,
      detailedAnalytics: reportType === "usage" ? detailedAnalytics : null,
      userAnalytics: reportType === "users" ? userAnalytics : null,
      userStats, // Include user stats from UserContext
      documents: documents.length,
      users: users.length,
      lastUpdated,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kumbo-archives-${type}-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    await refreshAllData();
    await fetchUsers();
    await fetchUserStats();
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your digital archives usage and
            performance
          </p>
          {lastUpdated.dashboard && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {formatTimeAgo(lastUpdated.dashboard)}
              {isDashboardStale() && (
                <span className="text-amber-600 ml-2">(Data may be stale)</span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh Analytics Data"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400"
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
            <option value="year">Past Year</option>
          </select>

          {/* Export Button */}
          <button
            onClick={() => exportReport("comprehensive")}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
            <p className="text-red-700 font-medium">Analytics Error</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Report Type Tabs */}
      <div className="card p-1">
        <div className="flex space-x-1">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "usage", label: "Usage Analytics", icon: Activity },
            { id: "documents", label: "Document Insights", icon: FileText },
            { id: "users", label: "User Activity", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                reportType === tab.id
                  ? "bg-kumbo-green-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-kumbo-green-600" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Main Content based on selected report type */}
      {reportType === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <ChartCard
            title="Upload & Download Activity"
            description="Document activity over time"
            icon={LineChart}
          >
            <ActivityChart data={getActivityData()} />
          </ChartCard>

          {/* Category Distribution */}
          <ChartCard
            title="Documents by Category"
            description="Distribution of documents across categories"
            icon={PieChart}
          >
            <CategoryChart data={documentsByCategory} />
          </ChartCard>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Recent Activities"
              description="Latest system activities and user actions"
              icon={Activity}
            >
              <div className="space-y-3">
                {dashboardData.activities && dashboardData.activities.length > 0
                  ? dashboardData.activities
                      .slice(0, 5)
                      .map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-kumbo-green-100 rounded-full flex items-center justify-center">
                              <Activity className="w-4 h-4 text-kumbo-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {activity.action || activity.type}
                              </p>
                              <p className="text-sm text-gray-600">
                                {activity.user} •{" "}
                                {activity.description || activity.details}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(
                              activity.timestamp || activity.createdAt
                            )}
                          </span>
                        </div>
                      ))
                  : // Fallback to document-based popular items
                    documents
                      .sort(
                        (a, b) =>
                          (b.analytics?.viewCount || b.viewCount || 0) -
                          (a.analytics?.viewCount || a.viewCount || 0)
                      )
                      .slice(0, 5)
                      .map((doc, index) => (
                        <div
                          key={doc._id || doc.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                  ? "bg-gray-400"
                                  : index === 2
                                  ? "bg-amber-600"
                                  : "bg-gray-300"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {doc.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {doc.category} •{" "}
                                {doc.authorName ||
                                  doc.author?.name ||
                                  "Unknown"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              {doc.analytics?.viewCount || doc.viewCount || 0}{" "}
                              views
                            </p>
                            <p className="text-sm text-gray-600">
                              {doc.analytics?.downloadCount ||
                                doc.downloadCount ||
                                0}{" "}
                              downloads
                            </p>
                          </div>
                        </div>
                      ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {reportType === "usage" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <ChartCard
              title="Document Trends"
              description="Document creation and usage trends"
              icon={TrendingUp}
            >
              <div className="space-y-4">
                {detailedAnalytics.documentTrends &&
                detailedAnalytics.documentTrends.length > 0 ? (
                  detailedAnalytics.documentTrends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {trend.period}
                        </p>
                        <p className="text-sm text-gray-600">
                          {trend.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {trend.count}
                        </p>
                        <p className="text-sm text-green-600">
                          +{trend.growth}%
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Document trends data loading...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ChartCard>

            <ChartCard
              title="File Type Distribution"
              description="Popular file formats in the system"
              icon={FileText}
            >
              <div className="space-y-3">
                {detailedAnalytics.fileTypeDistribution &&
                detailedAnalytics.fileTypeDistribution.length > 0
                  ? detailedAnalytics.fileTypeDistribution.map(
                      (type, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded ${
                                index === 0
                                  ? "bg-red-500"
                                  : index === 1
                                  ? "bg-blue-500"
                                  : index === 2
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                              }`}
                            ></div>
                            <span className="font-medium text-gray-800">
                              {type.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {type.count} files
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  index === 0
                                    ? "bg-red-500"
                                    : index === 1
                                    ? "bg-blue-500"
                                    : index === 2
                                    ? "bg-green-500"
                                    : "bg-purple-500"
                                }`}
                                style={{ width: `${type.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  : // Fallback data based on actual documents
                    documents.reduce((acc, doc) => {
                      const fileType =
                        doc.fileType ||
                        doc.mimeType?.split("/")[1]?.toUpperCase() ||
                        "Unknown";
                      acc[fileType] = (acc[fileType] || 0) + 1;
                      return acc;
                    }, Object.create(null)) &&
                    Object.entries(
                      documents.reduce((acc, doc) => {
                        const fileType =
                          doc.fileType ||
                          doc.mimeType?.split("/")[1]?.toUpperCase() ||
                          "Unknown";
                        acc[fileType] = (acc[fileType] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .slice(0, 4)
                      .map(([type, count], index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded ${
                                index === 0
                                  ? "bg-red-500"
                                  : index === 1
                                  ? "bg-blue-500"
                                  : index === 2
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                              }`}
                            ></div>
                            <span className="font-medium text-gray-800">
                              {type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {count} files
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  index === 0
                                    ? "bg-red-500"
                                    : index === 1
                                    ? "bg-blue-500"
                                    : index === 2
                                    ? "bg-green-500"
                                    : "bg-purple-500"
                                }`}
                                style={{
                                  width: `${(count / documents.length) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
              </div>
            </ChartCard>
          </div>

          {/* Side Metrics */}
          <div className="space-y-6">
            <ChartCard
              title="Top Contributors"
              description="Most active users"
              icon={Users}
            >
              <div className="space-y-3">
                {detailedAnalytics.topContributors &&
                detailedAnalytics.topContributors.length > 0
                  ? detailedAnalytics.topContributors.map(
                      (contributor, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-kumbo-green-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-kumbo-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {contributor.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {contributor.contributions} docs
                          </span>
                        </div>
                      )
                    )
                  : // Fallback based on actual document authors
                    documents.reduce((acc, doc) => {
                      const authorName =
                        doc.authorName || doc.author?.name || "Unknown";
                      acc[authorName] = (acc[authorName] || 0) + 1;
                      return acc;
                    }, Object.create(null)) &&
                    Object.entries(
                      documents.reduce((acc, doc) => {
                        const authorName =
                          doc.authorName || doc.author?.name || "Unknown";
                        acc[authorName] = (acc[authorName] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([name, count], index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-kumbo-green-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-kumbo-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {count} docs
                          </span>
                        </div>
                      ))}
              </div>
            </ChartCard>

            <ChartCard
              title="Department Activity"
              description="Activity by department"
              icon={BarChart3}
            >
              <div className="space-y-3">
                {userStats.departmentDistribution &&
                userStats.departmentDistribution.length > 0
                  ? userStats.departmentDistribution
                      .slice(0, 4)
                      .map((dept, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {dept._id}
                            </span>
                            <span className="text-sm text-gray-600">
                              {dept.count} users
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-kumbo-green-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  (dept.count / stats.totalUsers) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))
                  : // Fallback data based on users
                    users.reduce((acc, user) => {
                      const dept = user.department || "Unknown";
                      acc[dept] = (acc[dept] || 0) + 1;
                      return acc;
                    }, Object.create(null)) &&
                    Object.entries(
                      users.reduce((acc, user) => {
                        const dept = user.department || "Unknown";
                        acc[dept] = (acc[dept] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .slice(0, 4)
                      .map(([name, count], index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {name}
                            </span>
                            <span className="text-sm text-gray-600">
                              {count} users
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-kumbo-green-500 h-2 rounded-full"
                              style={{
                                width: `${(count / users.length) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {reportType === "documents" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Documents */}
          <ChartCard
            title="Most Popular Documents"
            description="Documents with highest engagement"
            icon={TrendingUp}
          >
            <div className="space-y-3">
              {detailedAnalytics.popularDocuments &&
              detailedAnalytics.popularDocuments.length > 0
                ? detailedAnalytics.popularDocuments.map((doc, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">
                          {doc.title}
                        </h4>
                        <span className="text-sm text-gray-600">
                          {doc.views} views
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {doc.category} • {doc.downloads} downloads
                      </p>
                    </div>
                  ))
                : documents
                    .sort(
                      (a, b) =>
                        (b.analytics?.viewCount || b.viewCount || 0) -
                        (a.analytics?.viewCount || a.viewCount || 0)
                    )
                    .slice(0, 5)
                    .map((doc, index) => (
                      <div
                        key={doc._id || index}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">
                            {doc.title}
                          </h4>
                          <span className="text-sm text-gray-600">
                            {doc.analytics?.viewCount || doc.viewCount || 0}{" "}
                            views
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {doc.category} •{" "}
                          {doc.analytics?.downloadCount ||
                            doc.downloadCount ||
                            0}{" "}
                          downloads
                        </p>
                      </div>
                    ))}
            </div>
          </ChartCard>

          {/* Document Growth */}
          <ChartCard
            title="Document Growth Over Time"
            description="Total documents added by month"
            icon={BarChart3}
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Document growth chart</p>
                <p className="text-sm text-gray-500">
                  Total: {stats.totalDocuments} documents
                </p>
              </div>
            </div>
          </ChartCard>

          {/* Storage Analysis */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Storage Analysis"
              description="Storage usage and distribution"
              icon={Activity}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Total Storage
                  </h4>
                  <p className="text-2xl font-bold text-kumbo-green-600 mb-1">
                    {stats.storageUsed}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-kumbo-green-500 h-2 rounded-full"
                      style={{ width: `${stats.storagePercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {stats.storagePercentage}% used
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Monthly Growth
                  </h4>
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    +{stats.monthlyUploads}
                  </p>
                  <p className="text-sm text-gray-600">Documents this month</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Average Size
                  </h4>
                  <p className="text-2xl font-bold text-purple-600 mb-1">
                    {stats.totalDocuments > 0
                      ? Math.round(
                          (parseFloat(stats.storageUsed) * 1000) /
                            stats.totalDocuments
                        )
                      : 0}{" "}
                    MB
                  </p>
                  <p className="text-sm text-gray-600">Per document</p>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {reportType === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Activity */}
          <div className="lg:col-span-2">
            <ChartCard
              title="User Activity Breakdown"
              description="Actions performed by users"
              icon={Users}
            >
              <div className="space-y-4">
                {users.slice(0, 6).map((user, index) => (
                  <div
                    key={user._id || index}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-kumbo-green-600 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            {user.role} • {user.department}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {user.documentsCreated ||
                            Math.floor(Math.random() * 50) + 10}
                        </p>
                        <p className="text-xs text-gray-600">
                          Documents Created
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {user.documentsAccessed ||
                            Math.floor(Math.random() * 20) + 5}
                        </p>
                        <p className="text-xs text-gray-600">
                          Documents Accessed
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {user.lastActivity
                            ? Math.floor(
                                (new Date() - new Date(user.lastActivity)) /
                                  (1000 * 60 * 60)
                              ) + "h"
                            : Math.floor(Math.random() * 10) + 1 + "h"}
                        </p>
                        <p className="text-xs text-gray-600">Last Active</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* User Stats */}
          <div className="space-y-6">
            <ChartCard
              title="Role Distribution"
              description="Users by role type"
              icon={Shield}
            >
              <div className="space-y-3">
                {userStats.roleDistribution &&
                userStats.roleDistribution.length > 0
                  ? userStats.roleDistribution.map((role, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded ${
                              index === 0
                                ? "bg-red-500"
                                : index === 1
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <span className="font-medium text-gray-800 capitalize">
                            {role._id}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {role.count} users
                        </span>
                      </div>
                    ))
                  : // Fallback role distribution
                    [
                      {
                        role: "Admin",
                        count: stats.adminUsers,
                        color: "bg-red-500",
                      },
                      {
                        role: "Staff",
                        count: stats.staffUsers,
                        color: "bg-blue-500",
                      },
                      {
                        role: "Researcher",
                        count: stats.researcherUsers,
                        color: "bg-green-500",
                      },
                    ].map((role, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded ${role.color}`}
                          ></div>
                          <span className="font-medium text-gray-800">
                            {role.role}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {role.count} users
                        </span>
                      </div>
                    ))}
              </div>
            </ChartCard>

            <ChartCard
              title="User Engagement"
              description="Activity levels"
              icon={Activity}
            >
              <div className="space-y-3">
                {[
                  {
                    frequency: "Daily",
                    count: Math.floor(stats.activeUsers * 0.4),
                    percentage: 40,
                  },
                  {
                    frequency: "Weekly",
                    count: Math.floor(stats.activeUsers * 0.3),
                    percentage: 30,
                  },
                  {
                    frequency: "Monthly",
                    count: Math.floor(stats.activeUsers * 0.2),
                    percentage: 20,
                  },
                  {
                    frequency: "Rarely",
                    count: Math.floor(stats.activeUsers * 0.1),
                    percentage: 10,
                  },
                ].map((freq, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {freq.frequency}
                      </span>
                      <span className="text-sm text-gray-600">
                        {freq.count} users
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-kumbo-green-500 h-2 rounded-full"
                        style={{ width: `${freq.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard
              title="Department Activity"
              description="Activity by department"
              icon={Users}
            >
              <div className="space-y-3">
                {userStats.departmentDistribution &&
                userStats.departmentDistribution.length > 0
                  ? userStats.departmentDistribution
                      .slice(0, 4)
                      .map((dept, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {dept._id}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {dept.count}
                            </span>
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${
                                    (dept.count / stats.totalUsers) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))
                  : // Fallback department data
                    users.reduce((acc, user) => {
                      const dept = user.department || "Unknown";
                      acc[dept] = (acc[dept] || 0) + 1;
                      return acc;
                    }, Object.create(null)) &&
                    Object.entries(
                      users.reduce((acc, user) => {
                        const dept = user.department || "Unknown";
                        acc[dept] = (acc[dept] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .slice(0, 4)
                      .map(([name, count], index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {count}
                            </span>
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${
                                    (count / (stats.totalUsers || 12)) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Quick Export Options */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Export Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              type: "summary",
              label: "Executive Summary",
              description: "High-level overview report",
            },
            {
              type: "detailed",
              label: "Detailed Analytics",
              description: "Complete data analysis",
            },
            {
              type: "usage",
              label: "Usage Report",
              description: "User activity and engagement",
            },
            {
              type: "storage",
              label: "Storage Report",
              description: "Storage usage and capacity",
            },
          ].map((export_option) => (
            <button
              key={export_option.type}
              onClick={() => exportReport(export_option.type)}
              className="p-4 text-left border border-gray-200 rounded-xl hover:border-kumbo-green-300 hover:bg-kumbo-green-50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800 group-hover:text-kumbo-green-700">
                  {export_option.label}
                </h4>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-kumbo-green-600" />
              </div>
              <p className="text-sm text-gray-600">
                {export_option.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Data Refresh Info */}
      {lastUpdated.dashboard && (
        <div className="card p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Analytics Data Status
                </p>
                <p className="text-xs text-gray-600">
                  Dashboard: {formatTimeAgo(lastUpdated.dashboard)}
                  {lastUpdated.detailed &&
                    ` • Detailed: ${formatTimeAgo(lastUpdated.detailed)}`}
                  {lastUpdated.users &&
                    ` • Users: ${formatTimeAgo(lastUpdated.users)}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Refresh All"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
