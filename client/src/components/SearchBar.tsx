// SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  value: string;
  placeholder: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  return (
    <div className="flex items-center p-4 bg-white shadow-md rounded-lg">
      <input
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;
