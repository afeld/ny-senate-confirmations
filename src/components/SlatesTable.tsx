import React from "react";
import DataTable, { html } from "./DataTable";

const SlatesTable: React.FC = () => {
  return (
    <DataTable
      tableName="Slates"
      transformRecord={(record) => [
        record.id,
        record.fields["Name"] || "",
        record.fields["Date"] || "",
        record.fields["Ayes"] || 0,
        record.fields["Nays"] || 0,
      ]}
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
              `<a href="/slates/${id}" class="table-link">${cell}</a>`
            );
          },
        },
        "Date",
        "Ayes",
        "Nays",
      ]}
      sortByIndex={1}
    />
  );
};

export default SlatesTable;
