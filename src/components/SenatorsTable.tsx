import React, { useEffect, useState } from "react";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import AirtableService from "../services/airtable";

const SenatorsTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();
        const records = await service.getRecordsFromTable("Senators");

        // Transform records for Grid.js
        const tableData = records.map((record) => [
          record.fields["Full Name"] || "",
          record.fields["Party"] || "",
          record.fields["District"] || "",
          record.fields["% Aye"]
            ? `${Math.round((record.fields["% Aye"] as number) * 100)}%`
            : "",
          record.fields["% Nay"]
            ? `${Math.round((record.fields["% Nay"] as number) * 100)}%`
            : "",
          record.fields["Number of Votes"] || 0,
        ]);

        setData(tableData);
      } catch (error) {
        console.error("Error loading senators:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading senators...</div>;
  }

  return (
    <div>
      <h2>Senators</h2>
      <Grid
        data={data}
        columns={["Name", "Party", "District", "% Aye", "% Nay", "# Votes"]}
        search={true}
        sort={true}
        pagination={{
          limit: 20,
        }}
      />
    </div>
  );
};

export default SenatorsTable;
