import { PoliciesClient } from "@/app/policies/PoliciesClient";
import { DEPT_POLICIES_DATA } from "@/lib/sop-data";

export default function DepartmentPoliciesPage() {
  return <PoliciesClient sections={DEPT_POLICIES_DATA} />;
}
