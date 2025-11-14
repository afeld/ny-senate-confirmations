import React from "react";
import DataTable, { html } from "./DataTable";

const SlatesTable: React.FC = () => {
  return (
    <DataTable
      tableName="Slates"
      transformRecord={(record) => [
        record.id,
        record.fields["Date"] || "",
        record.fields["Slate of Day"] || "",
        record.fields["Ayes"] || 0,
        record.fields["Nays"] || 0,
      ]}
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
        "Ayes",
        "Nays",
      ]}
      sortByIndex={1}
    />
  );
};

export default SlatesTable;
