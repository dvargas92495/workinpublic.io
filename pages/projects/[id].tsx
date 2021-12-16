import React, { useEffect, useState } from "react";
import Layout, { LayoutHead } from "../_common/Layout";
import type { Props } from "./[id].data";
import Link from "@mui/material/Link";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import H1 from "@dvargas92495/ui/dist/components/H1";
import H6 from "@dvargas92495/ui/dist/components/H6";
import ProjectFundButton from "../_common/ProjectFundButton";

const ProjectPage = ({
  name,
  boards,
  progress,
  target,
  content,
  uuid,
}: Props): React.ReactElement => {
  const [isCheckout, setIsCheckout] = useState(false);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setIsCheckout(query.has("checkout"));
  }, [setIsCheckout]);
  return (
    <Layout>
      <div>
        {isCheckout && <div>Thank you for funding!</div>}
        <H1
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{name}</span>
          <ProjectFundButton uuid={uuid} name={name} />
        </H1>
        <H6>
          Boards Listed:
          {boards.map((b) => (
            <Link
              href={`/board/${b.uuid}`}
              key={b.uuid}
              sx={{ margin: "0 8px" }}
            >
              {b.name}
            </Link>
          ))}
        </H6>
        <Box sx={{ my: "16px" }}>
          <Tooltip title={`Funded $${progress} out of $${target}`}>
            <LinearProgress
              value={(progress / target) * 100}
              variant={"determinate"}
              color={"primary"}
            />
          </Tooltip>
        </Box>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </Layout>
  );
};

export const Head = ({ name }: Props): React.ReactElement => (
  <LayoutHead title={name} />
);
export default ProjectPage;
