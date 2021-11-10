import isr from "fuegojs/dist/isr";
import fuegoDeploy from "./_common/fuegoDeploy";
import * as Page from "../pages/projects/[id]";
import * as data from "../pages/projects/[id].data";
import * as _html from "../pages/_html";

export const handler = ({ uuid }: { uuid: string }) =>
  isr({ Page, data, _html, params: { id: uuid }, path: "projects/[id].js" }).then(
    fuegoDeploy
  );
export type Handler = typeof handler;
