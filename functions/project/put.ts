import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import Project, { ProjectSchema } from "../../db/project";
import FundingBoard from "../../db/funding_board";
import FundingBoardProject from "../../db/funding_board_project";
import { invokeBuildProjectPage, invokeBuildBoardPage } from "../_common";

const logic = ({
  uuid,
  user: { id },
  ...entity
}: {
  user: { id: string };
} & Partial<Omit<ProjectSchema, "user_id" | "uuid">> &
  Pick<ProjectSchema, "uuid">) =>
  connectTypeorm([Project, FundingBoardProject, FundingBoard])
    .then(() => getRepository(Project).update({ uuid, user_id: id }, entity))
    .then((result) =>
      getRepository(FundingBoardProject)
        .find({
          project: uuid,
        })
        .then((links) =>
          Promise.all([
            invokeBuildProjectPage(uuid),
            ...links.map((link) =>
              invokeBuildBoardPage(link.funding_board as string)
            ),
          ])
        )
        .then(() => ({
          success: !!result.affected,
        }))
    );

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
