import React from "react";
import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

interface VotesBySlatesProps {
  votes: any[];
}

const VotesBySlates: React.FC<VotesBySlatesProps> = ({ votes }) => {
  if (votes.length === 0) {
    return <p>No voting data available.</p>;
  }

  const columns = [
    {
      id: "id",
      hidden: true,
    },
    {
      name: "Slate",
      formatter: (cell: any, row: any) => {
        const id = row.cells[0].data;
        if (!id) return cell;
        return html(`<a href="/slates/${id}" class="table-link">${cell}</a>`);
      },
    },
    "Date",
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
      pagination={{
        limit: 20,
      }}
      fixedHeader={true}
    />
  );
};

export default VotesBySlates;
