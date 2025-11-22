import React from "react";
import { html } from "gridjs";
import TableGrid from "./TableGrid";
import { linkGenerators } from "../utils/linkHelpers";
import { renderToString } from "react-dom/server";
import Vote from "./Vote";

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
        return html(linkGenerators.slate(id, cell));
      },
    },
    "Slate of Day",
    {
      name: "Vote",
      formatter: (cell: any) =>
        html(renderToString(<Vote vote={String(cell)}></Vote>)),
    },
  ];

  return <TableGrid data={votes} columns={columns} />;
};

export default VotesBySlates;
