import { DeptPoliciesClient } from "./DeptPoliciesClient";
import { DEPT_POLICIES } from "@/lib/dept-policies-data";

export default function DepartmentPoliciesPage() {
  return <DeptPoliciesClient policies={DEPT_POLICIES} />;
}
