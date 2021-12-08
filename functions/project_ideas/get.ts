import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import ProjectIdea from "../../db/project_idea";
import FundingBoard from "../../db/funding_board";

const logic = ({
  uuid,
  limit,
  offset,
}: {
  uuid: string;
  limit: number;
  offset: number;
}) =>
  connectTypeorm([ProjectIdea, FundingBoard])
    .then((con) =>
      con.getRepository(ProjectIdea).find({
        where: { funding_board: uuid },
        relations: ["project"],
        take: limit,
        skip: offset,
      })
    )
    .then((projectIdeas) => ({
      projectIdeas: projectIdeas.map(({ funding_board, ...rest }) => rest),
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
