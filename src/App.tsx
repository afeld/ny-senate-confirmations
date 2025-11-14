import React from "react";
import { Link, Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="app-title">
          <h1>NY Senate Confirmation Vote Data</h1>
        </Link>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
