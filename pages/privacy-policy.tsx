import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import PrivacyPolicy from "@dvargas92495/ui/dist/components/PrivacyPolicy";

const PrivacyPolicyPage: React.FunctionComponent = () => (
  <Layout>
    <PrivacyPolicy name={"workinpublic-io"} domain={"workinpublic.io"} />
  </Layout>
);

export const Head = (): React.ReactElement => (
  <LayoutHead title={"Privacy Policy"} />
);
export default PrivacyPolicyPage;