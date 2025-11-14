import React from "react";
import { Link } from "react-router-dom";
import { AirtableRecord } from "../services/airtable";

interface TableListProps {
  allData: Map<string, AirtableRecord[]>;
}

const TableList: React.FC<TableListProps> = ({ allData }) => {
  const tables = Array.from(allData.keys());

  if (tables.length === 0) {
    return (
      <div className="no-tables">
        <h2>No Tables Found</h2>
        <p>
          Please configure your table names in{" "}
          <code>src/services/airtable.ts</code>.
        </p>
        <p>
          Make sure your <code>.env</code> file contains:
          <br />
          <code>REACT_APP_AIRTABLE_API_KEY</code>
          <br />
          <code>REACT_APP_AIRTABLE_BASE_ID</code>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Tables</h2>
      <div className="table-list">
        {tables.map((tableName) => {
          const recordCount = allData.get(tableName)?.length || 0;
          return (
            <Link
              key={tableName}
              to={`/table/${encodeURIComponent(tableName)}`}
              className="table-card"
            >
              <h2>{tableName}</h2>
              <div className="record-count">
                {recordCount} {recordCount === 1 ? "record" : "records"}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TableList;
