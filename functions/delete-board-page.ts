import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import * as _html from "../pages/_html";
import invalidate from "./_common/invalidate";

const s3 = new AWS.S3();
const Bucket = (process.env.ORIGIN || "").replace(/^https?:\/\//, "");

const deleteHtml = (id: string) =>
  (process.env.NODE_ENV === "development"
    ? new Promise<void>((resolve, reject) =>
        fs.rm(
          path.join(
            process.env.FE_DIR_PREFIX || ".",
            "out",
            `board/${id}.html`
          ),
          (err) => (err ? reject(err) : resolve())
        )
      ).catch(() => "")
    : s3
        .deleteObject({
          Bucket,
          Key: `board/${id}.html`,
        })
        .promise()
  ).then(() => [`/board/${id}`, `/board/${id}.html`]);

const deleteEmbed = (uuid: string) =>
  (process.env.NODE_ENV === "development"
    ? new Promise<void>((resolve, reject) =>
        fs.rm(
          path.join(
            process.env.FE_DIR_PREFIX || ".",
            "out",
            `board/${uuid}.js`
          ),
          (err) => (err ? reject(err) : resolve())
        )
      )
    : s3
        .deleteObject({
          Bucket,
          Key: `board/${uuid}.js`,
        })
        .promise()
  ).then(() => [`/board/${uuid}.js`]);

export const handler = ({ uuid, share }: { uuid: string; share?: string }) =>
  Promise.all([
    ...(share ? [uuid, share] : [uuid]).map(deleteHtml),
    deleteEmbed(uuid),
  ]).then((paths) => invalidate(paths.flat()));

export type Handler = typeof handler;
