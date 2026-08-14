import React, { useState, useMemo } from 'react';
import '../styles/components.css';

const DataTable = ({
  data,
  columns,
  title,
  searchFields = [],
  filterFields = {},
  pageSize = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => item[key] === value);
      }
    });

    return result;
  }, [data, searchTerm, filters, searchFields]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === 'all' ? '' : value
    }));
    setCurrentPage(1);
  };

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h2>{title}</h2>
        <p className="record-count">Total: {filteredData.length} records</p>
      </div>

      <div className="table-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters">
          {Object.entries(filterFields).map(([fieldName, options]) => (
            <select
              key={fieldName}
              value={filters[fieldName] || ''}
              onChange={(e) => handleFilterChange(fieldName, e.target.value)}
              className="filter-select"
            >
              <option value="all">All {fieldName}</option>
              {options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index}>
                  {columns.map(column => (
                    <td key={column.key}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>

          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
