import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import FundingBoard from "../../db/funding_board";
import FundingBoardProject from "../../db/funding_board_project";
import Project from "../../db/project";
import ProjectIdea from "../../db/project_idea";
import { invokeDeleteBoardPage } from "../_common";
import { MethodNotAllowedError } from "aws-sdk-plus/dist/errors";

const logic = ({
  uuid,
  user: { id },
}: {
  uuid: string;
  user: { id: string };
}) =>
  connectTypeorm([
    FundingBoard,
    FundingBoardProject,
    Project,
    ProjectIdea,
  ]).then((con) =>
    Promise.all([
      con.getRepository(FundingBoardProject).count({ funding_board: uuid }),
      con.getRepository(ProjectIdea).count({ funding_board: uuid, reviewed: false }),
    ])
      .then(([n, nn]) => {
        if (n) {
          throw new MethodNotAllowedError(
            `Cannot delete funding board when it still has projects`
          );
        }
        if (nn) {
          throw new MethodNotAllowedError(
            `Cannot delete funding board when it still has unreviewed project ideas`
          );
        }
        return con.getRepository(FundingBoard).delete({ uuid, user_id: id });
      })
      .then((r) =>
        invokeDeleteBoardPage(uuid).then(() => ({
          success: !!r.affected,
        }))
      )
  );

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
