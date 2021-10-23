import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import FundingBoardProject from "../../db/funding_board_project";
import FundingBoard from "../../db/funding_board";
import Project from "../../db/project";

const logic = ({
  board,
  limit,
  offset,
}: {
  board: string;
  limit: number;
  offset: number;
}) =>
  connectTypeorm([FundingBoardProject, Project, FundingBoard])
    .then(() =>
      getRepository(FundingBoardProject).find({
        where: { funding_board: board },
        relations: ["project"],
        take: limit,
        skip: offset,
      })
    )
    .then((fundingBoardProjects) => ({
      fundingBoardProjects: fundingBoardProjects.map(
        ({ project: { user_id, ...rest } }) => rest
      ),
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
