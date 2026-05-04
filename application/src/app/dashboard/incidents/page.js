import DashboardInterface from "@/features/dashboard/components/DashboardInterface";

export const metadata = {
  title: "Incidents | CONCH",
  description: "Assign teams, edit timelines, track developer updates, and generate postmortems.",
};

export default function DashboardIncidentsPage() {
  return <DashboardInterface view="incidents" />;
}
