import { useState } from "react";

function SearchBar({ searchTerm, setSearchTerm, onSearch, onQuickSearch }) {
  const [showQuickSearch, setShowQuickSearch] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const quickSearches = [
    { term: "Transformers", label: "🚗 Transformers Series" },
    { term: "Avengers", label: "🛡️ Avengers Series" },
    { term: "Star Wars", label: "⭐ Star Wars" },
    { term: "Harry Potter", label: "⚡ Harry Potter" }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for movies... (e.g., Avengers, Transformers, Star Wars)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowQuickSearch(true)}
            className="w-full p-4 pl-12 pr-32 text-lg border border-gray-300 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick Search Buttons */}
      <div className="mt-4">
        <p className="text-gray-600 text-sm mb-2 text-center">Quick search:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {quickSearches.map((quickSearch, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchTerm(quickSearch.term);
                onQuickSearch(quickSearch.term);
                setShowQuickSearch(false);
              }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              {quickSearch.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;