import React from "react";
import DataTable, { html } from "./DataTable";
import { linkGenerators } from "../utils/linkHelpers";

const toPercent = (val: number) => `${Math.round(val * 100)}%`;

const SenatorsTable: React.FC = () => {
  return (
    <DataTable
      tableName="Senators"
      transformRecord={(record) => [
        record.id,
        record.fields["Full Name"] || "",
        record.fields["Party"] || "",
        record.fields["District"] || "",
        toPercent(record.fields["% Aye"] || 0),
        toPercent(record.fields["% Nay"] || 0),
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
            return html(linkGenerators.senator(id, cell));
          },
        },
        {
          name: "Party",
          formatter: (cell: any) => {
            const party = String(cell).toLowerCase();
            return html(`<span class="party-${party}">${cell}</span>`);
          },
        },
        "District",
        "% Aye",
        "% Nay",
      ]}
      sortByIndex={1}
    />
  );
};

export default SenatorsTable;
