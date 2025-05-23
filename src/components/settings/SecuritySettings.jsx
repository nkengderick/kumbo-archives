import React, { useState } from "react";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  AlertTriangle,
  Clock,
  Download,
  Database,
} from "lucide-react";
import SettingsSection from "./SettingsSection";

const SecuritySettings = ({ onchange }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: "4", // hours
    downloadTracking: true,
    ipRestriction: false,
  });

  const updatePasswordForm = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    onchange();
  };

  const updateSecuritySetting = (key, value) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }));
    onchange();
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Password change logic would go here
    alert("Password change functionality would be implemented here");
  };

  // Mock recent login activity
  const recentActivity = [
    {
      device: "Windows PC",
      location: "Kumbo, Cameroon",
      time: "2 hours ago",
      current: true,
    },
    {
      device: "Android Phone",
      location: "Kumbo, Cameroon",
      time: "1 day ago",
      current: false,
    },
    {
      device: "Windows PC",
      location: "Bamenda, Cameroon",
      time: "3 days ago",
      current: false,
    },
    {
      device: "iPad",
      location: "Douala, Cameroon",
      time: "1 week ago",
      current: false,
    },
  ];

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Change Password"
        description="Update your account password to keep your account secure"
        icon={Lock}
      >
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Password */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    updatePasswordForm("currentPassword", e.target.value)
                  }
                  className="input-field pr-12"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    updatePasswordForm("newPassword", e.target.value)
                  }
                  className="input-field pr-12"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordForm.newPassword && (
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          passwordForm.newPassword.length >= i * 2
                            ? passwordForm.newPassword.length >= 8
                              ? "bg-green-500"
                              : passwordForm.newPassword.length >= 6
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength:{" "}
                    {passwordForm.newPassword.length >= 8
                      ? "Strong"
                      : passwordForm.newPassword.length >= 6
                      ? "Medium"
                      : passwordForm.newPassword.length >= 3
                      ? "Weak"
                      : "Too short"}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    updatePasswordForm("confirmPassword", e.target.value)
                  }
                  className="input-field pr-12"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordForm.confirmPassword &&
                passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Password Requirements:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Include at least one number</li>
              <li>• Include at least one special character</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                passwordForm.newPassword !== passwordForm.confirmPassword
              }
            >
              Update Password
            </button>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
        icon={Smartphone}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-gray-600">
                {securitySettings.twoFactorEnabled
                  ? "Protect your account with an additional verification step"
                  : "Enable two-factor authentication for enhanced security"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  securitySettings.twoFactorEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
              <button
                onClick={() =>
                  updateSecuritySetting(
                    "twoFactorEnabled",
                    !securitySettings.twoFactorEnabled
                  )
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  securitySettings.twoFactorEnabled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-kumbo-green-600 text-white hover:bg-kumbo-green-700"
                }`}
              >
                {securitySettings.twoFactorEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>

          {securitySettings.twoFactorEnabled && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-800">2FA is Active</p>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Your account is protected with two-factor authentication using
                an authenticator app.
              </p>
              <div className="flex space-x-2">
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  View Recovery Codes
                </button>
                <span className="text-green-400">•</span>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Regenerate Codes
                </button>
              </div>
            </div>
          )}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Security Preferences"
        description="Configure additional security options"
        icon={Shield}
      >
        <div className="space-y-4">
          {/* Login Notifications */}
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">Login Notifications</p>
              <p className="text-sm text-gray-600">
                Get notified when someone logs into your account
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={securitySettings.loginNotifications}
                onChange={(e) =>
                  updateSecuritySetting("loginNotifications", e.target.checked)
                }
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors ${
                  securitySettings.loginNotifications
                    ? "bg-kumbo-green-500"
                    : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    securitySettings.loginNotifications
                      ? "translate-x-6"
                      : "translate-x-0.5"
                  } mt-0.5`}
                ></div>
              </div>
            </div>
          </label>

          {/* Session Timeout */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-800">
                  Automatic Session Timeout
                </p>
                <p className="text-sm text-gray-600">
                  Log out automatically after period of inactivity
                </p>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) =>
                updateSecuritySetting("sessionTimeout", e.target.value)
              }
              className="input-field"
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="4">4 hours</option>
              <option value="8">8 hours</option>
              <option value="24">24 hours</option>
              <option value="never">Never</option>
            </select>
          </div>

          {/* Download Tracking */}
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">
                Download Activity Tracking
              </p>
              <p className="text-sm text-gray-600">
                Track document downloads for security auditing
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={securitySettings.downloadTracking}
                onChange={(e) =>
                  updateSecuritySetting("downloadTracking", e.target.checked)
                }
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors ${
                  securitySettings.downloadTracking
                    ? "bg-kumbo-green-500"
                    : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    securitySettings.downloadTracking
                      ? "translate-x-6"
                      : "translate-x-0.5"
                  } mt-0.5`}
                ></div>
              </div>
            </div>
          </label>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Recent Account Activity"
        description="Review recent logins and account access"
      >
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.current ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Smartphone
                    className={`w-5 h-5 ${
                      activity.current ? "text-green-600" : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{activity.device}</p>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{activity.time}</p>
                {activity.current && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Current session
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm text-kumbo-green-600 hover:text-kumbo-green-700 font-medium">
            View All Activity
          </button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Trusted Devices"
        description="Manage devices that can access your account"
      >
        <div className="space-y-3">
          {[
            {
              name: "Windows PC - Chrome",
              location: "Kumbo, Cameroon",
              lastUsed: "Currently active",
              trusted: true,
            },
            {
              name: "Android Phone - Mobile App",
              location: "Kumbo, Cameroon",
              lastUsed: "2 days ago",
              trusted: true,
            },
            {
              name: "iPad - Safari",
              location: "Douala, Cameroon",
              lastUsed: "1 week ago",
              trusted: false,
            },
          ].map((device, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    device.trusted ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Smartphone
                    className={`w-5 h-5 ${
                      device.trusted ? "text-green-600" : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{device.name}</p>
                  <p className="text-sm text-gray-600">{device.location}</p>
                  <p className="text-xs text-gray-500">{device.lastUsed}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {device.trusted && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Trusted
                  </span>
                )}
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Privacy & Data"
        description="Control your data and privacy settings"
      >
        <div className="space-y-4">
          {/* Data Retention */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-800">Data Retention</p>
                <p className="text-sm text-gray-600">
                  How long to keep your activity logs
                </p>
              </div>
              <Database className="w-5 h-5 text-gray-400" />
            </div>
            <select className="input-field" defaultValue="90">
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
              <option value="-1">Keep forever</option>
            </select>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            {[
              {
                key: "shareActivity",
                label: "Share Activity Data",
                description:
                  "Allow anonymized usage data to be used for system improvements",
              },
              {
                key: "profileVisibility",
                label: "Profile Visibility",
                description:
                  "Make your profile visible to other users in the system",
              },
              {
                key: "documentHistory",
                label: "Document Access History",
                description: "Keep a record of documents you have accessed",
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
                    defaultChecked={setting.key !== "shareActivity"}
                    onChange={onchange}
                    className="sr-only"
                  />
                  <div className="w-12 h-6 bg-gray-300 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform translate-x-0.5 mt-0.5"></div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Account Management"
        description="Advanced account options and data management"
      >
        <div className="space-y-4">
          {/* Export Account Data */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Export Account Data</p>
              <p className="text-sm text-gray-600">
                Download a copy of your account data and activity history
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>

          {/* Security Audit */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Security Audit</p>
              <p className="text-sm text-gray-600">
                Review your account security settings and get recommendations
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Shield className="w-4 h-4" />
              <span>Run Audit</span>
            </button>
          </div>

          {/* Clear Activity History */}
          <div className="flex items-center justify-between p-4 border border-amber-200 rounded-lg bg-amber-50">
            <div>
              <p className="font-medium text-amber-800">
                Clear Activity History
              </p>
              <p className="text-sm text-amber-700">
                Permanently delete your activity logs and access history
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <AlertTriangle className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>

          {/* Account Deactivation */}
          <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Account Deactivation</p>
                <p className="text-sm text-red-700 mb-3">
                  Temporarily deactivate your account. You can reactivate it
                  anytime by logging in. Your data will be preserved but your
                  account will be inaccessible to others.
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium border border-red-300 px-3 py-1 rounded hover:bg-red-100 transition-colors">
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>

          {/* Account Deletion */}
          <div className="p-4 border-2 border-red-300 rounded-lg bg-red-100">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900">
                  Delete Account Permanently
                </p>
                <p className="text-sm text-red-800 mb-3">
                  <strong>Warning:</strong> This action cannot be undone. All
                  your data, documents, and account information will be
                  permanently deleted from our systems.
                </p>
                <button className="text-sm text-white bg-red-700 hover:bg-red-800 font-medium px-3 py-1 rounded transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default SecuritySettings;
