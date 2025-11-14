import React from "react";
import { Link } from "react-router";

const Home: React.FC = () => {
  return (
    <div>
      <nav className="main-nav">
        <Link to="/senators" className="nav-link">
          Senators
        </Link>
        <Link to="/nominees" className="nav-link">
          Nominees
        </Link>
        <Link to="/slates" className="nav-link">
          Slates
        </Link>
        <Link to="/positions">Positions</Link>
      </nav>
      <h1>Senate Confirmations</h1>
      <p>Select a table from the navigation above.</p>
    </div>
  );
};

export default Home;
