import React from "react";
import { Link, useParams } from "react-router-dom";
import { html } from "gridjs";
import { linkGenerators } from "../utils/linkHelpers";
import {
  useRecordById,
  useSlateVotes,
  useSlateNominees,
} from "../hooks/useAirtableData";
import VotesBySenators from "./VotesBySenators";
import VoteBar from "./VoteBar";
import TableGrid from "./TableGrid";

const SlateDetail: React.FC = () => {
  const { slateId } = useParams<{ slateId: string }>();
  const { record: slate, loading } = useRecordById("Slates", slateId);
  const { votes, loading: votesLoading } = useSlateVotes(slateId, slate);
  const { nominees, loading: nomineesLoading } = useSlateNominees(
    slate,
    slateId
  );

  if (loading) {
    return <div className="loading">Loading slate details...</div>;
  }

  if (!slate) {
    return <div className="error">Slate not found</div>;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/slates" className="back-link">
          ← Back to Slates
        </Link>
      </div>

      <div className="nominee-info-card">
        <h1>{slate.fields["Name"] as string}</h1>
        <div className="nominee-details">
          {slate.fields["Date"] && (
            <div>
              <strong>Date:</strong> {String(slate.fields["Date"])}
            </div>
          )}
          {slate.fields["Slate of Day"] && (
            <div>
              <strong>Slate of Day:</strong>{" "}
              {String(slate.fields["Slate of Day"])}
            </div>
          )}
          {slate.fields["Ayes"] !== undefined && (
            <div>
              <strong>Votes:</strong>
              <VoteBar
                ayes={Number(slate.fields["Ayes"] || 0)}
                nays={Number(slate.fields["Nays"] || 0)}
                abs={Number(slate.fields["Abs"] || 0)}
                exc={Number(slate.fields["Exc"] || 0)}
              />
            </div>
          )}
        </div>
      </div>

      <h2>Nominees</h2>
      {nomineesLoading ? (
        <div className="loading">Loading nominees...</div>
      ) : nominees.length === 0 ? (
        <p>No nominees found for this slate.</p>
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
            {
              name: "Role",
              formatter: (cell: any, row: any) => {
                const positionId = row.cells[4].data;
                if (!positionId || !cell) return cell;
                return html(linkGenerators.position(positionId, cell));
              },
            },
            "Organization",
            {
              id: "positionId",
              hidden: true,
            },
          ]}
        />
      )}

      <h2>Senator Votes</h2>
      {votesLoading ? (
        <div className="loading">Loading votes...</div>
      ) : (
        <VotesBySenators votes={votes} />
      )}
    </div>
  );
};

export default SlateDetail;
