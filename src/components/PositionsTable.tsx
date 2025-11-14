import React from "react";
import DataTable, { html } from "./DataTable";
import { linkGenerators } from "../utils/linkHelpers";

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
            return html(linkGenerators.position(id, cell));
          },
        },
        "Organization",
      ]}
      sortByIndex={2}
    />
  );
};

export default PositionsTable;
