import React from 'react';
import '../components/LandingPage.css';


const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      <nav className="navbar">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/movies">Movies</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>

      <main className="landing-content">
        <section className="text-section">
          <h1>Your Name's Fabulous Movie Searching Website</h1>
          <h3>I hope you find the movie you're after!</h3>
        </section>
        <section className="image-section">

        </section>
      </main>

      <footer className="footer">
        All data is from IMDB, Metacritic and RottenTomatoes. © 2025 Your Name
      </footer>
    </div>
  );
};

export default LandingPage;
