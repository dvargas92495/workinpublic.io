import isr from "fuegojs/dist/isr";
import fuegoDeploy from "./_common/fuegoDeploy";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import * as Page from "../pages/board/[id]";
import * as data from "../pages/board/[id].data";
import * as _html from "../pages/_html";
import FundingBoard from "../db/funding_board";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";

const s3 = new AWS.S3();
const Bucket = (process.env.HOST || "").replace(/^https?:\/\//, "");

const createEmbed = (uuid: string) =>
  (process.env.NODE_ENV === "development"
    ? new Promise<string>((resolve, reject) =>
        fs
          .readFile(
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
    .then(() =>
      getRepository(FundingBoard)
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
    .then(fuegoDeploy);

export type Handler = typeof handler;
