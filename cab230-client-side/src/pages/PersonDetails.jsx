import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import '../components/PersonDetails.css'; 
import Chart from 'chart.js/auto'; // Required for Bar chart setup

const PersonDetails = () => {
  // Get person ID from route params and set up navigation
  const { personID } = useParams(); 
  const navigate = useNavigate();

  // Component state
  const [person, setPerson] = useState(null);       // Holds fetched person data
  const [error, setError] = useState('');            // Holds any error messages
  const [currentPage, setCurrentPage] = useState(1); // For pagination

  const bearerToken = localStorage.getItem('bearerToken'); // Token for auth-required endpoint

  // Fetch person details on load
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`http://4.237.58.241:3000/people/${personID}`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Include bearer token
          },
        });

        const data = await res.json();
        console.log('Fetched:', data);

        // Handle possible errors
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

        setPerson(data); // Set person data
      } catch (err) {
        console.error('Fetch failed:', err);
        setError('Something went wrong.');
      }
    };

    fetchPerson();
  }, [personID, bearerToken]);

  // Show error message with login redirect if needed
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

  // Show loading state until data is fetched
  if (!person) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  // Setup for paginated roles display
  const roles = Array.isArray(person.roles) ? person.roles : [];
  const rolesPerPage = 10;
  const start = (currentPage - 1) * rolesPerPage;
  const paginatedRoles = roles.slice(start, start + rolesPerPage);
  const totalPages = Math.ceil(roles.length / rolesPerPage);

  // Prepare IMDb rating distribution buckets
  const ratingRanges = {
    '0-1': 0, '1-2': 0, '2-3': 0, '3-4': 0, '4-5': 0,
    '5-6': 0, '6-7': 0, '7-8': 0, '8-9': 0, '9-10': 0,
  };

  // Count ratings into ranges
  roles.forEach((role) => {
    const rating = role.imdbRating;
    if (typeof rating === 'number') {
      const bucket = `${Math.floor(rating)}-${Math.floor(rating) + 1}`;
      if (ratingRanges[bucket] !== undefined) {
        ratingRanges[bucket]++;
      }
    }
  });

  // Prepare chart data
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
    <div className="person-details-container">
        <h2>{person.name}</h2>
        <p>{person.birthYear || 'N/A'} - {person.deathYear || 'Present'}</p>

      {/* Role list table */}
      <table className="person-role-table">
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
            <tr key={index} style={{ textAlign: 'center' }}>
              <td>{role.category}</td>
              <td>
                {/* Fix: Link properly to /movies/:imdbID instead of /movie */}
                <Link to={`/movies/${role.movieId}`} style={{ color: '#0077cc' }}>
                  {role.movieName}
                </Link>
              </td>
              <td>{role.characters?.join(', ') || '-'}</td>
              <td>{role.imdbRating ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination buttons */}
        <div className="person-pagination">
        {Array.from({ length: totalPages }, (_, i) => (
            <button
            key={i + 1}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
            >
            {i + 1}
            </button>
        ))}
        </div>

        <div className="person-chart-container">
        <h3>IMDb Ratings at a Glance</h3>
        <Bar data={chartData} />
        </div>
    </div>
    );
};

export default PersonDetails;
