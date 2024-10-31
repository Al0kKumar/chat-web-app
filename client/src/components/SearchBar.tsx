// SearchBar.tsx
import React from 'react';
import { FiSearch } from 'react-icons/fi'; // Import a search icon from react-icons

interface SearchBarProps {
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    <div className="flex items-center p-3 bg-gray-800 shadow-lg  border border-gray-700">
      {/* Search Icon */}
      <FiSearch className="text-gray-400 w-5 h-5 ml-3 mr-2" />

      <input
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        className="flex-1 p-2 bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
