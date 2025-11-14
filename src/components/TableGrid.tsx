import React from "react";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";

interface TableGridProps {
  data: any[];
  columns: Array<
    string | { id?: string; name?: string; hidden?: boolean; formatter?: any }
  >;
}

const TableGrid: React.FC<TableGridProps> = ({ data, columns }) => {
  return (
    <Grid
      data={data}
      columns={columns}
      search={true}
      sort={true}
      pagination={{
        limit: 20,
      }}
      fixedHeader={true}
    />
  );
};

export default TableGrid;
