import AWS from "aws-sdk";
import axios from "axios";
import type { Handler as AsyncHandler } from "../build-board-page";
import type { Handler as ProjectHandler } from "../build-project-page";
import type { Handler as DeleteBoardHandler } from "../delete-board-page";
import type { Handler as DeleteProjectHandler } from "../delete-project-page";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2020-08-27",
  maxNetworkRetries: 3,
});

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
            FunctionName: `${(process.env.ORIGIN || "")
              ?.replace(/\./g, "-")
              .replace(/^https?:\/\//, "")}_${path}`,
            InvocationType: "Event",
            Payload: JSON.stringify(data),
          })
          .promise()
          .then(() => true)
    : <T extends Record<string, string>>({
        path,
        data,
      }: {
        path: string;
        data: T;
      }) => axios.post(`${process.env.API_URL}/${path}`, data).then(() => true);

export const invokeBuildBoardPage = (uuid: string) =>
  invokeAsync<Parameters<AsyncHandler>[0]>({
    path: "build-board-page",
    data: { uuid },
  });

export const invokeBuildProjectPage = (uuid: string) =>
  invokeAsync<Parameters<ProjectHandler>[0]>({
    path: "build-project-page",
    data: { uuid },
  });

export const invokeDeleteBoardPage = (uuid: string, share?: string) =>
  invokeAsync<Parameters<DeleteBoardHandler>[0]>({
    path: "delete-board-page",
    data: { uuid, share },
  });

export const invokeDeleteProjectPage = (uuid: string) =>
  invokeAsync<Parameters<DeleteProjectHandler>[0]>({
    path: "delete-project-page",
    data: { uuid },
  });
