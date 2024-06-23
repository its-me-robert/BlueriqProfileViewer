import React, { useState, useEffect } from 'react';

type SearchInputProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({ searchQuery, setSearchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchQuery]);

  return (
    <div>
      <label htmlFor="search-input" className="sr-only">Zoek...</label>
      <input
        id="search-input"
        type="text"
        placeholder="Zoek..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
      />
    </div>
  );
};

export default SearchInput;