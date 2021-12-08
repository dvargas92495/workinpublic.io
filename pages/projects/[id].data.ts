import type { Handler as GetHandler } from "../../functions/project/get";
import axios from "axios";
import remarkGfm from "remark-gfm";
import formatError from "@dvargas92495/api/formatError";
import { evaluate } from "@mdx-js/mdx";
import React from "react";
import ReactDOMServer from "react-dom/server";

export type Props = Awaited<ReturnType<GetHandler>>;

const getStaticProps = ({
  params: { id },
}: {
  params: { id: string };
}): Promise<{
  props: Props;
}> => {
  return axios
    .get<Props>(`${process.env.API_URL}/project?uuid=${id}`)
    .then((r) =>
      evaluate(r.data.content, {
        Fragment: React.Fragment,
        jsx: React.createElement,
        jsxs: React.createElement,
        remarkPlugins: [remarkGfm],
        useDynamicImport: true,
      }).then(({ default: mdx }) => {
        const content = ReactDOMServer.renderToString(React.createElement(mdx));
        return {
          props: { ...r.data, content },
        };
      })
    )
    .catch((e) => {
      throw new Error(formatError(e));
    });
};

export default getStaticProps;
