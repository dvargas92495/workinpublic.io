import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import FundingBoardProject from "../../db/funding_board_project";
import FundingBoard, { FundingBoardSchema } from "../../db/funding_board";
import Project from "../../db/project";

const logic = ({ uuid }: { uuid: string }) =>
  connectTypeorm([FundingBoardProject, Project, FundingBoard])
    .then(() =>
      Promise.all([
        getRepository(Project).findOne(uuid),
        getRepository(FundingBoardProject).find({
          where: { project: uuid },
          relations: ["funding_board"],
        }),
      ])
    )
    .then(([project, fundingBoardProjects]) => {
      return {
        name: project?.name || "",
        target: project?.target || 0,
        progress: project?.progress || 0,
        boards: fundingBoardProjects.map(({ funding_board }) => {
          const { user_id, ...rest } = funding_board as FundingBoardSchema;
          return rest;
        }),
      };
    });

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
