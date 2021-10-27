import React from "react";
import Card from "@dvargas92495/ui/dist/components/Card";
import Layout, { LayoutHead } from "../_common/Layout";
import type { Props } from "./[id].data";

const BoardPage = ({ name, projects }: Props): React.ReactElement => (
  <Layout>
    <Card title={name}>
      <ul>
        {projects.map((p) => (
          <li key={p.uuid}>{p.name}</li>
        ))}
      </ul>
    </Card>
  </Layout>
);

export const Head = () => <LayoutHead title={"Home"} />;

export default BoardPage;
