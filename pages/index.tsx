import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import Landing, {
  Showcase,
  Splash,
} from "@dvargas92495/ui/dist/components/Landing";

const Home: React.FC = () => (
  <Layout>
    <Landing>
      <Splash
        title={"Become Empowered To Work In Public"}
        subtitle={
          "Gain access to a suite of tools that help you sustainably run publicly funded and publicly beneficial projects"
        }
        primaryHref={"login"}
        secondaryHref={"about"}
        Logo={() => <svg />}
      />
      <Showcase
        header={"Check out our current library of products!"}
        showCards={[
          {
            title: "Funding Board",
            description:
              "Raise funding for projects, allowing their backing dictate priority to your users.",
            image: "/logo.png",
          },
        ]}
      />
    </Landing>
  </Layout>
);

export const Head = () => <LayoutHead title={"Home"} />;

export default Home;
