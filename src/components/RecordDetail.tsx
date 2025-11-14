import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AirtableService, { AirtableRecord } from "../services/airtable";

interface RecordDetailProps {
  allData: Map<string, AirtableRecord[]>;
  airtableService: AirtableService;
}

const RecordDetail: React.FC<RecordDetailProps> = ({
  allData,
  airtableService,
}) => {
  const { tableName, recordId } = useParams<{
    tableName: string;
    recordId: string;
  }>();
  const [record, setRecord] = useState<AirtableRecord | null>(null);
  const [linkedRecordsData, setLinkedRecordsData] = useState<
    Map<string, AirtableRecord[]>
  >(new Map());

  useEffect(() => {
    if (tableName && recordId) {
      const decodedTableName = decodeURIComponent(tableName);
      const records = allData.get(decodedTableName) || [];
      const found = records.find((r: AirtableRecord) => r.id === recordId);

      if (found) {
        setRecord(found);
        loadLinkedRecords(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName, recordId, allData]);

  const loadLinkedRecords = async (rec: AirtableRecord) => {
    const linkedMap = new Map<string, AirtableRecord[]>();

    for (const [fieldName, fieldValue] of Object.entries(rec.fields)) {
      if (airtableService.isLinkedRecord(fieldValue)) {
        const recordIds = fieldValue as string[];
        const linkedRecords: AirtableRecord[] = [];

        for (const linkedId of recordIds) {
          const linkedRecord = await airtableService.resolveLinkedRecord(
            linkedId,
            allData
          );
          if (linkedRecord) {
            linkedRecords.push(linkedRecord);
          }
        }

        if (linkedRecords.length > 0) {
          linkedMap.set(fieldName, linkedRecords);
        }
      }
    }

    setLinkedRecordsData(linkedMap);
  };

  if (!tableName || !recordId) {
    return <div className="error">Invalid record URL</div>;
  }

  if (!record) {
    return <div className="loading">Loading record...</div>;
  }

  const decodedTableName = decodeURIComponent(tableName);

  const renderFieldValue = (fieldName: string, fieldValue: any) => {
    if (fieldValue === null || fieldValue === undefined) {
      return <span className="field-value">—</span>;
    }

    // Check if this is a linked record field
    const linkedRecords = linkedRecordsData.get(fieldName);
    if (linkedRecords && linkedRecords.length > 0) {
      return (
        <div className="linked-records">
          {linkedRecords.map((linkedRecord) => {
            const displayText = getRecordDisplayName(linkedRecord);
            return (
              <Link
                key={linkedRecord.id}
                to={`/table/${encodeURIComponent(
                  linkedRecord.tableName
                )}/record/${linkedRecord.id}`}
                className="linked-record-link"
              >
                {displayText}
              </Link>
            );
          })}
        </div>
      );
    }

    // Handle arrays
    if (Array.isArray(fieldValue)) {
      if (fieldValue.length === 0)
        return <span className="field-value">—</span>;
      return (
        <div className="field-value">
          <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
            {fieldValue.map((item, index) => (
              <li key={index}>{renderSimpleValue(item)}</li>
            ))}
          </ul>
        </div>
      );
    }

    // Handle objects
    if (typeof fieldValue === "object") {
      return (
        <div className="field-value">
          <pre>{JSON.stringify(fieldValue, null, 2)}</pre>
        </div>
      );
    }

    // Handle simple values
    return <span className="field-value">{String(fieldValue)}</span>;
  };

  const renderSimpleValue = (value: any): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getRecordDisplayName = (rec: AirtableRecord): string => {
    // Try common field names for display
    const commonNames = ["Name", "Title", "name", "title", "label", "Label"];

    for (const fieldName of commonNames) {
      if (rec.fields[fieldName]) {
        return String(rec.fields[fieldName]);
      }
    }

    // Fall back to first field value or record ID
    const firstField = Object.entries(rec.fields)[0];
    if (firstField) {
      return String(firstField[1]);
    }

    return rec.id;
  };

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/">Tables</Link>
        <span>/</span>
        <Link to={`/table/${encodeURIComponent(decodedTableName)}`}>
          {decodedTableName}
        </Link>
        <span>/</span>
        <span>{getRecordDisplayName(record)}</span>
      </div>

      <div className="record-detail">
        <h2>{getRecordDisplayName(record)}</h2>

        <div className="field-list">
          {Object.entries(record.fields).map(([fieldName, fieldValue]) => (
            <div key={fieldName} className="field-item">
              <span className="field-label">{fieldName}</span>
              {renderFieldValue(fieldName, fieldValue)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;
