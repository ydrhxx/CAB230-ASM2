import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import '../components/PersonDetails.css'; 
import Chart from 'chart.js/auto'; 
import { authFetch } from '../components/authFetch';

const PersonDetails = () => {
  // Get person ID from the route parameters and set up navigation
  const { personID } = useParams(); 
  const navigate = useNavigate();

  // State variables for person data, error messages, and pagination
  const [person, setPerson] = useState(null);       
  const [error, setError] = useState('');            
  const [currentPage, setCurrentPage] = useState(1); 

  // Get the saved bearer token from localStorage for authenticated API access
  const bearerToken = localStorage.getItem('bearerToken'); 

  // Fetch person details from API when component mounts or personID changes
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await authFetch(`http://4.237.58.241:3000/people/${personID}`);

        const data = await res.json();
        console.log('Fetched:', data);

        // Handle possible error responses
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

        // If successful, update person state
        setPerson(data);
      } catch (err) {
        console.error('Fetch failed:', err);
        setError('Something went wrong.');
      }
    };

    fetchPerson();
  }, [personID]);

  // If there's an error, show a message and optionally redirect to login
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

  // Show loading message while fetching data
  if (!person) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  // Set up pagination for person roles
  const roles = Array.isArray(person.roles) ? person.roles : [];
  const rolesPerPage = 10;
  const start = (currentPage - 1) * rolesPerPage;
  const paginatedRoles = roles.slice(start, start + rolesPerPage);
  const totalPages = Math.ceil(roles.length / rolesPerPage);

  // Prepare rating distribution for the bar chart
  const ratingRanges = {
    '0-1': 0, '1-2': 0, '2-3': 0, '3-4': 0, '4-5': 0,
    '5-6': 0, '6-7': 0, '7-8': 0, '8-9': 0, '9-10': 0,
  };

  // Count IMDb ratings into their respective buckets
  roles.forEach((role) => {
    const rating = role.imdbRating;
    if (typeof rating === 'number') {
      const bucket = `${Math.floor(rating)}-${Math.floor(rating) + 1}`;
      if (ratingRanges[bucket] !== undefined) {
        ratingRanges[bucket]++;
      }
    }
  });

  // Define data for the chart component
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
      {/* Person name and life dates */}
      <h2>{person.name}</h2>
      <p>{person.birthYear || 'N/A'} - {person.deathYear || 'Present'}</p>

      {/* Table of roles the person has worked on */}
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
            <tr key={index}>
              <td>{role.category}</td>
              <td>
                {/* Link to the movie details page */}
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

      {/* Pagination controls */}
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

      {/* Bar chart showing IMDb rating distribution */}
      <div className="person-chart-container">
        <h3>IMDb Ratings at a Glance</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default PersonDetails;
