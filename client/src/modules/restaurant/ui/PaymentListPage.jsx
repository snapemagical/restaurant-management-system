import EntityList from "../../../core/crud-engine/EntityList.jsx";
import paymentSchema from "../payment.schema.js";

export default function PaymentListPage() {
  return <EntityList schema={paymentSchema} apiPath="/restaurant/payments" basePath="/payments" />;
}
