import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import SenatorsTable from "./components/SenatorsTable";
import NomineesTable from "./components/NomineesTable";
import SlatesTable from "./components/SlatesTable";
import PositionsTable from "./components/PositionsTable";
import NomineeDetail from "./components/NomineeDetail";
import SenatorDetail from "./components/SenatorDetail";
import SlateDetail from "./components/SlateDetail";
import PositionDetail from "./components/PositionDetail";
import "./App.css";

function App() {
  return (
    // workaround for GitHub Pages
    <HashRouter>
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
              }
            />
            <Route path="/senators" element={<SenatorsTable />} />
            <Route path="/senators/:senatorId" element={<SenatorDetail />} />
            <Route path="/nominees" element={<NomineesTable />} />
            <Route path="/nominees/:nomineeId" element={<NomineeDetail />} />
            <Route path="/slates" element={<SlatesTable />} />
            <Route path="/slates/:slateId" element={<SlateDetail />} />
            <Route path="/positions" element={<PositionsTable />} />
            <Route path="/positions/:positionId" element={<PositionDetail />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
