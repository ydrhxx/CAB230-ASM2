// src/pages/MoviesPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import '../components/MoviesPage.css';

const MoviesPage = () => {
  // States for search filters and movie data
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(100); // Default items per page

  const observerRef = useRef();

  // Fetch movies from API
  const fetchMovies = useCallback(async () => {
    try {
      let url = `http://4.237.58.241:3000/movies/search?page=${page}&limit=${limit}`;
      if (title) url += `&title=${encodeURIComponent(title)}`;
      if (year) url += `&year=${year}`;

      const res = await fetch(url);
      const data = await res.json();

      setMovies(prev => page === 1 ? data.data : [...prev, ...data.data]);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
  }, [page, title, year, limit]);

  // Re-fetch when page, title, year or limit changes
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Observe last movie to load more as user scrolls (infinite scroll)
  const lastMovieRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && movies.length < total) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [movies, total]);

  // Handle search form
  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setMovies([]);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
    setMovies([]);
  };

  return (
    <>


      <div className="movies-page">
        <h2>Movies</h2>

        {/* Search form */}
        <form className="movie-search-form" onSubmit={handleSubmit}>
        <div className="search-bar-container">
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Search movies..."
            className="search-input"
            />

            <select value={year} onChange={(e) => setYear(e.target.value)} className="search-select">
            <option value="">Any year</option>
            {Array.from({ length: 2023 - 1990 + 1 }, (_, i) => {
                const y = 1990 + i;
                return <option key={y} value={y}>{y}</option>;
            })}
            </select>

            <select value={limit} onChange={handleLimitChange} className="search-select">
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            </select>

            <button type="submit" className="search-button">Search</button>
        </div>
        </form>

        <div className="movies-container">
        {/* Search summary */}
        <p>Showing {movies.length} of {total} results</p>

        {/* Movie table */}
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
                        <td><Link to={`/movies/${movie.imdbID}`}>{movie.title}</Link></td>
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
    </>
  );
};

export default MoviesPage;
