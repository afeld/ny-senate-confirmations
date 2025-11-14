import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { html } from "gridjs";
import AirtableService, { AirtableRecord } from "../services/airtable";
import VotesBySenators from "./VotesBySenators";
import VoteBar from "./VoteBar";
import TableGrid from "./TableGrid";

const SlateDetail: React.FC = () => {
  const { slateId } = useParams<{ slateId: string }>();
  const [slate, setSlate] = useState<AirtableRecord | null>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [nominees, setNominees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votesLoading, setVotesLoading] = useState(true);
  const [nomineesLoading, setNomineesLoading] = useState(true);

  useEffect(() => {
    const loadSlate = async () => {
      try {
        const service = new AirtableService();

        // Load slate data
        const slates = await service.getRecordsFromTable("Slates");
        const foundSlate = slates.find((s) => s.id === slateId);
        setSlate(foundSlate || null);
        setLoading(false);
      } catch (error) {
        console.error("Error loading slate details:", error);
        setLoading(false);
      }
    };

    loadSlate();
  }, [slateId]);

  useEffect(() => {
    const loadVotes = async () => {
      if (!slate) return;

      try {
        const service = new AirtableService();

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
        console.error("Error loading votes:", error);
      } finally {
        setVotesLoading(false);
      }
    };

    loadVotes();
  }, [slate, slateId]);

  useEffect(() => {
    const loadNominees = async () => {
      if (!slate) return;

      try {
        const service = new AirtableService();

        // Load nominees for this slate
        const slateNomineeIds =
          (slate.fields["Nominees"] as string[] | undefined) || [];
        const allNominees = await service.getRecordsFromTable("Nominees");
        const slateNominees = allNominees.filter((n) =>
          slateNomineeIds.includes(n.id)
        );

        // Load positions
        const allPositions = await service.getRecordsFromTable("Positions");
        const positionsMap = new Map(allPositions.map((p) => [p.id, p]));

        // Transform nominees for display
        const nomineeData = slateNominees.map((nominee) => {
          const positionIds =
            (nominee.fields["Position"] as string[] | undefined) || [];
          const positionId = positionIds[0];
          const position = positionId ? positionsMap.get(positionId) : null;

          return [
            nominee.id,
            nominee.fields["Full Name"] || "Unknown",
            position?.fields["Role"] || "",
            position?.fields["Organization"] || "",
            positionId,
          ];
        });

        // Sort by nominee name
        nomineeData.sort((a, b) => String(a[1]).localeCompare(String(b[1])));

        setNominees(nomineeData);
      } catch (error) {
        console.error("Error loading nominees:", error);
      } finally {
        setNomineesLoading(false);
      }
    };

    loadNominees();
  }, [slate]);

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
                return html(
                  `<a href="/nominees/${id}" class="table-link">${cell}</a>`
                );
              },
            },
            {
              name: "Role",
              formatter: (cell: any, row: any) => {
                const positionId = row.cells[4].data;
                if (!positionId || !cell) return cell;
                return html(
                  `<a href="/positions/${positionId}" class="table-link">${cell}</a>`
                );
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
