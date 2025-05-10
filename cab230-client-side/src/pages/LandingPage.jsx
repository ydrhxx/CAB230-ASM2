import React, { useEffect, useState } from 'react';
import '../components/LandingPage.css';
import landingImage from '../images/LandingPage.png';

const LandingPage = () => {
  // Store a list of basic movie data from /search
  const [movieList, setMovieList] = useState([]);

  // Store full movie details including ratings and posters
  const [movieDetails, setMovieDetails] = useState([]);

  // Track which index to start displaying the 5 rotating movies
  const [startIndex, setStartIndex] = useState(0);

  // Step 1: Fetch a limited list of movies once on load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://4.237.58.241:3000/movies/search?limit=30');
        const data = await res.json();
        setMovieList(data.data || []);
      } catch (err) {
        console.error('Failed to load movie list:', err);
      }
    };

    fetchMovies();
  }, []);

  // Step 2: After movieList is loaded, fetch full data for each movie with a slight delay
  useEffect(() => {
    const fetchDetails = async () => {
      const promises = movieList.map(async (movie) => {
        try {
          const res = await fetch(`http://4.237.58.241:3000/movies/data/${movie.imdbID}`);
          return await res.json();
        } catch (err) {
          console.error('Error loading full movie data:', err);
          return null;
        }
      });

      const results = await Promise.all(promises);
      setMovieDetails(results.filter(Boolean)); // Remove null/failed results
    };

    if (movieList.length > 0) {
      const delay = setTimeout(() => fetchDetails(), 500); // Delay to prevent token race issue
      return () => clearTimeout(delay); // Clear timeout on unmount
    }
  }, [movieList]);

  // Step 3: Auto-rotate movies every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 5) % (movieDetails.length || 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [movieDetails]);

  // Get the current batch of 5 movies to show
  const currentMovies = movieDetails.slice(startIndex, startIndex + 5);

  return (
    <div className="landing-wrapper">
      <main className="landing-content">
        {/* Main heading */}
        <section className="text-section">
          <h1>Hardy Yuen’s <br />Fabulous Movie Searching Website</h1>
        </section>

        {/* Decorative banner image */}
        <section className="image-section">
          <img src={landingImage} alt="Landing Visual" className="landing-img" />
        </section>

        {/* Subheading / tagline */}
        <h3 className="tagline">I hope you find the movie you’re after!</h3>

        {/* Movie carousel section */}
        <section className="explore-section">
          <h2>Explore Movies</h2>
          <div className="movie-cards">
            {currentMovies.map((movie) => {
              // Get IMDb rating or fallback
              const imdbRating = movie.ratings?.find(
                (r) => r.source === 'Internet Movie Database'
              )?.value || 'N/A';

              // Get valid poster URL or use fallback image
              const posterUrl =
                movie.poster && movie.poster !== 'N/A'
                  ? movie.poster
                  : '/images/fallback-poster.png';

              return (
                <div className="movie-card" key={movie.imdbID}>
                  <img
                    src={posterUrl}
                    alt={`${movie.title} poster`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/fallback-poster.png';
                    }}
                  />
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-rating">⭐ {imdbRating}</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer with attribution */}
      <footer className="footer">
        All data is from IMDB, Metacritic and RottenTomatoes. © 2025 Hardy Yuen
      </footer>
    </div>
  );
};

export default LandingPage;
