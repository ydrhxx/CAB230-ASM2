import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../components/authFetch';
import '../components/MoviesPage.css';

const MoviesPage = () => {
  // Search/filter input states
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  
  // Movie data and pagination states
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(100); // Results per page

  const observerRef = useRef(); // For infinite scroll detection

  // Function to fetch movies from API with filters and pagination
  const fetchMovies = useCallback(async () => {
    try {
      let url = `http://4.237.58.241:3000/movies/search?page=${page}&limit=${limit}`;
      if (title) url += `&title=${encodeURIComponent(title)}`;
      if (year) url += `&year=${year}`;

      // Use authFetch to attach token and refresh it if expired
      const res = await authFetch(url);
      const data = await res.json();

      // Reset vs append depending on page
      setMovies(prev => page === 1 ? data.data : [...prev, ...data.data]);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
  }, [page, title, year, limit]);

  // Refetch when dependencies change
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Infinite scroll handler using IntersectionObserver
  const lastMovieRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && movies.length < total) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [movies, total]);

  // On submit: reset results and trigger new fetch
  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setMovies([]);
  };

  // Change results-per-page setting
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
    setMovies([]);
  };

  return (
    <div className="movies-page">
      <h2>Movies</h2>

      {/* Search and filter form */}
      <form className="movie-search-form" onSubmit={handleSubmit}>
        <div className="search-bar-container">
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Search movies..."
            className="search-input"
          />

          {/* Year dropdown */}
          <select value={year} onChange={(e) => setYear(e.target.value)} className="search-select">
            <option value="">Any year</option>
            {Array.from({ length: 2023 - 1990 + 1 }, (_, i) => {
              const y = 1990 + i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>

          {/* Result limit selector */}
          <select value={limit} onChange={handleLimitChange} className="search-select">
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          {/* Search submit */}
          <button type="submit" className="search-button">Search</button>
        </div>
      </form>

      <div className="movies-container">
        <p>Showing {movies.length} of {total} results</p>

        <div className="table-wrapper">
          <table className="movie-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>IMDb</th>
                <th>Rotten Tomatoes</th>
                <th>Metacritic</th>
                <th>Classification</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => {
                const isLast = index === movies.length - 1;
                return (
                  <tr key={movie.imdbID} ref={isLast ? lastMovieRef : null}>
                    <td>
                      <Link to={`/movies/${movie.imdbID}`}>{movie.title}</Link>
                    </td>
                    <td>{movie.year}</td>
                    <td>{movie.imdbRating}</td>
                    <td>{movie.rottenTomatoesRating}</td>
                    <td>{movie.metacriticRating || '-'}</td>
                    <td>{movie.classification}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
