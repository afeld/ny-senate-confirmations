import React, { useEffect, useState } from "react";
import { html } from "gridjs";
import AirtableService from "../services/airtable";
import TableGrid from "./TableGrid";

const SlatesTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();
        const slates = await service.getRecordsFromTable("Slates");
        const positions = await service.getRecordsFromTable("Positions");

        const positionsMap = new Map(
          positions.map((p) => [
            p.id,
            {
              role: p.fields["Role"] as string,
              org: p.fields["Organization"] as string,
            },
          ])
        );

        const tableData = slates.map((record) => {
          const positionIds =
            (record.fields["Position(s)"] as string[] | undefined) || [];
          const uniquePositionIds = [...new Set(positionIds)];

          // Create array of position data for sorting
          const positionData = uniquePositionIds
            .map((id) => {
              const position = positionsMap.get(id);
              if (!position) return null;
              return { id, role: position.role, org: position.org };
            })
            .filter((p) => p !== null);

          // Sort by organization
          positionData.sort((a, b) => a!.org.localeCompare(b!.org));

          // Create links separated by line breaks
          const positionLinks = positionData
            .map(
              (p) =>
                `<a href="/positions/${p!.id}" class="table-link">${p!.role}, ${
                  p!.org
                }</a>`
            )
            .join("<br>");

          return [
            record.id,
            record.fields["Date"] || "",
            record.fields["Slate of Day"] || "",
            positionLinks || "",
            record.fields["Ayes"] || 0,
            record.fields["Nays"] || 0,
          ];
        });

        // Sort by date descending
        tableData.sort((a, b) => String(b[1]).localeCompare(String(a[1])));

        setData(tableData);
      } catch (error) {
        console.error("Error loading slates:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Loading slates...</div>;
  }

  return (
    <TableGrid
      data={data}
      columns={[
        {
          id: "id",
          hidden: true,
        },
        {
          name: "Date",
          formatter: (cell: any, row: any) => {
            const id = row.cells[0].data;
            return html(
              `<a href="/slates/${id}" class="table-link">${cell}</a>`
            );
          },
        },
        "Slate of Day",
        {
          name: "Positions",
          formatter: (cell: any) => html(cell),
        },
        "Ayes",
        "Nays",
      ]}
    />
  );
};

export default SlatesTable;
