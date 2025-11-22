import { useEffect, useState } from "react";
import AirtableService, { AirtableRecord } from "../services/airtable";

export const useTableData = (tableName: string) => {
  const [data, setData] = useState<AirtableRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();
        const records = await service.getRecordsFromTable(tableName);
        setData(records);
      } catch (err) {
        console.error(`Error loading ${tableName}:`, err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tableName]);

  return { data, loading, error };
};

export const useRecordById = (
  tableName: string,
  recordId: string | undefined
) => {
  const [record, setRecord] = useState<AirtableRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!recordId) {
      setLoading(false);
      return;
    }

    const loadRecord = async () => {
      try {
        const service = new AirtableService();
        const records = await service.getRecordsFromTable(tableName);
        const foundRecord = records.find((r) => r.id === recordId);
        setRecord(foundRecord || null);
      } catch (err) {
        console.error(`Error loading record from ${tableName}:`, err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [tableName, recordId]);

  return { record, loading, error };
};

export const useNomineesTableData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const service = new AirtableService();
        const nominees = await service.getRecordsFromTable("Nominees");
        const positions = await service.getRecordsFromTable("Positions");
        const slates = await service.getRecordsFromTable("Slates");
        const positionsMap = new Map(positions.map((p) => [p.id, p]));
        const slatesMap = new Map(slates.map((s) => [s.id, s]));

        const tableData = nominees.map((record) => {
          const positionIds = record.fields["Position"] as string[] | undefined;
          const positionId = positionIds?.[0];
          const position = positionId ? positionsMap.get(positionId) : null;
          const positionName = position?.fields["Name"] || "";

          const slateIds = record.fields["Slate"] as string[] | undefined;
          const slateId = slateIds?.[0];
          const slate = slateId ? slatesMap.get(slateId) : null;
          const slateDate = slate?.fields["Date"] || "";

          return [
            record.id,
            record.fields["Full Name"] || "",
            positionId || "",
            positionName,
            slateId || "",
            slateDate,
            record.fields["Confirmed?"] || "",
            record.fields["Ayes"] || 0,
            record.fields["Nays"] || 0,
          ];
        });

        // Sort by name (index 1)
        tableData.sort((a, b) => String(a[1]).localeCompare(String(b[1])));

        setData(tableData);
      } catch (error) {
        console.error("Error loading nominees:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading };
};

export interface Position {
  id: string;
  role: string;
  org: string;
}

export type Positions = Position[];

export const useSlatesTableData = () => {
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
          const positionData: Positions = uniquePositionIds
            .map((id) => {
              const position = positionsMap.get(id);
              if (!position) return null;
              return { id, role: position.role, org: position.org };
            })
            .filter((p) => p !== null);

          // Sort by organization
          positionData.sort((a, b) => a!.org.localeCompare(b!.org));

          return [
            record.id,
            record.fields["Date"] || "",
            record.fields["Slate of Day"] || "",
            positionData,
            record.fields["Confirmed?"] || "",
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

  return { data, loading };
};

export const useSenatorVotes = (senatorId: string | undefined) => {
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!senatorId) {
      return;
    }

    setLoading(true);
    const loadVotes = async () => {
      try {
        const service = new AirtableService();
        const allVotes = await service.getRecordsFromTable("Individual Votes");
        const slates = await service.getRecordsFromTable("Slates");
        const slatesMap = new Map(slates.map((s) => [s.id, s]));

        // Filter votes for this senator
        const senatorVotes = allVotes.filter((vote) => {
          const voteSenatorIds = vote.fields["Senator"] as string[] | undefined;
          return voteSenatorIds && voteSenatorIds.includes(senatorId);
        });

        // Transform votes for display
        const voteData = senatorVotes.map((vote) => {
          const slateIds = vote.fields["Slate"] as string[] | undefined;
          const slateId = slateIds?.[0];
          const slate = slateId ? slatesMap.get(slateId) : null;

          return [
            slateId,
            slate?.fields["Date"] || "",
            slate?.fields["Slate of Day"] || "",
            vote.fields["Vote"] || "",
            slate?.fields["Confirmed?"] || "",
          ];
        });

        // Sort by date descending
        voteData.sort((a, b) => String(b[1]).localeCompare(String(a[1])));

        setVotes(voteData);
      } catch (error) {
        console.error("Error loading votes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVotes();
  }, [senatorId]);

  return { votes, loading };
};

export const useNomineeVotes = (nominee: AirtableRecord | null) => {
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nominee) {
      return;
    }

    setLoading(true);
    const loadVotes = async () => {
      try {
        const service = new AirtableService();
        const slateIds = nominee.fields["Slate"] as string[] | undefined;

        if (!slateIds || slateIds.length === 0) {
          setLoading(false);
          return;
        }

        const allVotes = await service.getRecordsFromTable("Individual Votes");
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

        // Sort by senator name
        voteData.sort((a, b) => String(a[1]).localeCompare(String(b[1])));

        setVotes(voteData);
      } catch (error) {
        console.error("Error loading votes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVotes();
  }, [nominee]);

  return { votes, loading };
};

export const useSlateVotes = (
  slateId: string | undefined,
  slate: AirtableRecord | null
) => {
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slate) {
      return;
    }

    setLoading(true);
    const loadVotes = async () => {
      try {
        const service = new AirtableService();
        const allVotes = await service.getRecordsFromTable("Individual Votes");
        const slateVotes = allVotes.filter((vote) => {
          const voteSlateIds = vote.fields["Slate"] as string[] | undefined;
          return voteSlateIds && voteSlateIds.includes(slateId!);
        });

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
        setLoading(false);
      }
    };

    loadVotes();
  }, [slate, slateId]);

  return { votes, loading };
};

export const useSlateNominees = (
  slate: AirtableRecord | null,
  slateId: string | undefined
) => {
  const [nominees, setNominees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slate) {
      return;
    }

    setLoading(true);
    const loadNominees = async () => {
      try {
        const service = new AirtableService();
        const slateNomineeIds =
          (slate.fields["Nominees"] as string[] | undefined) || [];
        const allNominees = await service.getRecordsFromTable("Nominees");
        const slateNominees = allNominees.filter((n) =>
          slateNomineeIds.includes(n.id)
        );

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
        setLoading(false);
      }
    };

    loadNominees();
  }, [slate, slateId]);

  return { nominees, loading };
};

export const usePositionNominees = (
  position: AirtableRecord | null,
  positionId: string | undefined
) => {
  const [nominees, setNominees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!position) {
      return;
    }

    setLoading(true);
    const loadNominees = async () => {
      try {
        const service = new AirtableService();
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
        setLoading(false);
      }
    };

    loadNominees();
  }, [position, positionId]);

  return { nominees, loading };
};
