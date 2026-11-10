import { Badge } from "@/registry/akso/ui/badge";

/** Demo used by the docs page and by the e2e tests. */
export function BadgeDemo() {
  return (
    <div className="flex flex-col gap-4">
      <ul aria-label="Orders" className="flex flex-col gap-2">
        <li className="flex flex-wrap items-center gap-2">
          Order 1042 <Badge status="success">Shipped</Badge>
        </li>
        <li className="flex flex-wrap items-center gap-2">
          Order 1043 <Badge status="warning">Payment pending</Badge>
        </li>
        <li className="flex flex-wrap items-center gap-2">
          Order 1044 <Badge status="error">Cancelled</Badge>
        </li>
        <li className="flex flex-wrap items-center gap-2">
          Order 1045 <Badge status="info">Processing</Badge>
        </li>
      </ul>
      <p className="flex flex-wrap items-center gap-2">
        Release notes <Badge>New</Badge>
      </p>
    </div>
  );
}
