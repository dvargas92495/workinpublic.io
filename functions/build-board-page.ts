import isr from "fuegojs/dist/isr";
import deploy from "fuegojs/dist/deploy";
import * as Page from "../pages/board/[id]";
import * as data from "../pages/board/[id].data";
import * as _html from "../pages/_html";

export const handler = ({ uuid }: { uuid: string }) =>
  isr({ Page, data, _html, params: { id: uuid }, path: "board/[id].js" }).then(
    () =>
      process.env.NODE_ENV === "production"
        ? deploy({ domain: "workinpublic.io" }).then(() =>
            console.log("deployed successfully")
          )
        : console.log("Wrote locally")
  );
export type Handler = typeof handler;
