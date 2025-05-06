// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetails from './pages/MovieDetails';
import PersonDetails from './pages/PersonDetails';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:imdbID" element={<MovieDetails />} />
        <Route path="/people/:personID" element={<PersonDetails />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;