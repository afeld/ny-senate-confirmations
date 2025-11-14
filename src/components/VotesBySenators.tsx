import React from "react";
import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";

interface VotesBySenatorProps {
  votes: any[];
  showYear?: boolean;
  showConfirmed?: boolean;
}

const VotesBySenators: React.FC<VotesBySenatorProps> = ({
  votes,
  showYear = false,
  showConfirmed = false,
}) => {
  if (votes.length === 0) {
    return <p>No voting data available.</p>;
  }

  const buildColumns = () => {
    const columns: any[] = [
      {
        id: "id",
        hidden: true,
      },
      {
        name: showYear ? "Nominee" : "Senator",
        formatter: (cell: any, row: any) => {
          const id = row.cells[0].data;
          const urlType = showYear ? "nominees" : "senators";
          if (!id) return cell;
          return html(
            `<a href="/${urlType}/${id}" class="table-link">${cell}</a>`
          );
        },
      },
    ];

    if (showYear) {
      columns.push("Year");
    } else {
      columns.push({
        name: "Party",
        formatter: (cell: any) => {
          const party = String(cell).toLowerCase();
          return html(`<span class="party-${party}">${cell}</span>`);
        },
      });
      columns.push("District");
    }

    columns.push({
      name: "Vote",
      formatter: (cell: any) => {
        return html(
          `<span class="vote-${String(cell).toLowerCase()}">${cell}</span>`
        );
      },
    });

    if (showConfirmed) {
      columns.push("Confirmed?");
    }

    return columns;
  };

  return (
    <Grid
      data={votes}
      columns={buildColumns()}
      search={true}
      sort={true}
      pagination={{
        limit: showYear ? 20 : 63,
      }}
      fixedHeader={true}
    />
  );
};

export default VotesBySenators;
