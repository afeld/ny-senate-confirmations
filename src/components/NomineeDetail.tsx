import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AirtableService, { AirtableRecord } from "../services/airtable";
import { useRecordById, useNomineeVotes } from "../hooks/useAirtableData";
import VotesBySenators from "./VotesBySenators";
import VoteBar from "./VoteBar";

const NomineeDetail: React.FC = () => {
  const { nomineeId } = useParams<{ nomineeId: string }>();
  const { record: nominee, loading } = useRecordById("Nominees", nomineeId);
  const [position, setPosition] = useState<AirtableRecord | null>(null);
  const { votes, loading: votesLoading } = useNomineeVotes(nominee);

  useEffect(() => {
    const loadPosition = async () => {
      if (!nominee) return;

      try {
        const service = new AirtableService();
        const positionIds = nominee.fields["Position"] as string[] | undefined;
        if (positionIds && positionIds.length > 0) {
          const positions = await service.getRecordsFromTable("Positions");
          const foundPosition = positions.find((p) => p.id === positionIds[0]);
          setPosition(foundPosition || null);
        }
      } catch (error) {
        console.error("Error loading position:", error);
      }
    };

    loadPosition();
  }, [nominee]);

  if (loading) {
    return <div className="loading">Loading nominee details...</div>;
  }

  if (!nominee) {
    return <div className="error">Nominee not found</div>;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/nominees" className="back-link">
          ← Back to Nominees
        </Link>
      </div>

      <div className="nominee-info-card">
        <h1>{nominee.fields["Full Name"] as string}</h1>
        <div className="nominee-details">
          {position && (
            <div>
              <strong>Position:</strong>{" "}
              <Link to={`/positions/${position.id}`} className="table-link">
                {String(position.fields["Name"])}
              </Link>
            </div>
          )}
          {nominee.fields["Year"] && (
            <div>
              <strong>Year:</strong> {String(nominee.fields["Year"])}
            </div>
          )}
          {nominee.fields["Confirmed?"] && (
            <div>
              <strong>Confirmed:</strong>{" "}
              <span
                className={`confirmed-status ${
                  nominee.fields["Confirmed?"] === "Yes"
                    ? "confirmed-yes"
                    : "confirmed-no"
                }`}
              >
                {String(nominee.fields["Confirmed?"])}
              </span>
            </div>
          )}
          {nominee.fields["Ayes"] !== undefined && (
            <div>
              <strong>Votes:</strong>
              <VoteBar
                ayes={Number(nominee.fields["Ayes"] || 0)}
                nays={Number(nominee.fields["Nays"] || 0)}
                abs={Number(nominee.fields["Abs"] || 0)}
                exc={Number(nominee.fields["Exc"] || 0)}
              />
            </div>
          )}
        </div>
      </div>

      <h2>Senator Votes</h2>
      {votesLoading ? (
        <div className="loading">Loading votes...</div>
      ) : votes.length === 0 ? (
        <p>No voting data available.</p>
      ) : (
        <VotesBySenators votes={votes} />
      )}
    </div>
  );
};

export default NomineeDetail;
