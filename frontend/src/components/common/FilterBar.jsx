import React from 'react';
import { FaFilter } from 'react-icons/fa';

const FilterBar = ({ filters, onFilterChange, categories }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <FaFilter />
        <label>Category:</label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Ideas">Ideas</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Sort by:</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="updated">Recently Updated</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;