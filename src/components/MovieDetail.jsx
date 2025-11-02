import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function MovieDetail({ fetchTMDBTrailers, fetchMovieDetail }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailersLoading, setTrailersLoading] = useState(false);

  useEffect(() => {
    const loadMovieData = async () => {
      setLoading(true);
      try {
        // Fetch movie details from OMDb
        const movieData = await fetchMovieDetail(id);
        setMovie(movieData);

        if (movieData && movieData.Title) {
          setTrailersLoading(true);
          // Fetch trailers from TMDB
          const year = movieData.Year ? movieData.Year.split('–')[0] : '';
          const trailerData = await fetchTMDBTrailers(movieData.Title, year);
          setTrailers(trailerData);
          
          // Auto-select the first official trailer
          const officialTrailer = trailerData.find(
            trailer => trailer.type === "Trailer" && trailer.official
          ) || trailerData.find(trailer => trailer.type === "Trailer");
          
          setSelectedTrailer(officialTrailer || (trailerData.length > 0 ? trailerData[0] : null));
          setTrailersLoading(false);
        }
      } catch (error) {
        console.error("Error loading movie data:", error);
        setTrailersLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [id, fetchMovieDetail, fetchTMDBTrailers]);

  const getRatingColor = (rating) => {
    if (!rating || rating === "N/A") return 'text-gray-600 bg-gray-100';
    const numRating = parseFloat(rating);
    if (numRating >= 8) return 'text-green-600 bg-green-100';
    if (numRating >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRatingValue = (rating) => {
    return rating && rating !== "N/A" ? `${rating}/10` : "N/A";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!movie || movie.Response === "False") {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8">
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-xl font-semibold text-gray-800 mb-4">Movie not found</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow transition-colors flex items-center gap-2"
      >
        <span>←</span> Back to results
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 p-6">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400x600/4F46E5/FFFFFF?text=No+Poster"}
              alt={movie.Title}
              className="w-full h-auto rounded-xl shadow-lg"
            />
            
            <div className="mt-4 space-y-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${getRatingColor(movie.imdbRating)}`}>
                ⭐ {getRatingValue(movie.imdbRating)}
                <span className="text-sm font-normal">({movie.imdbVotes} votes)</span>
              </div>
              
              {movie.Runtime && movie.Runtime !== "N/A" && (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-flex items-center gap-2">
                  ⏱️ {movie.Runtime}
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-2/3 p-6 lg:p-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {movie.Title} <span className="text-blue-600">({movie.Year})</span>
            </h1>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {movie.Genre && movie.Genre !== "N/A" && 
                movie.Genre.split(', ').map((genre, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {genre}
                  </span>
                ))
              }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-700">Released:</span>
                  <p className="text-gray-900">{movie.Released}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Director:</span>
                  <p className="text-gray-900">{movie.Director}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Runtime:</span>
                  <p className="text-gray-900">{movie.Runtime}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Box Office:</span>
                  <p className="text-gray-900">{movie.BoxOffice || "Not available"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-700">Rating:</span>
                  <p className="text-gray-900">{movie.Rated}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Cast:</span>
                  <p className="text-gray-900">{movie.Actors}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Writer:</span>
                  <p className="text-gray-900">{movie.Writer}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Awards:</span>
                  <p className="text-gray-900">{movie.Awards !== "N/A" ? movie.Awards : "Not available"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-2">Plot</h3>
              <p className="text-gray-800 leading-relaxed text-lg">{movie.Plot}</p>
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎥 Movie Trailers & Videos</h2>
          
          {trailersLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading trailers...</span>
            </div>
          ) : selectedTrailer ? (
            <div className="space-y-6">
              {/* Main Trailer Player */}
              <div className="bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
                  title={selectedTrailer.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-64 lg:h-96"
                ></iframe>
              </div>
              
              {/* Trailer Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900">{selectedTrailer.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {selectedTrailer.type}
                  </span>
                  {selectedTrailer.official && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Official
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {selectedTrailer.site}
                  </span>
                </div>
              </div>

              {/* Additional Trailers */}
              {trailers.length > 1 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">More Videos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {trailers.map((trailer, index) => (
                      trailer.key !== selectedTrailer.key && (
                        <button
                          key={trailer.id}
                          onClick={() => setSelectedTrailer(trailer)}
                          className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-900 line-clamp-1">
                              {trailer.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {trailer.type}
                            </span>
                            {trailer.official && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Official
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🎬</div>
              <p className="text-gray-600 mb-2">No trailers available for this movie</p>
              <p className="text-sm text-gray-500">
                Trailers are sourced from The Movie Database (TMDB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;