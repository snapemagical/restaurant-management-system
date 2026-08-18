import EntityList from "../../../core/crud-engine/EntityList.jsx";
import tableSchema from "../table.schema.js";

export default function TableListPage() {
  return <EntityList schema={tableSchema} apiPath="/restaurant/tables" basePath="/tables" />;
}
