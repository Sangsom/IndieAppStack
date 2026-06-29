import { AdminState } from "@/components/admin/admin-states";

export default function AdminLoading() {
  return (
    <AdminState
      description="Loading the protected admin workspace."
      title="Preparing admin data"
      tone="loading"
    />
  );
}
