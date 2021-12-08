import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import FundingBoard from "../../db/funding_board";

const logic = ({ user: { id } }: { user: { id: string } }) =>
  connectTypeorm([FundingBoard])
    .then((con) => con.getRepository(FundingBoard).find({ user_id: id }))
    .then((fundingBoards) => ({
      fundingBoards,
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
