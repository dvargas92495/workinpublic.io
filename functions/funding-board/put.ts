import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import FundingBoard from "../../db/funding_board";
import { invokeBuildBoardPage } from "../_common";

const logic = ({
  uuid,
  user: { id },
  ...update
}: {
  uuid: string;
  user: { id: string };
  name?: string;
  share?: string;
}) =>
  connectTypeorm([FundingBoard])
    .then((con) =>
      con.getRepository(FundingBoard).update({ uuid, user_id: id }, update)
    )
    .then((result) =>
      invokeBuildBoardPage(uuid).then(() => ({
        success: !!result.affected,
      }))
    );

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
