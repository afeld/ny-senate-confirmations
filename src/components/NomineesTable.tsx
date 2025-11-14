import React from "react";
import { html } from "gridjs";
import { useNomineesTableData } from "../hooks/useAirtableData";
import TableGrid from "./TableGrid";
import { linkGenerators } from "../utils/linkHelpers";

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
              return html(linkGenerators.nominee(id, cell));
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
              return html(linkGenerators.position(positionId, cell));
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
              return html(linkGenerators.slate(slateId, cell));
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
