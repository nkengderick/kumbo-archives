import React, { useState } from "react";
import { Bell, Mail, Monitor } from "lucide-react";
import SettingsSection from "./SettingsSection";

const NotificationSettings = ({ onchange }) => {
  const [emailNotifications, setEmailNotifications] = useState({
    newDocuments: true,
    documentUpdates: true,
    systemUpdates: false,
    weeklyDigest: true,
    securityAlerts: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    newDocuments: true,
    documentShared: true,
    systemMaintenance: true,
    loginAlerts: false,
  });

  const [preferences, setPreferences] = useState({
    frequency: "immediate",
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "07:00",
    soundEnabled: true,
    desktopNotifications: true,
  });

  const updateEmailSetting = (key, value) => {
    setEmailNotifications((prev) => ({ ...prev, [key]: value }));
    onchange();
  };

  const updatePushSetting = (key, value) => {
    setPushNotifications((prev) => ({ ...prev, [key]: value }));
    onchange();
  };

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    onchange();
  };

  const NotificationToggle = ({ checked, onChange, label, description }) => (
    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-12 h-6 rounded-full transition-colors ${
            checked ? "bg-kumbo-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
              checked ? "translate-x-6" : "translate-x-0.5"
            } mt-0.5`}
          ></div>
        </div>
      </div>
    </label>
  );

  return (
    <div className="space-y-8">
      <SettingsSection
        title="Email Notifications"
        description="Choose what email notifications you'd like to receive"
        icon={Mail}
      >
        <div className="space-y-3">
          <NotificationToggle
            checked={emailNotifications.newDocuments}
            onChange={(value) => updateEmailSetting("newDocuments", value)}
            label="New Document Uploads"
            description="Get notified when new documents are added to categories you follow"
          />

          <NotificationToggle
            checked={emailNotifications.documentUpdates}
            onChange={(value) => updateEmailSetting("documentUpdates", value)}
            label="Document Updates"
            description="Receive notifications when documents you've accessed are updated"
          />

          <NotificationToggle
            checked={emailNotifications.systemUpdates}
            onChange={(value) => updateEmailSetting("systemUpdates", value)}
            label="System Updates"
            description="Important system announcements and feature updates"
          />

          <NotificationToggle
            checked={emailNotifications.weeklyDigest}
            onChange={(value) => updateEmailSetting("weeklyDigest", value)}
            label="Weekly Activity Digest"
            description="A summary of archive activity and popular documents"
          />

          <NotificationToggle
            checked={emailNotifications.securityAlerts}
            onChange={(value) => updateEmailSetting("securityAlerts", value)}
            label="Security Alerts"
            description="Critical security notifications and login alerts"
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Push Notifications"
        description="Real-time notifications delivered to your browser"
        icon={Monitor}
      >
        <div className="space-y-3">
          <NotificationToggle
            checked={pushNotifications.newDocuments}
            onChange={(value) => updatePushSetting("newDocuments", value)}
            label="New Documents"
            description="Instant notifications for new document uploads"
          />

          <NotificationToggle
            checked={pushNotifications.documentShared}
            onChange={(value) => updatePushSetting("documentShared", value)}
            label="Documents Shared with You"
            description="When someone shares a document with you directly"
          />

          <NotificationToggle
            checked={pushNotifications.systemMaintenance}
            onChange={(value) => updatePushSetting("systemMaintenance", value)}
            label="System Maintenance"
            description="Alerts about scheduled system maintenance"
          />

          <NotificationToggle
            checked={pushNotifications.loginAlerts}
            onChange={(value) => updatePushSetting("loginAlerts", value)}
            label="Login Alerts"
            description="Notifications when your account is accessed from a new device"
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Notification Preferences"
        description="Customize how and when you receive notifications"
        icon={Bell}
      >
        <div className="space-y-6">
          {/* Notification Frequency */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Notification Frequency
            </label>
            <div className="space-y-2">
              {[
                {
                  value: "immediate",
                  label: "Immediate",
                  description: "Get notifications right away",
                },
                {
                  value: "hourly",
                  label: "Hourly Digest",
                  description: "Receive a summary every hour",
                },
                {
                  value: "daily",
                  label: "Daily Digest",
                  description: "One summary email per day",
                },
                {
                  value: "weekly",
                  label: "Weekly Digest",
                  description: "Weekly summary only",
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    preferences.frequency === option.value
                      ? "border-kumbo-green-500 bg-kumbo-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={preferences.frequency === option.value}
                    onChange={(e) =>
                      updatePreference("frequency", e.target.value)
                    }
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{option.label}</p>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                  {preferences.frequency === option.value && (
                    <div className="w-4 h-4 bg-kumbo-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quiet Hours
                </label>
                <p className="text-sm text-gray-600">
                  Pause notifications during specified hours
                </p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={preferences.quietHours}
                  onChange={(e) =>
                    updatePreference("quietHours", e.target.checked)
                  }
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.quietHours
                      ? "bg-kumbo-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      preferences.quietHours
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    } mt-0.5`}
                  ></div>
                </div>
              </div>
            </div>

            {preferences.quietHours && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={preferences.quietStart}
                    onChange={(e) =>
                      updatePreference("quietStart", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={preferences.quietEnd}
                    onChange={(e) =>
                      updatePreference("quietEnd", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Settings */}
          <div className="space-y-3">
            <NotificationToggle
              checked={preferences.soundEnabled}
              onChange={(value) => updatePreference("soundEnabled", value)}
              label="Sound Notifications"
              description="Play a sound when notifications arrive"
            />

            <NotificationToggle
              checked={preferences.desktopNotifications}
              onChange={(value) =>
                updatePreference("desktopNotifications", value)
              }
              label="Desktop Notifications"
              description="Show notifications on your desktop even when browser is minimized"
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Test Notifications"
        description="Send test notifications to verify your settings"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="w-5 h-5 text-gray-600" />
            <span>Send Test Email</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Monitor className="w-5 h-5 text-gray-600" />
            <span>Send Test Push</span>
          </button>
        </div>
      </SettingsSection>
    </div>
  );
};

export default NotificationSettings;
