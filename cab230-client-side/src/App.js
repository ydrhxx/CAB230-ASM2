import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetails from './pages/MovieDetails';
import PersonDetails from './pages/PersonDetails';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <AuthProvider> {/* ✅ Provide login state to all components */}
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:imdbID" element={<MovieDetails />} />
          <Route path="/people/:personID" element={<PersonDetails />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;