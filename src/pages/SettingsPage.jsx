import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SettingsSection from "../components/settings/SettingsSection";
import ProfileSettings from "../components/settings/ProfileSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import SystemSettings from "../components/settings/SystemSettings";

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "Personal information and preferences",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Email and system notifications",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      description: "Password and security settings",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
      description: "Theme and display options",
    },
    ...(user?.role === "admin"
      ? [
          {
            id: "system",
            label: "System",
            icon: Database,
            description: "System-wide configurations",
          },
        ]
      : []),
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveMessage("Settings saved successfully!");
      setHasChanges(false);
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Error saving settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings onchange={() => setHasChanges(true)} />;
      case "notifications":
        return <NotificationSettings onchange={() => setHasChanges(true)} />;
      case "security":
        return <SecuritySettings onchange={() => setHasChanges(true)} />;
      case "appearance":
        return <AppearanceSettings onchange={() => setHasChanges(true)} />;
      case "system":
        return user?.role === "admin" ? (
          <SystemSettings onchange={() => setHasChanges(true)} />
        ) : null;
      default:
        return <ProfileSettings onchange={() => setHasChanges(true)} />;
    }
  };

  const AppearanceSettings = ({ onchange }) => {
    const [settings, setSettings] = useState({
      theme: "light",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timezone: "Africa/Douala",
      compactView: false,
      showFileIcons: true,
      animationsEnabled: true,
    });

    const updateSetting = (key, value) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      onchange();
    };

    return (
      <div className="space-y-6">
        <SettingsSection
          title="Display Preferences"
          description="Customize how the interface looks and feels"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "light",
                    label: "Light",
                    preview: "bg-white border-gray-200",
                  },
                  {
                    value: "dark",
                    label: "Dark",
                    preview: "bg-gray-800 border-gray-600",
                  },
                ].map((theme) => (
                  <label
                    key={theme.value}
                    className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      settings.theme === theme.value
                        ? "border-kumbo-green-500 bg-kumbo-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={settings.theme === theme.value}
                      onChange={(e) => updateSetting("theme", e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-8 h-6 rounded ${theme.preview} mr-3 border`}
                    ></div>
                    <span className="font-medium text-gray-800">
                      {theme.label}
                    </span>
                    {settings.theme === theme.value && (
                      <CheckCircle className="w-5 h-5 text-kumbo-green-600 absolute top-2 right-2" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting("language", e.target.value)}
                className="input-field"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

            {/* Date Format */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSetting("dateFormat", e.target.value)}
                className="input-field"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting("timezone", e.target.value)}
                className="input-field"
              >
                <option value="Africa/Douala">Africa/Douala (GMT+1)</option>
                <option value="UTC">UTC (GMT+0)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
                <option value="America/New_York">
                  America/New_York (GMT-5)
                </option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Interface Options"
          description="Adjust interface behavior and visual elements"
        >
          <div className="space-y-4">
            {[
              {
                key: "compactView",
                label: "Compact View",
                description: "Use a more condensed layout to show more content",
              },
              {
                key: "showFileIcons",
                label: "Show File Type Icons",
                description:
                  "Display icons for different file types in document listings",
              },
              {
                key: "animationsEnabled",
                label: "Enable Animations",
                description:
                  "Use smooth transitions and animations throughout the interface",
              },
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium text-gray-800">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings[option.key]}
                    onChange={(e) =>
                      updateSetting(option.key, e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings[option.key]
                        ? "bg-kumbo-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        settings[option.key]
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

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">
              Settings
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          )}
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`mt-4 p-4 rounded-xl flex items-center space-x-3 ${
              saveMessage.includes("Error")
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}
          >
            {saveMessage.includes("Error") ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p>{saveMessage}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-4 sticky top-6">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-kumbo-green-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{tab.label}</p>
                    <p
                      className={`text-xs truncate ${
                        activeTab === tab.id
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {tab.description}
                    </p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
