import React from "react";
import { Link, useParams } from "react-router";
import { html } from "gridjs";
import { useRecordById, usePositionNominees } from "../hooks/useAirtableData";
import TableGrid from "./TableGrid";
import { linkGenerators } from "../utils/linkHelpers";

const PositionDetail: React.FC = () => {
  const { positionId } = useParams<{ positionId: string }>();
  const { record: position, loading } = useRecordById("Positions", positionId);
  const { nominees, loading: nomineesLoading } = usePositionNominees(
    position,
    positionId
  );

  if (loading) {
    return <div className="loading">Loading position details...</div>;
  }

  if (!position) {
    return <div className="error">Position not found</div>;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/positions" className="back-link">
          ← Back to Positions
        </Link>
      </div>

      <div className="nominee-info-card">
        <h1>
          {position.fields["Role"] as string},{" "}
          {position.fields["Organization"] as string}
        </h1>
      </div>

      <h2>Nominees for this Position</h2>
      {nomineesLoading ? (
        <div className="loading">Loading nominees...</div>
      ) : nominees.length === 0 ? (
        <p>No nominees found for this position.</p>
      ) : (
        <TableGrid
          data={nominees}
          columns={[
            {
              id: "id",
              hidden: true,
            },
            {
              name: "Nominee",
              formatter: (cell: any, row: any) => {
                const id = row.cells[0].data;
                return html(linkGenerators.nominee(id, cell));
              },
            },
            "Year",
            {
              name: "Confirmed?",
              formatter: (cell: any) => {
                const value = Array.isArray(cell) ? cell[0] : cell;
                const className =
                  value === "Yes"
                    ? "confirmed-yes"
                    : value === "No"
                    ? "confirmed-no"
                    : "";
                return html(`<span class="${className}">${value}</span>`);
              },
            },
            "Ayes",
            "Nays",
          ]}
        />
      )}
    </div>
  );
};

export default PositionDetail;
