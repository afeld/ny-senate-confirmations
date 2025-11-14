import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import AirtableService, { AirtableRecord } from "../services/airtable";

const NomineeDetail: React.FC = () => {
  const { nomineeId } = useParams<{ nomineeId: string }>();
  const [nominee, setNominee] = useState<AirtableRecord | null>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
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

        // Get the slate ID(s) from the nominee
        const slateIds = foundNominee.fields["Slate"] as string[] | undefined;

        if (!slateIds || slateIds.length === 0) {
          setLoading(false);
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
            senator?.fields["Full Name"] || "Unknown",
            senator?.fields["Party"] || "",
            senator?.fields["District"] || "",
            vote.fields["Vote"] || "",
          ];
        });

        // Sort by senator name
        voteData.sort((a, b) => String(a[0]).localeCompare(String(b[0])));

        setVotes(voteData);
      } catch (error) {
        console.error("Error loading nominee details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [nomineeId]);

  if (loading) {
    return <div className="loading">Loading nominee details...</div>;
  }

  if (!nominee) {
    return <div className="error">Nominee not found</div>;
  }

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case "Aye":
        return "#27ae60";
      case "Nay":
        return "#e74c3c";
      case "Exc":
        return "#95a5a6";
      case "Abs":
        return "#95a5a6";
      default:
        return "#000";
    }
  };

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
              <strong>Ayes:</strong> {String(nominee.fields["Ayes"])} |{" "}
              <strong>Nays:</strong> {String(nominee.fields["Nays"] || 0)}
            </div>
          )}
        </div>
      </div>

      <h2>Senator Votes</h2>
      {votes.length === 0 ? (
        <p>No voting data available for this nominee.</p>
      ) : (
        <Grid
          data={votes}
          columns={[
            "Senator",
            "Party",
            "District",
            {
              name: "Vote",
              formatter: (cell: any) => {
                const color = getVoteColor(String(cell));
                return html(
                  `<span class="vote-${String(
                    cell
                  ).toLowerCase()}">${cell}</span>`
                );
              },
            },
          ]}
          search={true}
          sort={true}
          pagination={{
            limit: 63, // All senators fit on one page
          }}
        />
      )}
    </div>
  );
};

export default NomineeDetail;
