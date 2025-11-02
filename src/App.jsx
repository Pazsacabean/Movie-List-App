import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";
import MovieDetail from "./components/MovieDetail";

const OMDb_API_KEY = "b47865ac";
const TMDB_API_KEY = "c5cefa7572151ff5584ec2a85a108f79";
const TMDB_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNWNlZmE3NTcyMTUxZmY1NTg0ZWMyYTg1YTEwOGY3OSIsIm5iZiI6MTc2MjAwNzM1OC4yNDUsInN1YiI6IjY5MDYxOTNlZjBkZmYzYzM1NzJmZTQ3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Uz3E-i_XhJ9dK13oXj4fKLSiOOQPdSX4H6sT0zkKXlQ";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("Avengers");
  const [loading, setLoading] = useState(false);

  // Fetch full movie data for each search result
  const fetchMovies = async (term) => {
    if (!term.trim()) return;
    
    setLoading(true);
    try {
      // Step 1: Search movies
      const searchRes = await fetch(`https://www.omdbapi.com/?apikey=${OMDb_API_KEY}&s=${encodeURIComponent(term)}`);
      const searchData = await searchRes.json();

      if (searchData.Response === "False" || !searchData.Search) {
        setMovies([]);
        return;
      }

      // Step 2: Fetch full details for each movie to get real imdbRating
      const fullMovieDetails = await Promise.all(
        searchData.Search.map(movie =>
          fetch(`https://www.omdbapi.com/?apikey=${OMDb_API_KEY}&i=${movie.imdbID}`)
            .then(res => res.json())
        )
      );

      setMovies(fullMovieDetails);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetail = async (imdbID) => {
    try {
      // FIXED: Changed http:// to https://
      const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDb_API_KEY}&i=${imdbID}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  const fetchTMDBTrailers = async (movieTitle, year) => {
    try {
      const searchResponse = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieTitle)}&year=${year}&language=en-US`,
        {
          headers: {
            'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!searchResponse.ok) throw new Error('TMDB search failed');

      const searchData = await searchResponse.json();
      
      if (searchData.results?.length > 0) {
        const movieId = searchData.results[0].id;
        
        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
          {
            headers: {
              'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
              'Accept': 'application/json'
            }
          }
        );

        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          return videosData.results || [];
        }
      }
    } catch (error) {
      console.error("Error fetching TMDB trailers:", error);
    }
    return [];
  };

  useEffect(() => {
    fetchMovies("Avengers");
  }, []);

  const handleQuickSearch = (term) => {
    setSearchTerm(term);
    fetchMovies(term);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <main className="flex-1 w-full">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={() => fetchMovies(searchTerm)}
                    onQuickSearch={handleQuickSearch}
                  />
                  {loading ? (
                    <div className="flex justify-center items-center min-h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <MovieList
                      movies={movies}
                      onMovieClick={fetchMovieDetail}
                    />
                  )}
                </>
              }
            />
            <Route
              path="/movie/:id"
              element={
                <MovieDetail 
                  fetchTMDBTrailers={fetchTMDBTrailers}
                  fetchMovieDetail={fetchMovieDetail}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;