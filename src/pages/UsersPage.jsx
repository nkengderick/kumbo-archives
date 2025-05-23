import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  UserCheck,
  UserX,
  Shield,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDocuments } from "../context/DocumentContext";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import UserStats from "../components/users/UserStats";

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

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

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    admins: users.filter((u) => u.role === "admin").length,
    staff: users.filter((u) => u.role === "staff").length,
    researchers: users.filter((u) => u.role === "researcher").length,
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      deleteUser(userId);
    }
  };

  const handleBulkAction = (action) => {
    // eslint-disable-next-line default-case
    switch (action) {
      case "activate":
        selectedUsers.forEach((userId) => {
          const user = users.find((u) => u.id === userId);
          if (user) updateUser(userId, { status: "Active" });
        });
        break;
      case "deactivate":
        selectedUsers.forEach((userId) => {
          const user = users.find((u) => u.id === userId);
          if (user) updateUser(userId, { status: "Inactive" });
        });
        break;
      case "delete":
        if (
          window.confirm(
            `Are you sure you want to delete ${selectedUsers.length} user(s)?`
          )
        ) {
          selectedUsers.forEach((userId) => deleteUser(userId));
        }
        break;
    }
    setSelectedUsers([]);
  };

  const handleFormSubmit = (userData) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      addUser(userData);
    }
    setShowUserForm(false);
    setEditingUser(null);
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
        <button
          onClick={handleAddUser}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* User Statistics */}
      <UserStats stats={stats} />

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or department..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
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
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction("deactivate")}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
          setSelectedUsers={setSelectedUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          currentUser={currentUser}
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
        />
      )}

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent User Activity
        </h2>
        <div className="space-y-3">
          {[
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
                  <p className="font-medium text-gray-800">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
