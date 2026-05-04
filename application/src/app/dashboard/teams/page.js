import DashboardInterface from "@/features/dashboard/components/DashboardInterface";

export const metadata = {
  title: "Teams | CONCH",
  description: "Add employees and build responder teams for incidents.",
};

export default function DashboardTeamsPage() {
  return <DashboardInterface view="teams" />;
}
