import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SenatorsTable from "./components/SenatorsTable";
import NomineesTable from "./components/NomineesTable";
import NomineeDetail from "./components/NomineeDetail";
import SenatorDetail from "./components/SenatorDetail";
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
                  <nav className="main-nav">
                    <Link to="/senators" className="nav-link">
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
            <Route path="/senators/:senatorId" element={<SenatorDetail />} />
            <Route path="/nominees" element={<NomineesTable />} />
            <Route path="/nominees/:nomineeId" element={<NomineeDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
