import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import FundingBoard from "../../db/funding_board";
import FundingBoardProject from "../../db/funding_board_project";
import Project from "../../db/project";

class UserError extends Error {
  constructor(arg: string) {
    super(arg);
  }
  readonly code = 400;
}

class UnauthorizedError extends Error {
  constructor(arg: string) {
    super(arg);
  }
  readonly code = 401;
}

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
  if (!name) throw new UserError("`name` is required");
  return connectTypeorm([FundingBoard, FundingBoardProject, Project])
    .then(() => getRepository(FundingBoard).findOne({ uuid: board }))
    .then((result) => {
      if (!result) throw new UserError(`Could not find Funding Board ${board}`);
      if (result.user_id !== user_id)
        throw new UnauthorizedError(
          `User is not authorized to add project to Funding Board ${board}`
        );
      return getRepository(Project)
        .insert({ name, link, target, user_id })
        .then((r) =>
          getRepository(FundingBoardProject).insert({
            project: r.identifiers[0].uuid,
            funding_board: board,
          })
        );
    })
    .then(() => ({ success: true }));
};
export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
