import React from 'react';

const Search = ({ setParPage, setSearchValue, searchValue, setCurrentPage = () => {}, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(); // Trigger search only when Enter is pressed
    }
  };

  return (
    <div className="flex justify-between items-center">
      <select
        onChange={(e) => setParPage(parseInt(e.target.value))}
        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
      <input
        onChange={(e) => {
          setCurrentPage(1);
          setSearchValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        value={searchValue}
        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#fff] placeholder-white"
        type="text"
        placeholder="Search (press Enter)"
      />
    </div>
  );
};

export default Search;