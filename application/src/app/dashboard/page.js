import DashboardInterface from "@/features/dashboard/components/DashboardInterface";

export const metadata = {
  title: "Dashboard | CONCH",
  description: "Monitor CONCH projects, incidents, deployments, and AI triage.",
};

export default function DashboardPage() {
  return <DashboardInterface />;
}
