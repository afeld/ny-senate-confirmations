import React from "react";
import DataTable, { html } from "./DataTable";

const SenatorsTable: React.FC = () => {
  return (
    <DataTable
      tableName="Senators"
      transformRecord={(record) => [
        record.id,
        record.fields["Full Name"] || "",
        record.fields["Party"] || "",
        record.fields["District"] || "",
        record.fields["% Aye"]
          ? `${Math.round((record.fields["% Aye"] as number) * 100)}%`
          : "",
        record.fields["% Nay"]
          ? `${Math.round((record.fields["% Nay"] as number) * 100)}%`
          : "",
        record.fields["Number of Votes"] || 0,
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
              `<a href="/senators/${id}" class="table-link">${cell}</a>`
            );
          },
        },
        "Party",
        "District",
        "% Aye",
        "% Nay",
        "# Votes",
      ]}
      sortByIndex={1}
    />
  );
};

export default SenatorsTable;
