import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetSearchSuggestionsQuery } from "@/features/api/searchApi";

const AISearchBar = ({ placeholder = "Search courses...", className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();

  // Debounce search query for auto-complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: suggestionsData, isLoading: suggestionsLoading } = useGetSearchSuggestionsQuery(
    debouncedQuery,
    { skip: debouncedQuery.length < 2 }
  );

  const suggestions = suggestionsData?.suggestions || [];

  const handleSearch = (query = searchQuery) => {
    if (query.trim() !== "") {
      navigate(`/course/search?query=${encodeURIComponent(query.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`pl-12 mr-6 py-6 text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 shadow-lg ${className}`}
        />
        <Search className="absolute  left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Button
          onClick={() => handleSearch()}
          disabled={!searchQuery.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2"
        >
          Search
        </Button>
      </div>

      {/* Auto-complete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0  mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer rounded text-sm text-gray-700 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search className="w-3 h-3 mr-2 inline text-gray-400" />
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {suggestionsLoading && showSuggestions && searchQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 text-center text-gray-500 text-sm">
            <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
            Getting suggestions...
          </div>
        </div>
      )}
    </div>
  );
};

export default AISearchBar;
