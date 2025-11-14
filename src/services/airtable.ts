import Airtable, { FieldSet, Records } from "airtable";
import { AIRTABLE_CONFIG } from "../config/airtable";

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
    Airtable.configure({
      apiKey: AIRTABLE_CONFIG.apiKey,
    });

    this.base = Airtable.base(AIRTABLE_CONFIG.baseId);
  }

  async getAllTables(): Promise<TableSchema[]> {
    // Note: Airtable API doesn't provide a way to list all tables programmatically
    // You'll need to manually configure the table names here
    // Alternatively, use the Airtable Metadata API if you have access

    const tableNames: string[] = [
      "Senators",
      "Nominees",
      "Positions",
      "Slates",
      "Individual Votes",
    ];

    return tableNames.map((name, index) => ({
      id: name,
      name: name,
    }));
  }

  private normalizeSingleSelectFields(
    fields: FieldSet,
    tableName: string
  ): FieldSet {
    const singleSelectFields: { [table: string]: string[] } = {
      Nominees: ["Confirmed?"],
      "Individual Votes": ["Vote"],
      Senators: ["Party"],
    };

    const fieldsToNormalize = singleSelectFields[tableName] || [];
    const normalizedFields = { ...fields };

    fieldsToNormalize.forEach((fieldName) => {
      const value = normalizedFields[fieldName];
      if (Array.isArray(value) && value.length > 0) {
        normalizedFields[fieldName] = value[0];
      }
    });

    return normalizedFields;
  }

  async getRecordsFromTable(tableName: string): Promise<AirtableRecord[]> {
    try {
      const records: Records<FieldSet> = await this.base(tableName)
        .select()
        .all();

      return records.map((record) => ({
        id: record.id,
        fields: this.normalizeSingleSelectFields(record.fields, tableName),
        tableName: tableName,
      }));
    } catch (error) {
      console.error(`Error fetching records from ${tableName}:`, error);
      console.error("Full error:", error);
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
        fields: this.normalizeSingleSelectFields(record.fields, tableName),
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
    console.log("Tables to fetch:", tables);
    const dataMap = new Map<string, AirtableRecord[]>();

    for (const table of tables) {
      try {
        console.log(`Fetching records for table: ${table.name}`);
        const records = await this.getRecordsFromTable(table.name);
        console.log(`Got ${records.length} records for ${table.name}`);
        dataMap.set(table.name, records);
      } catch (error) {
        console.error(`Failed to fetch data for table ${table.name}:`, error);
        dataMap.set(table.name, []);
      }
    }

    console.log("Final data map:", dataMap);
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
    for (const records of Array.from(allData.values())) {
      const found = records.find((r: AirtableRecord) => r.id === recordId);
      if (found) {
        return found;
      }
    }
    return null;
  }
}

export default AirtableService;
