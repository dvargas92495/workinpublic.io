import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "aws-sdk-plus/dist/errors";
import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import FundingBoard from "../../db/funding_board";
import FundingBoardProject from "../../db/funding_board_project";
import Project from "../../db/project";
import { invokeBuildBoardPage, invokeBuildProjectPage } from "../_common";

const logic = ({
  board,
  name,
  link,
  target,
  user: { id: user_id },
}: {
  board: string;
  name: string;
  link: string;
  target: number;
  user: { id: string };
}) => {
  if (!name) throw new BadRequestError("`name` is required");
  return connectTypeorm([FundingBoard, FundingBoardProject, Project]).then(
    (con) =>
      con
        .getRepository(FundingBoard)
        .findOne({ uuid: board })
        .then((result) => {
          if (!result)
            throw new NotFoundError(`Could not find Funding Board ${board}`);
          if (result.user_id !== user_id)
            throw new ForbiddenError(
              `User is not authorized to add project to Funding Board ${board}`
            );
          return con
            .getRepository(Project)
            .insert({ name, link, target, user_id })
            .then((r) => {
              const project = r.identifiers[0].uuid as string;
              return con
                .getRepository(FundingBoardProject)
                .insert({
                  project,
                  funding_board: board,
                })
                .then(() => project);
            });
        })
        .then((project) =>
          Promise.all([
            invokeBuildBoardPage(board),
            invokeBuildProjectPage(project),
          ]).then(() => ({ success: true }))
        )
  );
};
export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
