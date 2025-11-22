import React from "react";
import { html } from "gridjs";
import { useSlatesTableData } from "../hooks/useAirtableData";
import TableGrid from "./TableGrid";
import { linkGenerators } from "../utils/linkHelpers";
import { renderToString } from "react-dom/server";
import { ConfirmedDetail } from "./Confirmed";

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
            return html(linkGenerators.slate(id, cell));
          },
        },
        "Slate of Day",
        {
          name: "Positions",
          formatter: (cell: any) => html(cell),
        },
        {
          name: "Confirmed?",
          formatter: (cell: any) =>
            html(
              renderToString(
                <ConfirmedDetail confirmed={String(cell)}></ConfirmedDetail>
              )
            ),
        },
        "Ayes",
        "Nays",
      ]}
    />
  );
};

export default SlatesTable;
