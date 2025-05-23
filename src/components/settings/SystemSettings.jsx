import React, { useState } from "react";
import {
  Database,
  HardDrive,
  Clock,
  Users,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
} from "lucide-react";
import SettingsSection from "./SettingsSection";

const SystemSettings = ({ onchange }) => {
  const [systemConfig, setSystemConfig] = useState({
    maxFileSize: "10", // MB
    allowedFileTypes: ["PDF", "DOCX", "XLSX", "PPTX", "JPG", "PNG"],
    maxStoragePerUser: "1024", // MB
    sessionTimeout: "4", // hours
    backupFrequency: "daily",
    maintenanceMode: false,
    publicRegistration: false,
    emailVerificationRequired: true,
    passwordExpiration: "90", // days
  });

  // eslint-disable-next-line no-unused-vars
  const [systemStats, setSystemStats] = useState({
    totalStorage: "10 GB",
    usedStorage: "2.4 GB",
    availableStorage: "7.6 GB",
    totalUsers: 15,
    activeUsers: 12,
    totalDocuments: 1247,
    systemUptime: "15 days, 8 hours",
    lastBackup: "2 hours ago",
  });

  const updateSystemConfig = (key, value) => {
    setSystemConfig((prev) => ({ ...prev, [key]: value }));
    onchange();
  };

  const handleFileTypeToggle = (fileType) => {
    const currentTypes = systemConfig.allowedFileTypes;
    const updatedTypes = currentTypes.includes(fileType)
      ? currentTypes.filter((type) => type !== fileType)
      : [...currentTypes, fileType];

    updateSystemConfig("allowedFileTypes", updatedTypes);
  };

  const handleSystemAction = (action) => {
    switch (action) {
      case "backup":
        alert("System backup initiated. This may take a few minutes...");
        break;
      case "maintenance":
        updateSystemConfig("maintenanceMode", !systemConfig.maintenanceMode);
        break;
      case "cleanup":
        alert("Storage cleanup initiated. Removing temporary files...");
        break;
      case "export":
        alert(
          "System logs export started. You will receive a download link via email."
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-8">
      <SettingsSection
        title="System Overview"
        description="Current system status and key metrics"
        icon={Database}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Storage",
              value: systemStats.totalStorage,
              icon: HardDrive,
              color: "blue",
            },
            {
              label: "Active Users",
              value: systemStats.activeUsers,
              icon: Users,
              color: "green",
            },
            {
              label: "Total Documents",
              value: systemStats.totalDocuments,
              icon: FileText,
              color: "purple",
            },
            {
              label: "System Uptime",
              value: systemStats.systemUptime,
              icon: Clock,
              color: "amber",
            },
          ].map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                <span className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Storage Usage */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">Storage Usage</h4>
            <span className="text-sm text-gray-600">
              {systemStats.usedStorage} / {systemStats.totalStorage}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-kumbo-green-500 to-kumbo-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: "24%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            24% of total capacity used
          </p>
        </div>
      </SettingsSection>

      <SettingsSection
        title="File Management"
        description="Configure file upload and storage settings"
        icon={FileText}
      >
        <div className="space-y-6">
          {/* File Size Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Maximum File Size (MB)
              </label>
              <select
                value={systemConfig.maxFileSize}
                onChange={(e) =>
                  updateSystemConfig("maxFileSize", e.target.value)
                }
                className="input-field"
              >
                <option value="5">5 MB</option>
                <option value="10">10 MB</option>
                <option value="25">25 MB</option>
                <option value="50">50 MB</option>
                <option value="100">100 MB</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Storage Per User (MB)
              </label>
              <select
                value={systemConfig.maxStoragePerUser}
                onChange={(e) =>
                  updateSystemConfig("maxStoragePerUser", e.target.value)
                }
                className="input-field"
              >
                <option value="512">512 MB</option>
                <option value="1024">1 GB</option>
                <option value="2048">2 GB</option>
                <option value="5120">5 GB</option>
                <option value="-1">Unlimited</option>
              </select>
            </div>
          </div>

          {/* Allowed File Types */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Allowed File Types
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["PDF", "DOCX", "XLSX", "PPTX", "JPG", "PNG", "MP4", "ZIP"].map(
                (fileType) => (
                  <label
                    key={fileType}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      systemConfig.allowedFileTypes.includes(fileType)
                        ? "border-kumbo-green-500 bg-kumbo-green-50 text-kumbo-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={systemConfig.allowedFileTypes.includes(fileType)}
                      onChange={() => handleFileTypeToggle(fileType)}
                      className="sr-only"
                    />
                    <span className="font-medium">{fileType}</span>
                    {systemConfig.allowedFileTypes.includes(fileType) && (
                      <CheckCircle className="w-4 h-4 ml-2" />
                    )}
                  </label>
                )
              )}
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="User Management"
        description="Configure user access and registration settings"
        icon={Users}
      >
        <div className="space-y-4">
          {/* Registration Settings */}
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">
                  Allow Public Registration
                </p>
                <p className="text-sm text-gray-600">
                  Let users create accounts without admin approval
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={systemConfig.publicRegistration}
                  onChange={(e) =>
                    updateSystemConfig("publicRegistration", e.target.checked)
                  }
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    systemConfig.publicRegistration
                      ? "bg-kumbo-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      systemConfig.publicRegistration
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    } mt-0.5`}
                  ></div>
                </div>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">
                  Require Email Verification
                </p>
                <p className="text-sm text-gray-600">
                  Users must verify their email before accessing the system
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={systemConfig.emailVerificationRequired}
                  onChange={(e) =>
                    updateSystemConfig(
                      "emailVerificationRequired",
                      e.target.checked
                    )
                  }
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    systemConfig.emailVerificationRequired
                      ? "bg-kumbo-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      systemConfig.emailVerificationRequired
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    } mt-0.5`}
                  ></div>
                </div>
              </div>
            </label>
          </div>

          {/* Session and Password Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Session Timeout (hours)
              </label>
              <select
                value={systemConfig.sessionTimeout}
                onChange={(e) =>
                  updateSystemConfig("sessionTimeout", e.target.value)
                }
                className="input-field"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="24">24 hours</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password Expiration (days)
              </label>
              <select
                value={systemConfig.passwordExpiration}
                onChange={(e) =>
                  updateSystemConfig("passwordExpiration", e.target.value)
                }
                className="input-field"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="-1">Never</option>
              </select>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="System Maintenance"
        description="Backup, maintenance, and system operations"
        icon={Settings}
      >
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div
            className={`p-4 rounded-lg border-2 ${
              systemConfig.maintenanceMode
                ? "border-red-200 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle
                  className={`w-5 h-5 ${
                    systemConfig.maintenanceMode
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-800">Maintenance Mode</p>
                  <p className="text-sm text-gray-600">
                    {systemConfig.maintenanceMode
                      ? "System is currently in maintenance mode"
                      : "Toggle maintenance mode for system updates"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSystemAction("maintenance")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  systemConfig.maintenanceMode
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
              >
                {systemConfig.maintenanceMode ? "Disable" : "Enable"}
              </button>
            </div>
          </div>

          {/* Backup Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Backup Frequency</p>
                <p className="text-sm text-gray-600">
                  Last backup: {systemStats.lastBackup}
                </p>
              </div>
              <select
                value={systemConfig.backupFrequency}
                onChange={(e) =>
                  updateSystemConfig("backupFrequency", e.target.value)
                }
                className="input-field w-auto"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSystemAction("backup")}
                className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Database className="w-5 h-5" />
                <span>Create Backup Now</span>
              </button>

              <button
                onClick={() => handleSystemAction("cleanup")}
                className="flex items-center justify-center space-x-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Clean Storage</span>
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="System Logs & Monitoring"
        description="View system logs and export data for analysis"
      >
        <div className="space-y-4">
          {/* Recent System Events */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Recent System Events</h4>
            <div className="space-y-2">
              {[
                {
                  type: "info",
                  message: "System backup completed successfully",
                  time: "2 hours ago",
                },
                {
                  type: "warning",
                  message: "High storage usage detected (80%)",
                  time: "6 hours ago",
                },
                {
                  type: "success",
                  message: "New user registered: Sarah Tanku",
                  time: "1 day ago",
                },
                {
                  type: "error",
                  message: "Failed login attempt from unknown IP",
                  time: "2 days ago",
                },
              ].map((event, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event.type === "error"
                        ? "bg-red-500"
                        : event.type === "warning"
                        ? "bg-yellow-500"
                        : event.type === "success"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{event.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Export System Logs</p>
              <p className="text-sm text-gray-600">
                Download complete system logs for analysis
              </p>
            </div>
            <button
              onClick={() => handleSystemAction("export")}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default SystemSettings;
