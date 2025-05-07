import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const bearerToken = localStorage.getItem('bearerToken');

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`http://4.237.58.241:3000/people/${id}`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        const data = await res.json();
        console.log('Fetched:', data);

        if (!res.ok) {
          if (res.status === 401) {
            setError('You must be logged in to view this page.');
          } else if (res.status === 404) {
            setError('Person not found.');
          } else {
            setError(data.message || 'Unknown error.');
          }
          return;
        }

        setPerson(data);
      } catch (err) {
        console.error('Fetch failed:', err);
        setError('Something went wrong.');
      }
    };

    fetchPerson();
  }, [id, bearerToken]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>{error}</h2>
        {error.includes('logged in') && (
          <button onClick={() => navigate('/login')}>Go to Login</button>
        )}
      </div>
    );
  }

  if (!person) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  const roles = Array.isArray(person.roles) ? person.roles : [];
  const rolesPerPage = 10;
  const start = (currentPage - 1) * rolesPerPage;
  const paginatedRoles = roles.slice(start, start + rolesPerPage);
  const totalPages = Math.ceil(roles.length / rolesPerPage);

  const ratingRanges = {
    '0-1': 0, '1-2': 0, '2-3': 0, '3-4': 0, '4-5': 0,
    '5-6': 0, '6-7': 0, '7-8': 0, '8-9': 0, '9-10': 0,
  };

  roles.forEach((role) => {
    const rating = role.imdbRating;
    if (typeof rating === 'number') {
      const bucket = `${Math.floor(rating)}-${Math.floor(rating) + 1}`;
      if (ratingRanges[bucket] !== undefined) {
        ratingRanges[bucket]++;
      }
    }
  });

  const chartData = {
    labels: Object.keys(ratingRanges),
    datasets: [
      {
        label: 'IMDb Ratings',
        data: Object.values(ratingRanges),
        backgroundColor: 'steelblue',
      },
    ],
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{person.name}</h2>
      <p>{person.birthYear || 'N/A'} - {person.deathYear || 'Present'}</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#003366', color: 'white' }}>
            <th>Role</th>
            <th>Movie</th>
            <th>Characters</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRoles.map((role, index) => (
            <tr key={index} style={{ textAlign: 'center' }}>
              <td>{role.category}</td>
              <td>
                <a href={`/movie/${role.movieId}`} style={{ color: '#0077cc' }}>
                  {role.movieName}
                </a>
              </td>
              <td>{role.characters?.join(', ') || '-'}</td>
              <td>{role.imdbRating ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: '0 5px',
              padding: '0.5rem 1rem',
              backgroundColor: currentPage === i + 1 ? '#003366' : '#ccc',
              color: currentPage === i + 1 ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div style={{ width: '90%', marginTop: '2rem' }}>
        <h3>IMDb Ratings at a Glance</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default PersonDetails;
