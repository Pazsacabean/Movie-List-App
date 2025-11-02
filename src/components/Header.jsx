function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">
          🎬 Movie Finder
        </h1>
        <p className="text-blue-100 text-center mt-2 text-sm">
          Discover your next favorite movie
        </p>
      </div>
    </header>
  );
}

export default Header;