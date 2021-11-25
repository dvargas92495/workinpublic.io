import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import * as _html from "../pages/_html";
import invalidate from "./_common/invalidate";

const s3 = new AWS.S3();
const Bucket = (process.env.HOST || "").replace(/^https?:\/\//, "");

const deleteHtml = (id: string) =>
  (process.env.NODE_ENV === "development"
    ? new Promise<void>((resolve, reject) =>
        fs.rm(
          path.join(
            process.env.FE_DIR_PREFIX || ".",
            "out",
            `project/${id}.html`
          ),
          (err) => (err ? reject(err) : resolve())
        )
      ).catch(() => "")
    : s3
        .deleteObject({
          Bucket,
          Key: `project/${id}.html`,
        })
        .promise()
  ).then(() => [`/project/${id}`, `/project/${id}.html`]);

export const handler = ({ uuid }: { uuid: string }) =>
  deleteHtml(uuid)
    .then(invalidate);

export type Handler = typeof handler;
