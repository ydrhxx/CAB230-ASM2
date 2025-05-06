import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
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

        if (res.status === 401) {
          setUnauthorized(true);
          return;
        }

        const data = await res.json();
        setPerson(data);
      } catch (error) {
        console.error('Error fetching person details:', error);
      }
    };

    fetchPerson();
  }, [id, bearerToken]);

  if (unauthorized) {
    return (
      <div>
        <h2>You must be logged in to view this page.</h2>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  if (!person) return <p>Loading...</p>;

  const rolesPerPage = 10;
  const start = (currentPage - 1) * rolesPerPage;
  const paginatedRoles = person.roles.slice(start, start + rolesPerPage);
  const totalPages = Math.ceil(person.roles.length / rolesPerPage);

  const ratingRanges = {
    '0-1': 0,
    '1-2': 0,
    '2-3': 0,
    '3-4': 0,
    '4-5': 0,
    '5-6': 0,
    '6-7': 0,
    '7-8': 0,
    '8-9': 0,
    '9-10': 0,
  };

  person.roles.forEach((role) => {
    const rating = role.imdbRating;
    if (rating !== null) {
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
    <div className="person-details">
      <h2>{person.name}</h2>
      <p>
        {person.birthYear || 'N/A'} - {person.deathYear || 'Present'}
      </p>

      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Movie</th>
            <th>Characters</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRoles.map((role, index) => (
            <tr key={index}>
              <td>{role.category}</td>
              <td>
                <a href={`/movie/${role.movieId}`}>{role.movieName}</a>
              </td>
              <td>{role.characters.join(', ') || '-'}</td>
              <td>{role.imdbRating}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} onClick={() => setCurrentPage(i + 1)} style={{ marginRight: 5 }}>
            {i + 1}
          </button>
        ))}
      </div>

      <div style={{ width: '80%', marginTop: '2rem' }}>
        <h3>IMDb Ratings at a Glance</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default PersonDetails;