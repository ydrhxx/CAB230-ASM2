// Import necessary modules from React and React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the AuthProvider to handle login state globally
import { AuthProvider } from './components/AuthContext';

// Import your shared components
import Navbar from './components/Navbar';

// Import all your page components
import LandingPage from './pages/LandingPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetails from './pages/MovieDetails';
import PersonDetails from './pages/PersonDetails';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      {/* Provide authentication context to the entire app */}
      <AuthProvider>
        {/* Navigation bar appears on all pages */}
        <Navbar />

        {/* Define all application routes here */}
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />

          {/* Movies list page */}
          <Route path="/movies" element={<MoviesPage />} />

          {/* Individual movie details */}
          <Route path="/movies/:imdbID" element={<MovieDetails />} />

          {/* Person (actor/director) details */}
          <Route path="/people/:personID" element={<PersonDetails />} />

          {/* Register and login pages */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
