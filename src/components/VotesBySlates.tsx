import React from "react";
import { html } from "gridjs";
import TableGrid from "./TableGrid";

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
      name: "Date",
      formatter: (cell: any, row: any) => {
        const id = row.cells[0].data;
        if (!id) return cell;
        return html(`<a href="/slates/${id}" class="table-link">${cell}</a>`);
      },
    },
    "Slate of Day",
    {
      name: "Vote",
      formatter: (cell: any) => {
        return html(
          `<span class="vote-${String(cell).toLowerCase()}">${cell}</span>`
        );
      },
    },
  ];

  return <TableGrid data={votes} columns={columns} />;
};

export default VotesBySlates;
