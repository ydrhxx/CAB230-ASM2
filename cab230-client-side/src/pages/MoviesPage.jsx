import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import '../components/MoviesPage.css';

const MoviesPage = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    try {
      let url = `http://4.237.58.241:3000/movies/search?page=${page}`;
      if (title) url += `&title=${encodeURIComponent(title)}`;
      if (year) url += `&year=${year}`;

      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.data);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  return (
    <>
      <Navbar />
      <div className="movies-page">
        <h2>Movies</h2>
        <form className="movie-search-form" onSubmit={handleSubmit}>
          <label>
            Movies containing the text:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Star Wars"
            />
          </label>

          <label>
            From:
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Any year</option>
              {Array.from({ length: 2023 - 1990 + 1 }, (_, i) => (
                <option key={i} value={1990 + i}>{1990 + i}</option>
              ))}
            </select>
          </label>

          <button type="submit">Search</button>
        </form>

        <p>Showing {movies.length} of {total} results</p>

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
            {movies.map((movie) => (
              <tr key={movie.imdbID}>
                <td>
                    <Link to={`/movies/${movie.imdbID}`}>{movie.title}</Link>
                </td>
                <td>{movie.year}</td>
                <td>{movie.imdbRating}</td>
                <td>{movie.rottenTomatoesRating}</td>
                <td>{movie.metacriticRating || '-'}</td>
                <td>{movie.classification}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            &lt; Prev
          </button>
          <span> Page {page} </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={movies.length < 100}>
            Next &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default MoviesPage;
