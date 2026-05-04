import DashboardInterface from "@/features/dashboard/components/DashboardInterface";

export const metadata = {
  title: "Logs | CONCH",
  description: "Review captured errors, AI severity, root cause, and probable solutions.",
};

export default function DashboardLogsPage() {
  return <DashboardInterface view="logs" />;
}
