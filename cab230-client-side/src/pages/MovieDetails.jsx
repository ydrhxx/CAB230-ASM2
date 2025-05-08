// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../components/MovieDetails.css';

const MovieDetails = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://4.237.58.241:3000/movies/data/${imdbID}`);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [imdbID]);

  if (loading) return <div>Loading movie details...</div>;
  if (!movie) return <div>Movie not found.</div>;

  const ratings = {};
  movie.ratings?.forEach(r => {
    ratings[r.source] = r.value;
  });

  return (
    <>
      <div className="movie-details-container">
        <div className="movie-header">
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p><strong>Released in:</strong> {movie.year}</p>
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Genres:</strong> {movie.genres?.map((g, i) => (
              <span key={i} className={`genre-tag genre-${g.toLowerCase()}`}>{g}</span>
            ))}</p>
            <p><strong>Country:</strong> <span className="flag"></span> {movie.country}</p>
            <p><strong>Box Office:</strong> ${movie.boxoffice?.toLocaleString()}</p>
            <p className="movie-plot"><em>{movie.plot}</em></p>
          </div>
          <div className="movie-poster">
            <img src={movie.poster} alt={`${movie.title} poster`} onError={(e) => e.target.style.display='none'} />
          </div>
        </div>

        <div className="info-layout">
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
                <td><Link to={`/people/${p.id}`}>{p.name}</Link></td>
                <td>{p.characters?.join(', ') || '-'}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <div className="ratings-box">
            <p><strong>Internet Movie Database:</strong> {ratings['Internet Movie Database'] || '-'}</p>
            <p><strong>Rotten Tomatoes:</strong> {ratings['Rotten Tomatoes'] || '-'}</p>
            <p><strong>Metacritic:</strong> <strong>{ratings['Metacritic'] || '-'}</strong></p>
        </div>
        </div>
        <footer className="footer">
          <p>All data is from IMDB, Metacritic and RottenTomatoes.</p>
          <p>&copy; 2025 Firstname Lastname</p>
        </footer>
      </div>
    </>
  );
};

export default MovieDetails;
