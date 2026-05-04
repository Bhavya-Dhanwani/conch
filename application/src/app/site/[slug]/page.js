import PublicSiteView from "@/features/deployment/PublicSiteView";

export const metadata = {
  title: "Deployed Site | CONCH",
  description: "Path-based deployment preview hosted by CONCH.",
};

export default async function PublicSitePage({ params }) {
  const { slug } = await params;

  return <PublicSiteView slug={slug} />;
}
