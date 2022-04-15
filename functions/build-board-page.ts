import isr from "fuegojs/dist/isr";
import { targetedDeploy } from "fuegojs/dist/deploy";
import { FE_OUT_DIR } from "fuegojs/dist/common";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import * as Page from "../pages/board/[id]";
import * as data from "../pages/board/[id].data";
import * as _html from "../pages/_html";
import FundingBoard from "../db/funding_board";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";

const s3 = new AWS.S3();
const Bucket = (process.env.ORIGIN || "").replace(/^https?:\/\//, "");

const createEmbed = (uuid: string) =>
  (process.env.NODE_ENV === "development"
    ? new Promise<string>((resolve, reject) =>
        fs.readFile(
          path.join(process.env.FE_DIR_PREFIX || ".", "out", "board.js"),
          (err, data) => (err ? reject(err) : resolve(data.toString()))
        )
      ).catch(() => "")
    : s3
        .getObject({
          Bucket,
          Key: `board.js`,
        })
        .promise()
        .then((r) => r.Body?.toString?.() || "")
  ).then((content) =>
    data
      .default({ params: { id: uuid } })
      .then(({ props }) =>
        fs.writeFileSync(
          path.join(
            process.env.FE_DIR_PREFIX || ".",
            "out",
            `/board/${uuid}.js`
          ),
          content
            .replace(/process\.env\.FUNDING_BOARD_UUID/, `"${uuid}"`)
            .replace(/process\.env\.FUNDING_BOARD_PROPS/, JSON.stringify(props))
        )
      )
  );

export const handler = ({ uuid }: { uuid: string }) =>
  connectTypeorm([FundingBoard])
    .then((con) =>
      con
        .getRepository(FundingBoard)
        .findOneOrFail(uuid)
        .then((r) => (r.share ? [r.share, r.uuid] : [r.uuid]))
        .catch(() => [uuid])
    )
    .then((ids) =>
      Promise.all(
        ids.map((id) =>
          isr({ Page, data, _html, params: { id }, path: "board/[id].js" })
        )
      )
    )
    .then(() => createEmbed(uuid))
    .then(() =>
      targetedDeploy(
        [
          path.join(FE_OUT_DIR, `board/${uuid}.js`),
          path.join(FE_OUT_DIR, `board/${uuid}.html`),
        ],
        true
      )
    );

export type Handler = typeof handler;
