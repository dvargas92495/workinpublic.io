import AWS from "aws-sdk";
import axios from "axios";
import type { Handler as AsyncHandler } from "../build-board-page";

const lambda = new AWS.Lambda();

export const invokeAsync =
  process.env.NODE_ENV === "production"
    ? <T extends Record<string, string>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) =>
        lambda
          .invoke({
            FunctionName: `workinpublic-io_${path}`,
            InvocationType: "Event",
            Payload: JSON.stringify(data),
          })
          .promise()
    : <T extends Record<string, string>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) => axios.post(`${process.env.API_URL}/${path}`, data);

export const invokeBuildBoardPage = (uuid: string) => invokeAsync<Parameters<AsyncHandler>[0]>({
  path: "build-board-page",
  data: {uuid},
});