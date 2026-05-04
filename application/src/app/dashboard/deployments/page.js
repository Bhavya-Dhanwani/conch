import DeploymentInterface from "@/features/dashboard/components/DeploymentInterface";

export const metadata = {
  title: "Deployments | CONCH",
  description: "Import GitHub repositories, detect stacks, configure domains, and deploy sites.",
};

export default function DashboardDeploymentsPage() {
  return <DeploymentInterface />;
}
