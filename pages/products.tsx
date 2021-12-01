import React from "react";
import H1 from "@dvargas92495/ui/dist/components/H1";
import H2 from "@dvargas92495/ui/dist/components/H2";
import Body from "@dvargas92495/ui/dist/components/Body";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Layout, { LayoutHead } from "./_common/Layout";

const ProductsPage: React.FunctionComponent = () => (
  <Layout>
    <div>
      <H1>Products</H1>
      <Body>
        Check out all of our different products and learn how they work! All
        products are accessible from the <Link href={"/user"}>user</Link> page
        once you've logged in.
      </Body>
      <Divider />
      <H2>Funding Board</H2>
      <Body>
        Are you a creator with a bunch of project ideas but not sure which one
        to work on? Then this product is for you!
      </Body>
      <Body>
        <b>First,</b> head to the dashboard and add all of your related project
        ideas to a funding board.
      </Body>
      <Body>
        <b>Next,</b> share your board to your community by sharing the public
        link itself or embedding the content into your website.
      </Body>
      <Body>
        <b>Then,</b> people who support you and derive value from your work will
        be able to choose which project to fund by committing an amount they
        choose.
      </Body>
      <Body>
        <b>Watch,</b> as your funding board then prioritizes projects based on a
        percentage of a funding target hit.
      </Body>
      <Body>
        <b>Finally,</b> complete the project at the top of your board and
        receive the fruits of your labor!
      </Body>
      <Body>Check out our demo below!</Body>
      <div
        style={{
          position: "relative",
          paddingBottom: "64.26282051282051%",
          height: 0,
        }}
      >
        <iframe
          src="https://www.loom.com/embed/3ada2dd101374d7fa04f9c978988604f"
          frameBorder="0"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </div>
      <Divider />
      <H2>More products coming soon!</H2>
    </div>
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"Products"} />;
export default ProductsPage;
