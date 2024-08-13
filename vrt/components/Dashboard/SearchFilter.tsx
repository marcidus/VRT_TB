import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import './SearchFilter.css'; // Add some custom styles

interface SearchFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ selectedFilter, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filters = ['Relevance', 'Alphabetical', 'Creation Date'];

  return (
    <div className="search-filter">
      <FaFilter size={16} onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="filter-menu">
          {filters.map(filter => (
            <div
              key={filter}
              className={`filter-option ${filter === selectedFilter ? 'selected' : ''}`}
              onClick={() => {
                onFilterChange(filter);
                setIsOpen(false);
              }}
            >
              {filter}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
