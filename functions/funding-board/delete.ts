import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import FundingBoard from "../../db/funding_board";
import FundingBoardProject from "../../db/funding_board_project";
import { invokeDeleteBoardPage } from "../_common";
import { MethodNotAllowedError } from "aws-sdk-plus/dist/errors";

const logic = ({
  uuid,
  user: { id },
}: {
  uuid: string;
  user: { id: string };
}) =>
  connectTypeorm([FundingBoard, FundingBoardProject])
    .then(() =>
      getRepository(FundingBoardProject).count({ funding_board: uuid })
    )
    .then((n) => {
      if (n) {
        throw new MethodNotAllowedError(
          `Cannot delete board ${uuid} when it still has projects`
        );
      }
      return getRepository(FundingBoard).delete({ uuid, user_id: id });
    })
    .then((r) =>
      invokeDeleteBoardPage(uuid).then(() => ({
        success: !!r.affected,
      }))
    );

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
