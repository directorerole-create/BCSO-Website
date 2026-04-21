import { SOP_DATA } from "@/lib/sop-data";
import { PoliciesClient } from "./PoliciesClient";

export default function PoliciesPage() {
  return <PoliciesClient sections={SOP_DATA} />;
}
