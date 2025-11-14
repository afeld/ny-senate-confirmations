import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AirtableService, { AirtableRecord } from "../services/airtable";
import VotesBySlates from "./VotesBySlates";
import VoteBar from "./VoteBar";

const SenatorDetail: React.FC = () => {
  const { senatorId } = useParams<{ senatorId: string }>();
  const [senator, setSenator] = useState<AirtableRecord | null>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votesLoading, setVotesLoading] = useState(true);

  useEffect(() => {
    const loadSenator = async () => {
      try {
        const service = new AirtableService();

        // Load senator data
        const senators = await service.getRecordsFromTable("Senators");
        const foundSenator = senators.find((s) => s.id === senatorId);
        setSenator(foundSenator || null);
        setLoading(false);
      } catch (error) {
        console.error("Error loading senator details:", error);
        setLoading(false);
      }
    };

    loadSenator();
  }, [senatorId]);

  useEffect(() => {
    const loadVotes = async () => {
      if (!senator) return;

      try {
        const service = new AirtableService();

        // Load all individual votes for this senator
        const allVotes = await service.getRecordsFromTable("Individual Votes");
        const senatorVotes = allVotes.filter((vote) => {
          const voteSenatorIds = vote.fields["Senator"] as string[] | undefined;
          return voteSenatorIds && voteSenatorIds.includes(senatorId!);
        });

        // Load slates to get slate information
        const slates = await service.getRecordsFromTable("Slates");
        const slatesMap = new Map(slates.map((s) => [s.id, s]));

        // Transform votes for display - group by slate
        const voteData = senatorVotes
          .map((vote) => {
            const slateIds = vote.fields["Slate"] as string[] | undefined;
            const slateId = slateIds?.[0];
            const slate = slateId ? slatesMap.get(slateId) : null;

            if (!slate) return null;

            return [
              slateId,
              slate.fields["Date"] || "",
              slate.fields["Slate of Day"] || "",
              vote.fields["Vote"] || "",
            ];
          })
          .filter((v) => v !== null) as any[];

        // Sort by date (descending)
        voteData.sort((a, b) => String(b[1]).localeCompare(String(a[1])));

        setVotes(voteData);
      } catch (error) {
        console.error("Error loading votes:", error);
      } finally {
        setVotesLoading(false);
      }
    };

    loadVotes();
  }, [senator, senatorId]);

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
