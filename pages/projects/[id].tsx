import React from "react";
import Layout, { LayoutHead } from "../_common/Layout";

const ProjectPage: React.FC = () => <Layout>Thank you for funding!</Layout>;

export const Head = (): React.ReactElement => <LayoutHead title={"Project"} />;
export default ProjectPage;
