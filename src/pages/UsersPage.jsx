import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  UserCheck,
  UserX,
  Shield,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../context/UserContext";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import UserStats from "../components/users/UserStats";

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const {
    users,
    userStats,
    isLoading,
    error,
    selectedUsers,
    hasSelection,
    isAllSelected,
    fetchUsers,
    fetchUserStats,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    bulkUpdateUsers,
    bulkDeleteUsers,
    setFilters,
    clearFilters,
    selectUser,
    deselectUser,
    selectAllUsers,
    clearSelection,
    isSelected,
    clearError,
  } = useUsers();

  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Load users and stats on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
      await fetchUserStats();
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update filters when local filters change
  useEffect(() => {
    const filters = {};

    if (localSearchQuery.trim()) {
      filters.search = localSearchQuery.trim();
    }

    if (roleFilter !== "All") {
      filters.role = roleFilter.toLowerCase();
    }

    if (statusFilter !== "All") {
      filters.status = statusFilter.toLowerCase();
    }

    setFilters(filters);
  }, [localSearchQuery, roleFilter, statusFilter, setFilters]);

  // Check if current user is admin
  if (currentUser?.role !== "admin") {
    return (
      <div className="p-6 animate-fade-in">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">
            You need administrator privileges to access user management.
          </p>
        </div>
      </div>
    );
  }

  // Filter users locally for immediate UI feedback
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      localSearchQuery === "" ||
      user.name?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(localSearchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "All" ||
      user.role?.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && user.isActive) ||
      (statusFilter === "Inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats from filtered users or use context stats
  const stats = {
    total: userStats.total || users.length,
    active: userStats.active || users.filter((u) => u.isActive).length,
    inactive: userStats.inactive || users.filter((u) => !u.isActive).length,
    admins: userStats.admins || users.filter((u) => u.role === "admin").length,
    staff: userStats.staff || users.filter((u) => u.role === "staff").length,
    researchers:
      userStats.researchers ||
      users.filter((u) => u.role === "researcher").length,
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;

    try {
      switch (action) {
        case "activate":
          await bulkUpdateUsers(selectedUsers, { isActive: true });
          break;
        case "deactivate":
          await bulkUpdateUsers(selectedUsers, { isActive: false });
          break;
        case "delete":
          if (
            window.confirm(
              `Are you sure you want to delete ${selectedUsers.length} user(s)?`
            )
          ) {
            await bulkDeleteUsers(selectedUsers);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} users:`, error);
    }
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, userData);
      } else {
        await createUser(userData);
      }
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to save user:", error);
      // Error will be handled by context and displayed in form
    }
  };

  const handleRefresh = async () => {
    await fetchUsers();
    await fetchUserStats();
  };

  const handleSearch = async (query) => {
    if (query.trim()) {
      await searchUsers(query);
    } else {
      await fetchUsers();
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage system users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh Users"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
          <button
            onClick={handleAddUser}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
              <p className="text-red-700 font-medium">Error</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* User Statistics */}
      <UserStats stats={stats} isLoading={isLoading} />

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, username, or department..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(localSearchQuery);
                }
              }}
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200"
          >
            <option value="All">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="staff">Staff</option>
            <option value="researcher">Researcher</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Clear Filters */}
          {(localSearchQuery ||
            roleFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              onClick={() => {
                setLocalSearchQuery("");
                setRoleFilter("All");
                setStatusFilter("All");
                clearFilters();
              }}
              className="px-4 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Bulk Actions */}
        {hasSelection && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                {selectedUsers.length} user
                {selectedUsers.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction("activate")}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  disabled={isLoading}
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction("deactivate")}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                  disabled={isLoading}
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  disabled={isLoading}
                >
                  Delete
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && users.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-kumbo-green-600" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              All Users ({filteredUsers.length})
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <UserTable
          users={filteredUsers}
          selectedUsers={selectedUsers}
          onSelectUser={selectUser}
          onDeselectUser={deselectUser}
          onSelectAll={selectAllUsers}
          onClearSelection={clearSelection}
          isSelected={isSelected}
          isAllSelected={isAllSelected}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          currentUser={currentUser}
          isLoading={isLoading}
        />
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
          isLoading={isLoading}
          error={error}
        />
      )}

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent User Activity
        </h2>
        <div className="space-y-3">
          {userStats.recentUsers && userStats.recentUsers.length > 0
            ? userStats.recentUsers.map((user, index) => (
                <div
                  key={user._id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">
                        {user.role} • {user.department}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            : // Fallback activity data
              [
                {
                  user: "Sarah Tanku",
                  action: "Logged in",
                  time: "2 hours ago",
                  type: "login",
                },
                {
                  user: "Dr. Paul Nkeng",
                  action: "Downloaded document",
                  time: "4 hours ago",
                  type: "download",
                },
                {
                  user: "Marie Fon",
                  action: "Updated profile",
                  time: "1 day ago",
                  type: "update",
                },
                {
                  user: "Emmanuel Ngwa",
                  action: "Account deactivated",
                  time: "2 days ago",
                  type: "deactivate",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "login"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "download"
                          ? "bg-blue-100 text-blue-600"
                          : activity.type === "update"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {activity.type === "login" ? (
                        <UserCheck className="w-4 h-4" />
                      ) : activity.type === "download" ? (
                        <Activity className="w-4 h-4" />
                      ) : activity.type === "update" ? (
                        <Edit className="w-4 h-4" />
                      ) : (
                        <UserX className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
        </div>
      </div>

      {/* Department Distribution */}
      {userStats.departmentDistribution &&
        userStats.departmentDistribution.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Users by Department
            </h2>
            <div className="space-y-3">
              {userStats.departmentDistribution.map((dept, index) => (
                <div
                  key={dept._id || index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-kumbo-green-500 rounded"></div>
                    <span className="font-medium text-gray-800">
                      {dept._id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {dept.count} users
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-kumbo-green-500 h-2 rounded-full"
                        style={{
                          width: `${(dept.count / stats.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default UsersPage;
