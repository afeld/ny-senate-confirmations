import React from "react";
import { Link, useParams } from "react-router-dom";
import { AirtableRecord } from "../services/airtable";

interface TableViewProps {
  allData: Map<string, AirtableRecord[]>;
}

const TableView: React.FC<TableViewProps> = ({ allData }) => {
  const { tableName } = useParams<{ tableName: string }>();

  if (!tableName) {
    return <div className="error">Table name not specified</div>;
  }

  const decodedTableName = decodeURIComponent(tableName);
  const records = allData.get(decodedTableName) || [];

  const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getFirstFewFields = (fields: any, limit: number = 3) => {
    const fieldEntries = Object.entries(fields);
    return fieldEntries.slice(0, limit);
  };

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/">Tables</Link>
        <span>/</span>
        <span>{decodedTableName}</span>
      </div>

      <h2>{decodedTableName}</h2>

      {records.length === 0 ? (
        <div className="error">No records found in this table</div>
      ) : (
        <div className="records-grid">
          {records.map((record) => (
            <Link
              key={record.id}
              to={`/table/${encodeURIComponent(decodedTableName)}/record/${
                record.id
              }`}
              className="record-card"
            >
              <div className="record-card-content">
                {getFirstFewFields(record.fields).map(
                  ([fieldName, fieldValue]) => (
                    <div key={fieldName} className="record-field">
                      <strong>{fieldName}:</strong>
                      <span>{getDisplayValue(fieldValue)}</span>
                    </div>
                  )
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableView;
