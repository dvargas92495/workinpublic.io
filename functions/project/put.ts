import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import Project, { ProjectSchema } from "../../db/project";
import FundingBoard from "../../db/funding_board";
import FundingBoardProject from "../../db/funding_board_project";
import buildPagesByProjectId from "../_common/buildPagesByProjectId";

const logic = ({
  uuid,
  user: { id },
  ...entity
}: {
  user: { id: string };
} & Partial<Omit<ProjectSchema, "user_id" | "uuid">> &
  Pick<ProjectSchema, "uuid">) =>
  connectTypeorm([Project, FundingBoardProject, FundingBoard]).then((con) =>
    con
      .getRepository(Project)
      .update({ uuid, user_id: id }, entity)
      .then((result) =>
        buildPagesByProjectId(con, uuid).then(() => ({
          success: !!result.affected,
        }))
      )
  );

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
