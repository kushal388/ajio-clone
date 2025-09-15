

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${query}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      }
    };

    const delay = setTimeout(fetchData, 300); // debounce
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = () => {
    if (suggestions.length > 0) {
      // take first suggestion result
      navigate(
        `/c/${suggestions[0].category}/${slugify(suggestions[0].subcategory)}`
      );
    } else {
      // go to "no results" page with query param
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
    setQuery(""); // clear input
    setSuggestions([]); // clear dropdown
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="flex items-center z-50 border rounded-full bg-[#fffde7] px-3 py-1 w-72">
        <input
          type="text"
          placeholder="Search AJIO"
          className="bg-transparent outline-none px-2 text-sm w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <FaSearch
          className="text-gray-500 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {/* Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute top-8 left-0 bg-white border rounded-md shadow-md w-72 z-50">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              className="px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 hover:text-green-600"
              onClick={() => {
                navigate(`/c/${item.category}/${slugify(item.subcategory)}`);
                setQuery(""); // clear input
                setSuggestions([]); // hide dropdown
              }}
            >
              {item.category}{" "}
              <span className="text-gray-500">({item.subcategory})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;


