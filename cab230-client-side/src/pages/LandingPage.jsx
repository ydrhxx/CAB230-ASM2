import React, { useEffect, useState } from 'react';
import '../components/LandingPage.css';
import landingImage from '../images/LandingPage.png'; 

const LandingPage = () => {
  const [movieList, setMovieList] = useState([]);        // Stores initial basic movie list
  const [movieDetails, setMovieDetails] = useState([]);  // Stores full movie data (including ratings/posters)
  const [startIndex, setStartIndex] = useState(0);       // Index for rotating carousel

  // Fetches a base list of 30 movies on page load
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

  // Once movieList loads, fetch detailed data for each movie (with delay to avoid token race)
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
      setMovieDetails(results.filter(Boolean)); // Filter out nulls
    };

    if (movieList.length > 0) {
      const delay = setTimeout(() => fetchDetails(), 500); // slight delay
      return () => clearTimeout(delay);
    }
  }, [movieList]);

  // Automatically rotate through movies every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 5) % (movieDetails.length || 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [movieDetails]);

  // Show only 5 movies at a time
  const currentMovies = movieDetails.slice(startIndex, startIndex + 5);

  return (
    <div className="landing-wrapper">
      <main className="landing-content">
        {/* Title section */}
        <section className="text-section">
          <h1>Hardy Yuen’s <br />Fabulous Movie Searching Website</h1>
        </section>

        {/* Static hero image */}
        <section className="image-section">
          <img src={landingImage} alt="Landing Visual" className="landing-img" />
        </section>

        {/* Tagline */}
        <h3 className="tagline">I hope you find the movie you’re after!</h3>

        {/* Movie cards carousel */}
        <section className="explore-section">
          <h2>Explore Movies</h2>
          <div className="movie-cards">
            {currentMovies.map((movie) => {
              // Get IMDb rating from ratings array
              const imdbRating = movie.ratings?.find(
                (r) => r.source === 'Internet Movie Database'
              )?.value || 'N/A';

              return (
                <div className="movie-card" key={movie.imdbID}>
                  {/* Show poster if valid; hide if image fails to load */}
                  {movie.poster && movie.poster !== 'N/A' && (
                    <img
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  )}
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
