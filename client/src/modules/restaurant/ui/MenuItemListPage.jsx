import EntityList from "../../../core/crud-engine/EntityList.jsx";
import menuItemSchema from "../menuItem.schema.js";

export default function MenuItemListPage() {
  return <EntityList schema={menuItemSchema} apiPath="/restaurant/menu-items" basePath="/menu-items" />;
}
