import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import FundingBoard from "../../db/funding_board";
import { invokeBuildBoardPage } from "../_common";

class UserError extends Error {
  constructor(arg: string) {
    super(arg);
  }
  readonly code = 400;
}

const logic = ({
  name,
  user: { id },
}: {
  name: string;
  user: { id: string };
}) => {
  if (!name) throw new UserError("`name` is required");
  return connectTypeorm([FundingBoard])
    .then((con) => con.getRepository(FundingBoard).insert({ name, user_id: id }))
    .then((result) => result.identifiers[0].uuid as string)
    .then((uuid) => invokeBuildBoardPage(uuid).then(() => ({ uuid })));
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
