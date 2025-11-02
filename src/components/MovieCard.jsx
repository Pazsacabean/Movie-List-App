import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  const getRatingColor = (rating) => {
    if (!rating || rating === "N/A") return 'bg-gray-500';
    const numRating = parseFloat(rating);
    if (numRating >= 8) return 'bg-green-500';
    if (numRating >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-lg rounded-xl p-3 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group border border-gray-200 flex flex-col h-[380px] justify-between"
    >
      <div className="relative overflow-hidden rounded-lg flex-shrink-0">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450/4F46E5/FFFFFF?text=No+Poster"}
          alt={movie.Title}
          className="w-full h-56 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
        />
        {/* Always show star badge, but show "?" if rating is missing */}
        <div className="absolute top-2 right-2">
          <div className={`${getRatingColor(movie.imdbRating)} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1`}>
            ⭐ {movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : "?"}
          </div>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>

      <div className="mt-3 flex flex-col flex-grow">
        <h2 className="font-bold text-sm line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
          {movie.Title}
        </h2>
        <p className="text-xs text-gray-600 mt-1 bg-gray-100 inline-block px-2 py-1 rounded-full self-start">
          {movie.Year}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;