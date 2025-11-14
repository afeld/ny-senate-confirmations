import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AirtableService, { AirtableRecord } from "../services/airtable";
import VotesBySlates from "./VotesBySlates";

const SenatorDetail: React.FC = () => {
  const { senatorId } = useParams<{ senatorId: string }>();
  const [senator, setSenator] = useState<AirtableRecord | null>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();

        // Load senator data
        const senators = await service.getRecordsFromTable("Senators");
        const foundSenator = senators.find((s) => s.id === senatorId);
        setSenator(foundSenator || null);

        if (!foundSenator) {
          setLoading(false);
          return;
        }

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
              slate.fields["Slate ID"] || slate.fields["Date"] || slateId,
              slate.fields["Date"] || "",
              vote.fields["Vote"] || "",
            ];
          })
          .filter((v) => v !== null) as any[];

        // Sort by date (descending)
        voteData.sort((a, b) => String(b[2]).localeCompare(String(a[2])));

        setVotes(voteData);
      } catch (error) {
        console.error("Error loading senator details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [senatorId]);

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
          {senator.fields["Number of Votes"] !== undefined && (
            <div>
              <strong>Number of Votes:</strong>{" "}
              {String(senator.fields["Number of Votes"])}
            </div>
          )}
          {senator.fields["% Aye"] !== undefined && (
            <div>
              <strong>% Aye:</strong>{" "}
              {Math.round((senator.fields["% Aye"] as number) * 100)}% |{" "}
              <strong>% Nay:</strong>{" "}
              {Math.round((senator.fields["% Nay"] as number) * 100)}%
            </div>
          )}
        </div>
      </div>

      <h2>Votes on Slates</h2>
      {votes.length === 0 ? (
        <p>No voting data available for this senator.</p>
      ) : (
        <VotesBySlates votes={votes} />
      )}
    </div>
  );
};

export default SenatorDetail;
