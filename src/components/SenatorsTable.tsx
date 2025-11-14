import React from "react";
import DataTable from "./DataTable";

const SenatorsTable: React.FC = () => {
  return (
    <DataTable
      tableName="Senators"
      transformRecord={(record) => [
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
      columns={["Name", "Party", "District", "% Aye", "% Nay", "# Votes"]}
    />
  );
};

export default SenatorsTable;
