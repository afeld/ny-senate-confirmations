import React from "react";
import { html } from "gridjs";
import { useSlatesTableData } from "../hooks/useAirtableData";
import TableGrid from "./TableGrid";

const SlatesTable: React.FC = () => {
  const { data, loading } = useSlatesTableData();

  if (loading) {
    return <div className="loading">Loading slates...</div>;
  }

  return (
    <TableGrid
      data={data}
      columns={[
        {
          id: "id",
          hidden: true,
        },
        {
          name: "Date",
          formatter: (cell: any, row: any) => {
            const id = row.cells[0].data;
            return html(
              `<a href="/slates/${id}" class="table-link">${cell}</a>`
            );
          },
        },
        "Slate of Day",
        {
          name: "Positions",
          formatter: (cell: any) => html(cell),
        },
        "Ayes",
        "Nays",
      ]}
    />
  );
};

export default SlatesTable;
