import React from "react";
import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

interface VotesBySenatorProps {
  votes: any[];
}

const VotesBySenators: React.FC<VotesBySenatorProps> = ({ votes }) => {
  if (votes.length === 0) {
    return <p>No voting data available.</p>;
  }

  const columns = [
    {
      id: "id",
      hidden: true,
    },
    {
      name: "Senator",
      formatter: (cell: any, row: any) => {
        const id = row.cells[0].data;
        if (!id) return cell;
        return html(`<a href="/senators/${id}" class="table-link">${cell}</a>`);
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
    {
      name: "Vote",
      formatter: (cell: any) => {
        return html(
          `<span class="vote-${String(cell).toLowerCase()}">${cell}</span>`
        );
      },
    },
  ];

  return (
    <Grid
      data={votes}
      columns={columns}
      search={true}
      sort={true}
      fixedHeader={true}
    />
  );
};

export default VotesBySenators;
