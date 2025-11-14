import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AirtableService, { AirtableRecord } from "../services/airtable";
import VotesTable from "./VotesTable";

const SlateDetail: React.FC = () => {
  const { slateId } = useParams<{ slateId: string }>();
  const [slate, setSlate] = useState<AirtableRecord | null>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();

        // Load slate data
        const slates = await service.getRecordsFromTable("Slates");
        const foundSlate = slates.find((s) => s.id === slateId);
        setSlate(foundSlate || null);

        if (!foundSlate) {
          setLoading(false);
          return;
        }

        // Load all individual votes for this slate
        const allVotes = await service.getRecordsFromTable("Individual Votes");
        const slateVotes = allVotes.filter((vote) => {
          const voteSlateIds = vote.fields["Slate"] as string[] | undefined;
          return voteSlateIds && voteSlateIds.includes(slateId!);
        });

        // Load senators to get their names
        const senators = await service.getRecordsFromTable("Senators");
        const senatorsMap = new Map(senators.map((s) => [s.id, s]));

        // Transform votes for display
        const voteData = slateVotes.map((vote) => {
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

        // Sort by senator name
        voteData.sort((a, b) => String(a[1]).localeCompare(String(b[1])));

        setVotes(voteData);
      } catch (error) {
        console.error("Error loading slate details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slateId]);

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
              <strong>Ayes:</strong> {String(slate.fields["Ayes"])} |{" "}
              <strong>Nays:</strong> {String(slate.fields["Nays"] || 0)}
            </div>
          )}
        </div>
      </div>

      <h2>Senator Votes</h2>
      <VotesTable votes={votes} />
    </div>
  );
};

export default SlateDetail;
