import isr from "fuegojs/dist/isr";
import * as Page from "../pages/projects/[id]";
import * as data from "../pages/projects/[id].data";
import * as _html from "../pages/_html";
import path from "path";
import { targetedDeploy } from "fuegojs/dist/deploy";
import { FE_OUT_DIR } from "fuegojs/dist/common";

export const handler = ({ uuid }: { uuid: string }) =>
  isr({
    Page,
    data,
    _html,
    params: { id: uuid },
    path: "projects/[id].js",
  }).then(() =>
    targetedDeploy(
      [
        path.join(FE_OUT_DIR, `board/${uuid}.js`),
        path.join(FE_OUT_DIR, `board/${uuid}.html`),
      ],
      true
    )
  );
export type Handler = typeof handler;
