import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AirtableService, { AirtableRecord } from "../services/airtable";
import VotesBySenators from "./VotesBySenators";
import VoteBar from "./VoteBar";

const NomineeDetail: React.FC = () => {
  const { nomineeId } = useParams<{ nomineeId: string }>();
  const [nominee, setNominee] = useState<AirtableRecord | null>(null);
  const [position, setPosition] = useState<AirtableRecord | null>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votesLoading, setVotesLoading] = useState(true);

  useEffect(() => {
    const loadNominee = async () => {
      try {
        const service = new AirtableService();

        // Load nominee data
        const nominees = await service.getRecordsFromTable("Nominees");
        const foundNominee = nominees.find((n) => n.id === nomineeId);
        setNominee(foundNominee || null);

        if (!foundNominee) {
          setLoading(false);
          return;
        }

        // Load position data
        const positionIds = foundNominee.fields["Position"] as
          | string[]
          | undefined;
        if (positionIds && positionIds.length > 0) {
          const positions = await service.getRecordsFromTable("Positions");
          const foundPosition = positions.find((p) => p.id === positionIds[0]);
          setPosition(foundPosition || null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading nominee details:", error);
        setLoading(false);
      }
    };

    loadNominee();
  }, [nomineeId]);

  useEffect(() => {
    const loadVotes = async () => {
      if (!nominee) return;

      try {
        const service = new AirtableService();

        // Get the slate ID(s) from the nominee
        const slateIds = nominee.fields["Slate"] as string[] | undefined;

        if (!slateIds || slateIds.length === 0) {
          setVotesLoading(false);
          return;
        }

        // Load all individual votes
        const allVotes = await service.getRecordsFromTable("Individual Votes");

        // Load all senators for vote details
        const senators = await service.getRecordsFromTable("Senators");
        const senatorsMap = new Map(senators.map((s) => [s.id, s]));

        // Filter votes for this slate
        const relevantVotes = allVotes.filter((vote) => {
          const voteSlateIds = vote.fields["Slate"] as string[] | undefined;
          return (
            voteSlateIds && voteSlateIds.some((id) => slateIds.includes(id))
          );
        });

        // Transform votes for display
        const voteData = relevantVotes.map((vote) => {
          const senatorIds = vote.fields["Senator"] as string[] | undefined;
          const senatorId = senatorIds?.[0];
          const senator = senatorId ? senatorsMap.get(senatorId) : null;

          return [
            senatorId,
            senator?.fields["Full Name"] || "Unknown",
            senator?.fields["Party"] || "",
            senator?.fields["District"] || "",
            vote.fields["Vote"] || "",
          ];
        });

        // Sort by senator name (index 1 now)
        voteData.sort((a, b) => String(a[1]).localeCompare(String(b[1])));

        setVotes(voteData);
      } catch (error) {
        console.error("Error loading votes:", error);
      } finally {
        setVotesLoading(false);
      }
    };

    loadVotes();
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
