import DeploymentDetailInterface from "@/features/dashboard/components/DeploymentDetailInterface";

export const metadata = {
  title: "Deployment Details | CONCH",
  description: "Review deployment settings, domains, runs, and isolated logs.",
};

export default async function DeploymentDetailPage({ params }) {
  const { projectId } = await params;

  return <DeploymentDetailInterface projectId={projectId} />;
}
