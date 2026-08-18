import EntityList from "../../../core/crud-engine/EntityList.jsx";
import orderSchema from "../order.schema.js";

export default function OrderListPage() {
  return <EntityList schema={orderSchema} apiPath="/restaurant/orders" basePath="/orders" />;
}
