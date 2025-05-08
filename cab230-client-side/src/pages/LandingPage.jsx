import React, { useEffect, useState } from 'react';
import '../components/LandingPage.css';
import landingImage from '../images/LandingPage.png';

const LandingPage = () => {
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  // Fetch movies once
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://4.237.58.241:3000/movies/search?limit=30');
        const data = await res.json();
        setMovies(data.data || []);
      } catch (err) {
        console.error('Failed to load movies:', err);
      }
    };

    fetchMovies();
  }, []);

  // Rotate movie cards every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 5) % (movies.length || 1));
    }, 10000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [movies]);

  const currentMovies = movies.slice(startIndex, startIndex + 5);

  return (
    <div className="landing-wrapper">
      <main className="landing-content">
        <section className="text-section">
          <h1>Firstname Lastname’s <br />Fabulous Movie Searching Website</h1>
        </section>

        <section className="image-section">
          <img src={landingImage} alt="Landing Visual" className="landing-img" />
        </section>

        <h3 className="tagline">I hope you find the movie you’re after!</h3>

        <section className="explore-section">
          <h2>Explore Movies</h2>
          <div className="movie-cards">
            {currentMovies.map(movie => (
              <div className="movie-card" key={movie.imdbID}>
                <img src={movie.poster} alt={`${movie.title} poster`} onError={(e) => e.target.style.display='none'} />
                <div className="movie-title">{movie.title}</div>
                <div className="movie-rating">⭐ {movie.imdbRating || 'N/A'}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        All data is from IMDB, Metacritic and RottenTomatoes. © 2025 Firstname Lastname
      </footer>
    </div>
  );
};

export default LandingPage;
