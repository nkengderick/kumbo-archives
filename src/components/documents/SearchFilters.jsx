import React, { useState, useEffect } from "react";
import { X, Calendar, User, FileText, Building, Filter } from "lucide-react";
import { useDocuments } from "../../context/DocumentContext";

const departments = [
  "Administration",
  "Finance",
  "Legal Affairs",
  "Cultural Affairs",
  "Public Works",
  "Education",
  "Health",
  "Land Registry",
  "Planning",
  "External",
];

const SearchFilters = ({ filters, setFilters, onClear }) => {
  const { fetchCategories } = useDocuments();
  const [categories, setCategories] = useState(["All"]);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        const categoryNames = ["All", ...categoryData.map((cat) => cat.name)];
        setCategories(categoryNames);
      } catch (error) {
        console.error("Failed to load categories:", error);
        // Fallback to hardcoded categories
        setCategories([
          "All",
          "Administrative",
          "Financial",
          "Legal",
          "Cultural",
          "Infrastructure",
          "Education",
          "Healthcare",
          "Heritage",
          "Planning",
          "Environmental",
          "Social",
          "Economic",
        ]);
      }
    };

    loadCategories();
  }, [fetchCategories]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fileTypes = ["All", "PDF", "DOCX", "XLSX", "PPTX", "JPG", "PNG"];
  const dateRanges = [
    { value: "All", label: "All Time" },
    { value: "week", label: "Past Week" },
    { value: "month", label: "Past Month" },
    { value: "quarter", label: "Past 3 Months" },
    { value: "year", label: "Past Year" },
  ];

  // Get unique authors from mock data (in real app, this would come from API)
  const authors = [
    "All",
    "Finance Department",
    "Land Registry Office",
    "Secretary Office",
    "Cultural Affairs Department",
    "Public Works",
    "Education Department",
    "Health Department",
  ];

  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-kumbo-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Advanced Filters
          </h3>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center space-x-1"
        >
          <X className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-kumbo-green-600" />
            <span>Category</span>
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200"
          >
            {categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Building className="w-4 h-4 text-kumbo-green-600" />
            <span>Department</span>
          </label>
          <select
            value={filters.department}
            onChange={(e) => updateFilter("department", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200"
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-kumbo-green-600" />
            <span>Date Range</span>
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => updateFilter("dateRange", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* File Type Filter */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-kumbo-green-600" />
            <span>File Type</span>
          </label>
          <select
            value={filters.fileType}
            onChange={(e) => updateFilter("fileType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200"
          >
            {fileTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Author Filter */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <User className="w-4 h-4 text-kumbo-green-600" />
            <span>Author</span>
          </label>
          <select
            value={filters.author}
            onChange={(e) => updateFilter("author", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-kumbo-green-200 focus:border-kumbo-green-400 transition-all duration-200"
          >
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            Active filters:
          </span>

          {Object.entries(filters).map(([key, value]) => {
            if (value === "All") return null;

            const filterLabels = {
              category: "Category",
              department: "Department",
              dateRange: "Date",
              fileType: "Type",
              author: "Author",
            };

            return (
              <span
                key={key}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-kumbo-green-100 text-kumbo-green-700 text-sm rounded-full"
              >
                <span>
                  {filterLabels[key]}: {value}
                </span>
                <button
                  onClick={() => updateFilter(key, "All")}
                  className="hover:text-kumbo-green-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          {Object.values(filters).every((value) => value === "All") && (
            <span className="text-sm text-gray-400 italic">
              No active filters
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
