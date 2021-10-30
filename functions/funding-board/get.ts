import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import FundingBoardProject from "../../db/funding_board_project";
import FundingBoard from "../../db/funding_board";
import Project, { ProjectSchema } from "../../db/project";

const logic = ({
  uuid,
  limit = 10,
  offset = 0,
}: {
  uuid: string;
  limit: number;
  offset: number;
}) =>
  connectTypeorm([FundingBoardProject, Project, FundingBoard])
    .then(() =>
      Promise.all([
        getRepository(FundingBoard).findOne(uuid),
        getRepository(FundingBoardProject).find({
          where: { funding_board: uuid },
          relations: ["project"],
          take: limit,
          skip: offset,
        }),
      ])
    )
    .then(([board, fundingBoardProjects]) => ({
      name: board?.name,
      projects: fundingBoardProjects.map(({ project }) => {
        const { user_id, ...rest } = project as ProjectSchema;
        return rest;
      }),
    }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
