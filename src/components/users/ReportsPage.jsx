import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  FileText,
  Users,
  Activity,
  PieChart,
  LineChart,
  Shield,
} from "lucide-react";
import { useDocuments } from "../../context/DocumentContext";
import { mockStats } from "../../data/mockData";
import ChartCard from "../../components/reports/ChartCard";
import StatsOverview from "../../components/reports/StatsOverview";
import ActivityChart from "../../components/reports/ActivityChart";
import CategoryChart from "../../components/reports/CategoryChart";

const ReportsPage = () => {
  const { documents, users } = useDocuments();
  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("overview");

  // Calculate dynamic statistics
  const stats = {
    totalDocuments: documents.length,
    totalUsers: users.length,
    totalViews: documents.reduce((sum, doc) => sum + (doc.viewCount || 0), 0),
    totalDownloads: documents.reduce(
      (sum, doc) => sum + (doc.downloadCount || 0),
      0
    ),
    storageUsed: mockStats.storageUsed,
    storagePercentage: mockStats.storagePercentage,
  };

  // Get documents by category
  const documentsByCategory = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {});

  // Get recent activity data
  const getActivityData = () => {
    return mockStats.monthlyActivity.map((item) => ({
      ...item,
      period: dateRange === "year" ? `2024-${item.month}` : item.month,
    }));
  };

  const exportReport = (type) => {
    // Simulate report export
    const reportData = {
      type,
      dateRange,
      generatedAt: new Date().toISOString(),
      stats,
      documents: documents.length,
      users: users.length,
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
        </div>

        <div className="flex items-center space-x-4">
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

          {/* Top Documents */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Most Popular Documents"
              description="Documents with highest view counts"
              icon={TrendingUp}
            >
              <div className="space-y-4">
                {documents
                  .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                  .slice(0, 5)
                  .map((doc, index) => (
                    <div
                      key={doc.id}
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
                            {doc.category} • {doc.author}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {doc.viewCount || 0} views
                        </p>
                        <p className="text-sm text-gray-600">
                          {doc.downloadCount || 0} downloads
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
              title="Daily Active Users"
              description="User engagement over time"
              icon={Users}
            >
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    User activity chart would be rendered here
                  </p>
                  <p className="text-sm text-gray-500">
                    Integration with charts library needed
                  </p>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Search Query Analytics"
              description="Most common search terms"
              icon={TrendingUp}
            >
              <div className="space-y-3">
                {[
                  { term: "budget", count: 124, percentage: 85 },
                  { term: "meeting minutes", count: 98, percentage: 67 },
                  { term: "heritage", count: 76, percentage: 52 },
                  { term: "financial report", count: 54, percentage: 37 },
                  { term: "council", count: 43, percentage: 29 },
                ].map((query, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">
                          "{query.term}"
                        </span>
                        <span className="text-sm text-gray-600">
                          {query.count} searches
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-kumbo-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${query.percentage}%` }}
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
              title="Peak Usage Hours"
              description="When users are most active"
              icon={Calendar}
            >
              <div className="space-y-3">
                {[
                  { hour: "9:00 AM", usage: 95 },
                  { hour: "10:00 AM", usage: 88 },
                  { hour: "2:00 PM", usage: 76 },
                  { hour: "11:00 AM", usage: 65 },
                  { hour: "3:00 PM", usage: 54 },
                ].map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {time.hour}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${time.usage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {time.usage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard
              title="Device Analytics"
              description="Access by device type"
              icon={Activity}
            >
              <div className="space-y-4">
                {[
                  { device: "Desktop", percentage: 68, color: "bg-blue-500" },
                  { device: "Mobile", percentage: 24, color: "bg-green-500" },
                  { device: "Tablet", percentage: 8, color: "bg-amber-500" },
                ].map((device, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">
                        {device.device}
                      </span>
                      <span className="text-sm text-gray-600">
                        {device.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${device.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${device.percentage}%` }}
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
          {/* Document Growth */}
          <ChartCard
            title="Document Growth Over Time"
            description="Total documents added by month"
            icon={TrendingUp}
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Document growth chart</p>
              </div>
            </div>
          </ChartCard>

          {/* File Types Distribution */}
          <ChartCard
            title="File Types Distribution"
            description="Documents by file format"
            icon={FileText}
          >
            <div className="space-y-4">
              {[
                {
                  type: "PDF",
                  count: 156,
                  percentage: 65,
                  color: "bg-red-500",
                },
                {
                  type: "DOCX",
                  count: 89,
                  percentage: 37,
                  color: "bg-blue-500",
                },
                {
                  type: "XLSX",
                  count: 45,
                  percentage: 19,
                  color: "bg-green-500",
                },
                {
                  type: "Images",
                  count: 23,
                  percentage: 10,
                  color: "bg-purple-500",
                },
              ].map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${type.color}`}></div>
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
                        className={`${type.color} h-2 rounded-full`}
                        style={{ width: `${type.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Storage Analysis */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Storage Analysis by Department"
              description="Storage usage across different departments"
              icon={BarChart3}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    dept: "Finance",
                    usage: "580 MB",
                    percentage: 24,
                    files: 45,
                  },
                  {
                    dept: "Administration",
                    usage: "420 MB",
                    percentage: 18,
                    files: 67,
                  },
                  {
                    dept: "Cultural Affairs",
                    usage: "380 MB",
                    percentage: 16,
                    files: 34,
                  },
                  {
                    dept: "Public Works",
                    usage: "290 MB",
                    percentage: 12,
                    files: 23,
                  },
                ].map((dept, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {dept.dept}
                    </h4>
                    <p className="text-2xl font-bold text-kumbo-green-600 mb-1">
                      {dept.usage}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {dept.files} files
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-kumbo-green-500 h-2 rounded-full"
                        style={{ width: `${dept.percentage * 4}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {dept.percentage}% of total
                    </p>
                  </div>
                ))}
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
                {users.map((user, index) => (
                  <div key={user.id} className="p-4 bg-gray-50 rounded-lg">
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
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {Math.floor(Math.random() * 50) + 10}
                        </p>
                        <p className="text-xs text-gray-600">
                          Documents Viewed
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {Math.floor(Math.random() * 20) + 5}
                        </p>
                        <p className="text-xs text-gray-600">Downloads</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {Math.floor(Math.random() * 10) + 1}h
                        </p>
                        <p className="text-xs text-gray-600">Time Active</p>
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
                {[
                  {
                    role: "Admin",
                    count:
                      stats.totalUsers > 0
                        ? users.filter((u) => u.role === "admin").length
                        : 1,
                    color: "bg-red-500",
                  },
                  {
                    role: "Staff",
                    count:
                      stats.totalUsers > 0
                        ? users.filter((u) => u.role === "staff").length
                        : 2,
                    color: "bg-blue-500",
                  },
                  {
                    role: "Researcher",
                    count:
                      stats.totalUsers > 0
                        ? users.filter((u) => u.role === "researcher").length
                        : 1,
                    color: "bg-green-500",
                  },
                ].map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded ${role.color}`}></div>
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
              title="Login Frequency"
              description="User engagement levels"
              icon={Activity}
            >
              <div className="space-y-3">
                {[
                  { frequency: "Daily", count: 8, percentage: 80 },
                  { frequency: "Weekly", count: 4, percentage: 40 },
                  { frequency: "Monthly", count: 2, percentage: 20 },
                  { frequency: "Rarely", count: 1, percentage: 10 },
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
    </div>
  );
};

export default ReportsPage;
