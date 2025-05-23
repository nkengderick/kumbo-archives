import React from "react";

const ChartCard = ({ title, description, icon: Icon, children, actions }) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="w-10 h-10 bg-kumbo-green-100 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-kumbo-green-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>

      <div className="min-h-[200px]">{children}</div>
    </div>
  );
};

export default ChartCard;
