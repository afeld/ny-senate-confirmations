import React from "react";
import { html } from "gridjs";
import { useNomineesTableData } from "../hooks/useAirtableData";
import TableGrid from "./TableGrid";

const NomineesTable: React.FC = () => {
  const { data, loading } = useNomineesTableData();

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
          {
            id: "slateId",
            hidden: true,
          },
          {
            name: "Slate",
            formatter: (cell: any, row: any) => {
              const slateId = row.cells[4].data;
              if (!slateId || !cell) return "";
              return html(
                `<a href="/slates/${slateId}" class="table-link">${cell}</a>`
              );
            },
          },
          {
            name: "Confirmed?",
            formatter: (cell: any) => {
              const className =
                cell === "Yes"
                  ? "confirmed-yes"
                  : cell === "No"
                  ? "confirmed-no"
                  : "";
              return html(`<span class="${className}">${cell}</span>`);
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
