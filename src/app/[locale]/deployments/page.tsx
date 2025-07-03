import type { Metadata } from "next";
import { DeployPage } from "src/components/DeployPage/DeployPage.component";
import { envUrl } from "src/utils/helpers";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: new URL(`${envUrl()}/deployments`),
    },
    robots: "noindex, nofollow",
    title: "Deployments | Delmarva Site Development",
  };
}

const Deployments = () => {
  return <DeployPage />;
};

export default Deployments;
