import React, { useEffect, useState } from "react";
import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import AirtableService from "../services/airtable";

const NomineesTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();
        const records = await service.getRecordsFromTable("Nominees");

        // Transform records for Grid.js with clickable links
        const tableData = records.map((record) => [
          record.id,
          record.fields["Full Name"] || "",
          record.fields["Year"] || "",
          record.fields["Confirmed?"] || "",
          record.fields["Ayes"] || 0,
          record.fields["Nays"] || 0,
        ]);

        setData(tableData);
      } catch (error) {
        console.error("Error loading nominees:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading nominees...</div>;
  }

  return (
    <div>
      <h2>Nominees</h2>
      <Grid
        data={data}
        columns={[
          {
            id: "id",
            hidden: true,
          },
          {
            name: "Name",
            formatter: (cell: any, row: any) => {
              const id = row.cells[0].data;
              return html(
                `<a href="/nominees/${id}" style="color: #3498db; text-decoration: none;">${cell}</a>`
              );
            },
          },
          "Year",
          "Confirmed?",
          "Ayes",
          "Nays",
        ]}
        search={true}
        sort={true}
        pagination={{
          limit: 20,
        }}
      />
    </div>
  );
};

export default NomineesTable;
