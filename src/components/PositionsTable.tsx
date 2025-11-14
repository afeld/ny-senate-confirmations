import React from "react";
import DataTable, { html } from "./DataTable";

const PositionsTable: React.FC = () => {
  return (
    <DataTable
      tableName="Positions"
      transformRecord={(record) => [
        record.id,
        record.fields["Role"] || "",
        record.fields["Organization"] || "",
      ]}
      columns={[
        {
          id: "id",
          hidden: true,
        },
        {
          name: "Role",
          formatter: (cell: any, row: any) => {
            const id = row.cells[0].data;
            return html(
              `<a href="/positions/${id}" class="table-link">${cell}</a>`
            );
          },
        },
        "Organization",
      ]}
      sortByIndex={2}
    />
  );
};

export default PositionsTable;
