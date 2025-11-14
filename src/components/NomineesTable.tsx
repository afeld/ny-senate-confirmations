import React, { useEffect, useState } from "react";
import { html } from "gridjs";
import AirtableService from "../services/airtable";
import TableGrid from "./TableGrid";

const NomineesTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();
        const nominees = await service.getRecordsFromTable("Nominees");
        const positions = await service.getRecordsFromTable("Positions");
        const positionsMap = new Map(positions.map((p) => [p.id, p]));

        const tableData = nominees.map((record) => {
          const positionIds = record.fields["Position"] as string[] | undefined;
          const positionId = positionIds?.[0];
          const position = positionId ? positionsMap.get(positionId) : null;
          const positionName = position?.fields["Name"] || "";

          return [
            record.id,
            record.fields["Full Name"] || "",
            positionId || "",
            positionName,
            record.fields["Year"] || "",
            record.fields["Confirmed?"] || "",
            record.fields["Ayes"] || 0,
            record.fields["Nays"] || 0,
          ];
        });

        // Sort by name (index 1)
        tableData.sort((a, b) => String(a[1]).localeCompare(String(b[1])));

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
      <TableGrid
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
                `<a href="/nominees/${id}" class="table-link">${cell}</a>`
              );
            },
          },
          {
            id: "positionId",
            hidden: true,
          },
          {
            name: "Position",
            formatter: (cell: any, row: any) => {
              const positionId = row.cells[2].data;
              if (!positionId || !cell) return "";
              return html(
                `<a href="/positions/${positionId}" class="table-link">${cell}</a>`
              );
            },
          },
          "Year",
          {
            name: "Confirmed?",
            formatter: (cell: any) => {
              const value = Array.isArray(cell) ? cell[0] : cell;
              const className =
                value === "Yes"
                  ? "confirmed-yes"
                  : value === "No"
                  ? "confirmed-no"
                  : "";
              return html(`<span class="${className}">${value}</span>`);
            },
          },
          "Ayes",
          "Nays",
        ]}
      />
    </div>
  );
};

export default NomineesTable;
