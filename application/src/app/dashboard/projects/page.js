import DashboardInterface from "@/features/dashboard/components/DashboardInterface";

export const metadata = {
  title: "Projects | CONCH",
  description: "Create monitored projects and manage CONCH package API keys.",
};

export default function DashboardProjectsPage() {
  return <DashboardInterface view="projects" />;
}
