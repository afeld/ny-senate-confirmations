import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { html } from "gridjs";
import AirtableService, { AirtableRecord } from "../services/airtable";
import TableGrid from "./TableGrid";

const PositionDetail: React.FC = () => {
  const { positionId } = useParams<{ positionId: string }>();
  const [position, setPosition] = useState<AirtableRecord | null>(null);
  const [nominees, setNominees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nomineesLoading, setNomineesLoading] = useState(true);

  useEffect(() => {
    const loadPosition = async () => {
      try {
        const service = new AirtableService();

        // Load position data
        const positions = await service.getRecordsFromTable("Positions");
        const foundPosition = positions.find((p) => p.id === positionId);
        setPosition(foundPosition || null);
        setLoading(false);
      } catch (error) {
        console.error("Error loading position details:", error);
        setLoading(false);
      }
    };

    loadPosition();
  }, [positionId]);

  useEffect(() => {
    const loadNominees = async () => {
      if (!position) return;

      try {
        const service = new AirtableService();

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
        console.error("Error loading nominees:", error);
      } finally {
        setNomineesLoading(false);
      }
    };

    loadNominees();
  }, [position, positionId]);

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
      {nomineesLoading ? (
        <div className="loading">Loading nominees...</div>
      ) : nominees.length === 0 ? (
        <p>No nominees found for this position.</p>
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
        />
      )}
    </div>
  );
};

export default PositionDetail;
