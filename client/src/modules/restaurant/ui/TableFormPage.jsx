import EntityForm from "../../../core/crud-engine/EntityForm.jsx";
import tableSchema from "../table.schema.js";

export default function TableFormPage() {
  return <EntityForm schema={tableSchema} apiPath="/restaurant/tables" basePath="/tables" />;
}
