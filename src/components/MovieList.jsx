import MovieCard from "./MovieCard";

function MovieList({ movies, onMovieClick }) {
  if (movies.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-lg max-w-md mx-auto">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl font-semibold text-gray-800 mb-2">No movies found</p>
        <p className="text-gray-600">Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 sm:px-6 py-6 w-full max-w-7xl mx-auto">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onClick={() => onMovieClick(movie.imdbID)}
        />
      ))}
    </div>
  );
}

export default MovieList;