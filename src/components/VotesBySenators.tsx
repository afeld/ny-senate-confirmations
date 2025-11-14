import React from "react";
import { html } from "gridjs";
import TableGrid from "./TableGrid";

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

  return <TableGrid data={votes} columns={columns} />;
};

export default VotesBySenators;
