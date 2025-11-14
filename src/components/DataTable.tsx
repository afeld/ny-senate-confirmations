import React, { useEffect, useState } from "react";
import { html } from "gridjs";
import AirtableService from "../services/airtable";
import TableGrid from "./TableGrid";

interface DataTableProps {
  tableName: string;
  columns: Array<
    string | { id?: string; name?: string; hidden?: boolean; formatter?: any }
  >;
  transformRecord: (record: any) => any[];
  sortByIndex?: number;
}

const DataTable: React.FC<DataTableProps> = ({
  tableName,
  columns,
  transformRecord,
  sortByIndex = 0,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();
        const records = await service.getRecordsFromTable(tableName);

        // Transform records for Grid.js
        const tableData = records.map(transformRecord);

        // Sort by specified index
        tableData.sort((a, b) =>
          String(a[sortByIndex]).localeCompare(String(b[sortByIndex]))
        );

        setData(tableData);
      } catch (error) {
        console.error(`Error loading ${tableName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tableName, transformRecord, sortByIndex]);

  if (loading) {
    return <div>Loading {tableName.toLowerCase()}...</div>;
  }

  return (
    <div>
      <h2>{tableName}</h2>
      <TableGrid data={data} columns={columns} />
    </div>
  );
};

export default DataTable;
export { html };
