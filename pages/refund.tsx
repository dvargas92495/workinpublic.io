import React, { useCallback, useEffect, useState } from "react";
import H1 from "@dvargas92495/ui/dist/components/H1";
import Body from "@dvargas92495/ui/dist/components/Body";
import Layout, { LayoutHead } from "./_common/Layout";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Handler as GetHandler } from "../functions/refund/get";
import { Handler as PostHandler } from "../functions/refund/get";

const ProductsPage: React.FunctionComponent = () => {
  const getRefund = useHandler<GetHandler>({
    path: "refund",
    method: "GET",
  });
  const postRefund = useHandler<PostHandler>({
    path: "refund",
    method: "POST",
  });
  const [refundInfo, setRefundInfo] = useState({
    projectName: "Loading...",
    amount: 0,
    uuid: "",
  });
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    getRefund({ id })
      .then(setRefundInfo)
      .catch((e) => setError(e.message));
  }, [getRefund, setRefundInfo]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const onClick = useCallback(() => {
    setLoading(true);
    postRefund({ id: refundInfo.uuid })
      .then(() => setMessage("Successfully refunded!"))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [setLoading, postRefund, setMessage, setError, refundInfo]);
  return (
    <Layout>
      <div>
        <H1>Refund</H1>
        <Body>
          We're sorry that you're pulling your funding. Verify that the details
          below are correct, and then click submit.
        </Body>
        <Body>
          <b>Project Name: </b>
          {refundInfo.projectName}
        </Body>
        <Body>
          <b>Project Name: </b>
          {refundInfo.projectName}
        </Body>
        <div>
          <Button
            variant="contained"
            color="primary"
            disabled={loading || !!message || !!error}
            onClick={onClick}
          >
            Submit
          </Button>
          {loading && <CircularProgress size={20} />}
        </div>
        <Body>
          <span color={"darkred"}>{error}</span>
          <span color={"darkgreen"}>{message}</span>
        </Body>
      </div>
    </Layout>
  );
};

export const Head = (): React.ReactElement => <LayoutHead title={"Products"} />;
export default ProductsPage;
