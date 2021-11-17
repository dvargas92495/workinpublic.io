import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BoardComponent } from "../pages/board/[id]";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import Body from "@dvargas92495/ui/dist/components/Body";
import type { Handler } from "../functions/funding-board/get";

const boardId = process.env.FUNDING_BOARD_UUID || "";

const EmbeddedBoard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [props, setProps] = useState({ name: "", projects: [] });
  const handler = useHandler<Handler>({ path: "funding-board", method: "GET" });
  useEffect(() => {
    handler({ uuid: boardId, limit: 10, offset: 0 })
      .then((props) => setProps(props))
      .catch((e) => setError(e.message));
  }, [setProps, setLoading, setError]);
  return (
    <Box sx={{ minHeight: "400px" }}>
      {error ? (
        <Body>{error}</Body>
      ) : loading ? (
        <Skeleton variant="rectangular" />
      ) : (
        <BoardComponent {...props} />
      )}
    </Box>
  );
};

ReactDOM.render(
  <EmbeddedBoard />,
  document.getElementById(`workinpublic-board-${boardId}`)
);
