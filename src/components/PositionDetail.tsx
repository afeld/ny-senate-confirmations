import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import AirtableService, { AirtableRecord } from "../services/airtable";

const PositionDetail: React.FC = () => {
  const { positionId } = useParams<{ positionId: string }>();
  const [position, setPosition] = useState<AirtableRecord | null>(null);
  const [nominees, setNominees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();

        // Load position data
        const positions = await service.getRecordsFromTable("Positions");
        const foundPosition = positions.find((p) => p.id === positionId);
        setPosition(foundPosition || null);

        if (!foundPosition) {
          setLoading(false);
          return;
        }

        // Load nominees for this position
        const allNominees = await service.getRecordsFromTable("Nominees");
        const positionNominees = allNominees.filter((nominee) => {
          const nomineePositionIds = nominee.fields["Position"] as
            | string[]
            | undefined;
          return nomineePositionIds && nomineePositionIds.includes(positionId!);
        });

        // Transform nominees for display
        const nomineeData = positionNominees.map((nominee) => [
          nominee.id,
          nominee.fields["Full Name"] || "Unknown",
          nominee.fields["Year"] || "",
          nominee.fields["Confirmed?"] || "",
          nominee.fields["Ayes"] || 0,
          nominee.fields["Nays"] || 0,
        ]);

        // Sort by year and name
        nomineeData.sort((a, b) => {
          const yearCompare = String(b[2]).localeCompare(String(a[2])); // Descending year
          if (yearCompare !== 0) return yearCompare;
          return String(a[1]).localeCompare(String(b[1])); // Ascending name
        });

        setNominees(nomineeData);
      } catch (error) {
        console.error("Error loading position details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [positionId]);

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
      {nominees.length === 0 ? (
        <p>No nominees found for this position.</p>
      ) : (
        <Grid
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
          search={true}
          sort={true}
          pagination={{
            limit: 20,
          }}
        />
      )}
    </div>
  );
};

export default PositionDetail;
