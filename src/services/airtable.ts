import Airtable, { FieldSet, Records } from "airtable";

export interface AirtableRecord {
  id: string;
  fields: FieldSet;
  tableName: string;
}

export interface TableSchema {
  name: string;
  id: string;
}

class AirtableService {
  private base: Airtable.Base;

  constructor() {
    const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
    const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      throw new Error(
        "Airtable API key and Base ID must be set in environment variables"
      );
    }

    Airtable.configure({
      apiKey: apiKey,
    });

    this.base = Airtable.base(baseId);
  }

  async getAllTables(): Promise<TableSchema[]> {
    // Note: Airtable API doesn't provide a way to list all tables programmatically
    // You'll need to manually configure the table names here
    // Alternatively, use the Airtable Metadata API if you have access

    const tableNames: string[] = [
      'Senators',
      'Nominees',
      'Positions',
      'Slates',
      'Individual Votes',
    ];

    return tableNames.map((name, index) => ({
      id: name,
      name: name,
    }));
  }

  async getRecordsFromTable(tableName: string): Promise<AirtableRecord[]> {
    try {
      const records: Records<FieldSet> = await this.base(tableName)
        .select({
          maxRecords: 100,
          view: "Grid view", // Adjust as needed
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        fields: record.fields,
        tableName: tableName,
      }));
    } catch (error) {
      console.error(`Error fetching records from ${tableName}:`, error);
      throw error;
    }
  }

  async getRecordById(
    tableName: string,
    recordId: string
  ): Promise<AirtableRecord | null> {
    try {
      const record = await this.base(tableName).find(recordId);
      return {
        id: record.id,
        fields: record.fields,
        tableName: tableName,
      };
    } catch (error) {
      console.error(
        `Error fetching record ${recordId} from ${tableName}:`,
        error
      );
      return null;
    }
  }

  async getAllData(): Promise<Map<string, AirtableRecord[]>> {
    const tables = await this.getAllTables();
    const dataMap = new Map<string, AirtableRecord[]>();

    for (const table of tables) {
      try {
        const records = await this.getRecordsFromTable(table.name);
        dataMap.set(table.name, records);
      } catch (error) {
        console.error(`Failed to fetch data for table ${table.name}:`, error);
        dataMap.set(table.name, []);
      }
    }

    return dataMap;
  }

  isLinkedRecord(value: any): boolean {
    return (
      Array.isArray(value) && value.length > 0 && typeof value[0] === "string"
    );
  }

  async resolveLinkedRecord(
    recordId: string,
    allData: Map<string, AirtableRecord[]>
  ): Promise<AirtableRecord | null> {
    // Search through all tables to find the record
    for (const [tableName, records] of allData.entries()) {
      const found = records.find((r) => r.id === recordId);
      if (found) {
        return found;
      }
    }
    return null;
  }
}

export default AirtableService;
