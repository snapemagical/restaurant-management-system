import EntityForm from "../../../core/crud-engine/EntityForm.jsx";
import menuItemSchema from "../menuItem.schema.js";

export default function MenuItemFormPage() {
  return <EntityForm schema={menuItemSchema} apiPath="/restaurant/menu-items" basePath="/menu-items" />;
}
