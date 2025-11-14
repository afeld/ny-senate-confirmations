import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AirtableService, { AirtableRecord } from "./services/airtable";
import TableList from "./components/TableList";
import TableView from "./components/TableView";
import RecordDetail from "./components/RecordDetail";
import "./App.css";

function App() {
  const [airtableService] = useState(() => new AirtableService());
  const [allData, setAllData] = useState<Map<string, AirtableRecord[]>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await airtableService.getAllData();
      setAllData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Loading Airtable data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

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
            <Route path="/" element={<TableList allData={allData} />} />
            <Route
              path="/table/:tableName"
              element={<TableView allData={allData} />}
            />
            <Route
              path="/table/:tableName/record/:recordId"
              element={
                <RecordDetail
                  allData={allData}
                  airtableService={airtableService}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
