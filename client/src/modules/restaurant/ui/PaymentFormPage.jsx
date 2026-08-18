import EntityForm from "../../../core/crud-engine/EntityForm.jsx";
import paymentSchema from "../payment.schema.js";

export default function PaymentFormPage() {
  return <EntityForm schema={paymentSchema} apiPath="/restaurant/payments" basePath="/payments" />;
}
