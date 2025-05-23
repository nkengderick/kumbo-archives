import React from "react";

const SettingsSection = ({ title, description, children, icon: Icon }) => {
  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="w-8 h-8 bg-kumbo-green-100 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-kumbo-green-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
};

export default SettingsSection;
