import React, { useState } from "react";
import {
  User,
  Mail,
  Building,
  Calendar,
  Camera,
  FileText,
  Database,
  Clock,
  Shield,
  Globe,
  Download,
  CheckCircle,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SettingsSection from "./SettingsSection";
import { departments } from "../../data/mockData";

const ProfileSettings = ({ onchange }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    department: user?.department || "Administration",
    bio: "",
    phone: "",
    location: "Kumbo, North West Region, Cameroon",
    linkedin: "",
    website: "",
  });

  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    onchange();
  };

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Profile Information"
        description="Update your personal information and contact details"
        icon={User}
      >
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-kumbo-green-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Profile Picture</h4>
              <p className="text-sm text-gray-600 mb-2">
                Upload a new profile picture (JPG, PNG up to 5MB)
              </p>
              <div className="flex space-x-2">
                <button className="text-sm text-kumbo-green-600 hover:text-kumbo-green-700 font-medium">
                  Change Photo
                </button>
                <span className="text-gray-300">•</span>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => updateProfile("username", e.target.value)}
                className="input-field"
                placeholder="Enter username"
                required
              />
              <p className="text-xs text-gray-500">
                Used for login and mentions
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile("email", e.target.value)}
                  className="input-field pl-12"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfile("phone", e.target.value)}
                className="input-field"
                placeholder="+237 6XX XXX XXX"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={profile.department}
                  onChange={(e) => updateProfile("department", e.target.value)}
                  className="input-field pl-12"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => updateProfile("location", e.target.value)}
                className="input-field"
                placeholder="Enter your location"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => updateProfile("bio", e.target.value)}
              rows={4}
              className="input-field resize-none"
              placeholder="Tell us about yourself and your role at Kumbo Council..."
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Brief description for your profile
              </p>
              <p className="text-xs text-gray-500">
                {profile.bio.length}/500 characters
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Professional Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={profile.linkedin}
                  onChange={(e) => updateProfile("linkedin", e.target.value)}
                  className="input-field"
                  placeholder="https://linkedin.com/in/yourname"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Professional Website
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => updateProfile("website", e.target.value)}
                  className="input-field"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Account Information"
        description="View your account details and role information"
        icon={Calendar}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Role
              </label>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user?.role === "admin"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : user?.role === "staff"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-green-100 text-green-700 border border-green-200"
                  }`}
                >
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  (Cannot be changed)
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {user?.role === "admin"
                  ? "Full system access and user management"
                  : user?.role === "staff"
                  ? "Document management and upload permissions"
                  : "Read-only access to documents and search"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-gray-800 font-medium">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">Active for 6 months</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Status
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Active</span>
              </div>
              <p className="text-sm text-gray-600">Account in good standing</p>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-blue-700">
                  Documents Accessed
                </label>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-800">127</p>
              <p className="text-sm text-blue-600">This month: +23</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-green-700">
                  Total Downloads
                </label>
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-800">89</p>
              <p className="text-sm text-green-600">This month: +15</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-amber-700">
                  Time Active
                </label>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-800">24h</p>
              <p className="text-sm text-amber-600">This week</p>
            </div>
          </div>
        </div>

        {/* Account Permissions */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-3">
            Account Permissions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { permission: "View Documents", granted: true },
              { permission: "Download Documents", granted: true },
              {
                permission: "Upload Documents",
                granted: user?.role !== "researcher",
              },
              { permission: "Edit Documents", granted: user?.role === "admin" },
              {
                permission: "Delete Documents",
                granted: user?.role === "admin",
              },
              { permission: "Manage Users", granted: user?.role === "admin" },
              {
                permission: "System Settings",
                granted: user?.role === "admin",
              },
              { permission: "View Reports", granted: true },
              {
                permission: "Export Data",
                granted: user?.role !== "researcher",
              },
            ].map((perm, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  perm.granted
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <span className="text-sm font-medium text-gray-800">
                  {perm.permission}
                </span>
                {perm.granted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Privacy & Visibility"
        description="Control how your information is shared and displayed"
        icon={Shield}
      >
        <div className="space-y-4">
          {[
            {
              key: "showEmail",
              label: "Show Email to Other Users",
              description:
                "Allow other users to see your email address in user directories and contact lists",
              defaultChecked: false,
            },
            {
              key: "showLastLogin",
              label: "Show Last Login Time",
              description:
                "Display when you were last active to other users in the system",
              defaultChecked: true,
            },
            {
              key: "allowContact",
              label: "Allow Contact from Other Users",
              description:
                "Let other users send you messages and notifications through the system",
              defaultChecked: true,
            },
            {
              key: "showActivity",
              label: "Show Recent Activity",
              description:
                "Display your recent document access and downloads to team members",
              defaultChecked: false,
            },
            {
              key: "publicProfile",
              label: "Public Profile",
              description:
                "Make your profile and bio visible to all users in the organization",
              defaultChecked: true,
            },
          ].map((setting) => (
            <label
              key={setting.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-gray-800">{setting.label}</p>
                  {!setting.defaultChecked && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <div className="relative ml-4">
                <input
                  type="checkbox"
                  defaultChecked={setting.defaultChecked}
                  onChange={onchange}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setting.defaultChecked
                      ? "bg-kumbo-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      setting.defaultChecked
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    } mt-0.5`}
                  ></div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Data Export */}
        <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">Export Profile Data</p>
              <p className="text-sm text-blue-700">
                Download a copy of your profile information and settings
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Language & Region"
        description="Customize your language and regional preferences"
        icon={Globe}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select className="input-field">
              <option value="en">English</option>
              <option value="fr">Français (French)</option>
            </select>
            <p className="text-xs text-gray-500">
              Interface language for the application
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Time Zone
            </label>
            <select className="input-field">
              <option value="Africa/Douala">Africa/Douala (WAT, UTC+1)</option>
              <option value="UTC">UTC (GMT+0)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="America/New_York">
                America/New_York (EST, UTC-5)
              </option>
            </select>
            <p className="text-xs text-gray-500">
              Used for displaying dates and times
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date Format
            </label>
            <select className="input-field">
              <option value="MM/DD/YYYY">MM/DD/YYYY (American)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (European)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
            <p className="text-xs text-gray-500">
              How dates are displayed throughout the system
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Number Format
            </label>
            <select className="input-field">
              <option value="en-US">1,234.56 (US)</option>
              <option value="en-GB">1,234.56 (UK)</option>
              <option value="fr-FR">1 234,56 (French)</option>
              <option value="de-DE">1.234,56 (German)</option>
            </select>
            <p className="text-xs text-gray-500">
              Number and currency formatting
            </p>
          </div>
        </div>

        {/* Regional Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">
            Regional Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Current Time</p>
              <p className="font-medium text-gray-800">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Local Date</p>
              <p className="font-medium text-gray-800">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Week Start</p>
              <p className="font-medium text-gray-800">Monday</p>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Accessibility"
        description="Customize the interface for better accessibility"
      >
        <div className="space-y-4">
          {[
            {
              key: "highContrast",
              label: "High Contrast Mode",
              description: "Increase contrast for better visibility",
              defaultChecked: false,
            },
            {
              key: "largeText",
              label: "Large Text",
              description: "Increase font size throughout the interface",
              defaultChecked: false,
            },
            {
              key: "reduceMotion",
              label: "Reduce Motion",
              description: "Minimize animations and transitions",
              defaultChecked: false,
            },
            {
              key: "screenReader",
              label: "Screen Reader Support",
              description: "Optimize for screen reader compatibility",
              defaultChecked: true,
            },
          ].map((setting) => (
            <label
              key={setting.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium text-gray-800">{setting.label}</p>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  defaultChecked={setting.defaultChecked}
                  onChange={onchange}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setting.defaultChecked
                      ? "bg-kumbo-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      setting.defaultChecked
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    } mt-0.5`}
                  ></div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
};

export default ProfileSettings;
