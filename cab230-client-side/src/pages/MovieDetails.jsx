import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../components/MovieDetails.css';
import { authFetch } from '../components/authFetch'; 

const MovieDetails = () => {
  const { imdbID } = useParams(); // Get IMDb ID from the URL
  const [movie, setMovie] = useState(null); // State to store movie data
  const [loading, setLoading] = useState(true); // State to control loading UI

  // Fetch movie data when component mounts or imdbID changes
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Use authFetch to include bearer token and auto-refresh if needed
        const res = await authFetch(`http://4.237.58.241:3000/movies/data/${imdbID}`);
        const data = await res.json();
        setMovie(data); // Store the movie data in state
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false); // Stop loading regardless of success/failure
      }
    };

    fetchMovie();
  }, [imdbID]);

  // Show loading message while data is being fetched
  if (loading) return <div>Loading movie details...</div>;

  // Show error message if movie was not found
  if (!movie) return <div>Movie not found.</div>;

  // Extract ratings into a more accessible object format
  const ratings = {};
  movie.ratings?.forEach(r => {
    ratings[r.source] = r.value;
  });

  return (
    <>
      <div className="movie-details-container">
        {/* Header section with movie information */}
        <div className="movie-header">
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p><strong>Released in:</strong> {movie.year}</p>
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>

            {/* Genre tags */}
            <p><strong>Genres:</strong> {movie.genres?.map((g, i) => (
              <span key={i} className={`genre-tag genre-${g.toLowerCase()}`}>{g}</span>
            ))}</p>

            <p><strong>Country:</strong> <span className="flag"></span> {movie.country}</p>
            <p><strong>Box Office:</strong> ${movie.boxoffice?.toLocaleString()}</p>
            <p className="movie-plot"><em>{movie.plot}</em></p>
          </div>

          {/* Movie poster with fallback to hide if not available */}
          <div className="movie-poster">
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        </div>

        {/* Layout container for cast and ratings */}
        <div className="info-layout">
          {/* Cast/crew table */}
          <table className="principals-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Name</th>
                <th>Characters</th>
              </tr>
            </thead>
            <tbody>
              {movie.principals?.map(p => (
                <tr key={p.id}>
                  <td>{p.category.charAt(0).toUpperCase() + p.category.slice(1)}</td>
                  {/* Link to person detail page */}
                  <td><Link to={`/people/${p.id}`}>{p.name}</Link></td>
                  <td>{p.characters?.join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Ratings section */}
          <div className="ratings-box">
            <p><strong>Internet Movie Database:</strong> {ratings['Internet Movie Database'] || '-'}</p>
            <p><strong>Rotten Tomatoes:</strong> {ratings['Rotten Tomatoes'] || '-'}</p>
            <p><strong>Metacritic:</strong> <strong>{ratings['Metacritic'] || '-'}</strong></p>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>All data is from IMDB, Metacritic and RottenTomatoes.</p>
          <p>&copy; 2025 Hardy Yuen</p>
        </footer>
      </div>
    </>
  );
};

export default MovieDetails;
