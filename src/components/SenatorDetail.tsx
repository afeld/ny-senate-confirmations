import React from "react";
import { useParams, Link } from "react-router";
import { useRecordById, useSenatorVotes } from "../hooks/useAirtableData";
import VotesBySlates from "./VotesBySlates";
import VoteBar from "./VoteBar";

const SenatorDetail: React.FC = () => {
  const { senatorId } = useParams<{ senatorId: string }>();
  const { record: senator, loading } = useRecordById("Senators", senatorId);
  const { votes, loading: votesLoading } = useSenatorVotes(senatorId);

  if (loading) {
    return <div className="loading">Loading senator details...</div>;
  }

  if (!senator) {
    return <div className="error">Senator not found</div>;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/senators" className="back-link">
          ← Back to Senators
        </Link>
      </div>

      <div className="nominee-info-card">
        {senator.fields["Photo"] &&
          Array.isArray(senator.fields["Photo"]) &&
          senator.fields["Photo"][0] && (
            <img
              src={(senator.fields["Photo"] as any)[0].url}
              alt={senator.fields["Full Name"] as string}
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                borderRadius: "8px",
                marginBottom: "1rem",
                objectFit: "cover",
              }}
            />
          )}
        <h1>{senator.fields["Full Name"] as string}</h1>
        <div className="nominee-details">
          {senator.fields["Party"] && (
            <div>
              <strong>Party:</strong>{" "}
              <span
                className={`party-${String(
                  senator.fields["Party"]
                ).toLowerCase()}`}
              >
                {String(senator.fields["Party"])}
              </span>
            </div>
          )}
          {senator.fields["District"] && (
            <div>
              <strong>District:</strong> {String(senator.fields["District"])}
            </div>
          )}
          {senator.fields["Ayes"] !== undefined && (
            <div>
              <strong>Votes:</strong>
              <VoteBar
                ayes={Number(senator.fields["Ayes"] || 0)}
                nays={Number(senator.fields["Nays"] || 0)}
                abs={Number(senator.fields["Absent"] || 0)}
                exc={Number(senator.fields["Excused"] || 0)}
              />
            </div>
          )}
        </div>
      </div>

      <h2>Votes on Slates</h2>
      {votesLoading ? (
        <div className="loading">Loading votes...</div>
      ) : votes.length === 0 ? (
        <p>No voting data available for this senator.</p>
      ) : (
        <VotesBySlates votes={votes} />
      )}
    </div>
  );
};

export default SenatorDetail;
