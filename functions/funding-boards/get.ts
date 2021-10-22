import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import FundingBoard from "../../db/funding_board";

const logic = ({ user: { id } }: { user: { id: string } }) =>
  connectTypeorm([FundingBoard])
    .then(() => getRepository(FundingBoard).find({ user_id: id }))
    .then((fundingBoards) => ({
      fundingBoards,
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
