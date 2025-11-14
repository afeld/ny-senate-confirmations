import React, { useEffect, useState } from "react";
import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import AirtableService from "../services/airtable";

interface DataTableProps {
  tableName: string;
  title: string;
  columns: Array<
    string | { id?: string; name?: string; hidden?: boolean; formatter?: any }
  >;
  transformRecord: (record: any) => any[];
  sortByIndex?: number;
}

const DataTable: React.FC<DataTableProps> = ({
  tableName,
  title,
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
    return <div>Loading {title.toLowerCase()}...</div>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <Grid
        data={data}
        columns={columns}
        search={true}
        sort={true}
        pagination={{
          limit: 20,
        }}
        fixedHeader={true}
      />
    </div>
  );
};

export default DataTable;
export { html };
