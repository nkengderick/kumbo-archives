import React from "react";
import {
  Edit,
  Trash2,
  MoreVertical,
  Shield,
  User,
  FileText,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

const UserTable = ({
  users,
  selectedUsers,
  setSelectedUsers,
  onEdit,
  onDelete,
  currentUser,
}) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "staff":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "researcher":
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "staff":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "researcher":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const isSelected = (userId) => selectedUsers.includes(userId);
  const isAllSelected =
    users.length > 0 && selectedUsers.length === users.length;
  const isIndeterminate =
    selectedUsers.length > 0 && selectedUsers.length < users.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-kumbo-green-600 focus:ring-kumbo-green-500"
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`hover:bg-gray-50 transition-colors ${
                isSelected(user.id) ? "bg-blue-50" : ""
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Checkbox */}
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={isSelected(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="rounded border-gray-300 text-kumbo-green-600 focus:ring-kumbo-green-500"
                />
              </td>

              {/* User Info */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-kumbo-green-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{user.email}</span>
                    </p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  {getRoleIcon(user.role)}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {user.permissions?.join(", ") || "No permissions set"}
                </div>
              </td>

              {/* Department */}
              <td className="px-6 py-4">
                <span className="text-sm text-gray-800">{user.department}</span>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  {user.status === "Active" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </div>
              </td>

              {/* Last Login */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>{user.lastLogin}</span>
                </div>
                {user.joinDate && (
                  <div className="text-xs text-gray-500 mt-1">
                    Joined: {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit User"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Prevent deleting current user or other admins */}
                  {user.id !== currentUser?.id && user.role !== "admin" && (
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="More Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No users found
          </h3>
          <p className="text-gray-500">
            No users match your current search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
