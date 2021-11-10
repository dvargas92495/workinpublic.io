import isr from "fuegojs/dist/isr";
import deploy from "fuegojs/dist/deploy";
import * as Page from "../pages/projects/[id]";
import * as data from "../pages/projects/[id].data";
import * as _html from "../pages/_html";

export const handler = ({ uuid }: { uuid: string }) =>
  isr({ Page, data, _html, params: { id: uuid }, path: "projects/[id].js" }).then(
    () =>
      process.env.NODE_ENV === "production"
        ? deploy({ domain: process.env.HOST }).then(() =>
            console.log("deployed successfully")
          )
        : console.log("Wrote locally")
  );
export type Handler = typeof handler;
