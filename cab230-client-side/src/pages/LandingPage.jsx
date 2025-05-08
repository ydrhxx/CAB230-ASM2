// src/pages/LandingPage.jsx
import React from 'react';
import '../components/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      {/* Main content of the landing page */}
      <main className="landing-content">
        <section className="text-section">
          <h1>Your Name's Fabulous Movie Searching Website</h1>
          <h3>I hope you find the movie you're after!</h3>
        </section>

        {/* Optional: you can place a banner or logo image here */}
        <section className="image-section">
          {/* You can add an <img src="..." alt="..." /> here if needed */}
        </section>
      </main>

      {/* Footer with data source attribution */}
      <footer className="footer">
        All data is from IMDB, Metacritic and RottenTomatoes. © 2025 Your Name
      </footer>
    </div>
  );
};

export default LandingPage;
