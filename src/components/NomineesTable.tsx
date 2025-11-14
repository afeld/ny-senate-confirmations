import React from "react";
import DataTable, { html } from "./DataTable";

const NomineesTable: React.FC = () => {
  return (
    <DataTable
      tableName="Nominees"
      title="Nominees"
      sortByIndex={1}
      transformRecord={(record) => [
        record.id,
        record.fields["Full Name"] || "",
        record.fields["Year"] || "",
        record.fields["Confirmed?"] || "",
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
              `<a href="/nominees/${id}" class="table-link">${cell}</a>`
            );
          },
        },
        "Year",
        "Confirmed?",
        "Ayes",
        "Nays",
      ]}
    />
  );
};

export default NomineesTable;
