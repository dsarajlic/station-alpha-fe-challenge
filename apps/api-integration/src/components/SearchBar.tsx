import { useState, useEffect, FormEvent } from 'react';
import { SearchHistoryItem } from '../App';
import { searchLocations } from '../services/weatherApi';

interface SearchBarProps {
  onSearch: (location: string) => void;
  searchHistory: SearchHistoryItem[];
  addToSearchHistory: (query: string) => void;
}

const SearchBar = ({ onSearch, searchHistory, addToSearchHistory }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);


  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const results = await searchLocations(debouncedQuery);
        setSuggestions(results || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounceTimer);
  }, [debouncedQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      addToSearchHistory(query);
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    addToSearchHistory(suggestion);
    setShowSuggestions(false);
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    onSearch(historyItem);
    setShowHistory(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setShowHistory(false);
    }, 200);
  }

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onBlur={handleBlur}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setShowSuggestions(true);
              setShowHistory(query.length < 3 && searchHistory.length > 0);
            }}
            placeholder="Search for a city or zip code..."
            className="search-input"
            aria-label="Search for location"
            aria-autocomplete="list"
          />
          <button type="submit" className="search-button" aria-label="Search button">
            Search
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">

            {showSuggestions && query.length >= 3 && suggestions.length === 0 && (
              <div className="suggestion-item no-results" role="option" aria-label="No results found">No locations found for {query}</div>
            )}

            {isSearching && (
              <div className="suggestion-item search-status" role="option" aria-label="Searching locations">Searching locations...</div>
            )}

            {suggestions.map((suggestion, idx) => (
              <li
                key={suggestion.id || idx}
                onClick={() => handleSuggestionClick(suggestion.name)}
                className="suggestion-item"
                role="option"
                aria-label={`Search suggestion for ${suggestion.name}`}
              >
                {suggestion.name}, {suggestion.country}
              </li>
            ))}
          </ul>
        )}

        {/* Search history dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="search-history">
            <h4>Recent Searches</h4>
            <ul className="history-list">
              {searchHistory.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => handleHistoryClick(item.query)}
                  className="history-item"
                  role="option"
                  aria-label={`Search history item for ${item.query}`}
                >
                  {item.query}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar; 