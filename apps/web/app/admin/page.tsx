import { AdminShell } from "@/components/admin-shell";
import { fetchAwards, fetchSummary } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [awards, summary] = await Promise.all([fetchAwards({ pageSize: 100 }), fetchSummary()]);

  return <AdminShell initialAwards={awards.items} summary={summary} />;
}
