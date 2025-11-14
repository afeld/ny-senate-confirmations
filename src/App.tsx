import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SenatorsTable from "./components/SenatorsTable";
import NomineesTable from "./components/NomineesTable";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" className="app-title">
            <h1>Airtable Data Viewer</h1>
          </Link>
        </header>
        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <nav style={{ marginBottom: "2rem" }}>
                    <Link to="/senators" style={{ marginRight: "1rem" }}>
                      Senators
                    </Link>
                    <Link to="/nominees">Nominees</Link>
                  </nav>
                  <h1>Senate Confirmations</h1>
                  <p>Select a table from the navigation above.</p>
                </div>
              }
            />
            <Route path="/senators" element={<SenatorsTable />} />
            <Route path="/nominees" element={<NomineesTable />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
