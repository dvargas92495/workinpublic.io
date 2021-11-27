import React, { useEffect, useState } from "react";
import Layout, { LayoutHead } from "../_common/Layout";
import type { Props } from "./[id].data";
import Link from "@mui/material/Link";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

const ProjectPage = ({
  name,
  boards,
  progress,
  target,
  content,
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
        <h1>{name}</h1>
        <h6>
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
        </h6>
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
