import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import Project, { ProjectSchema } from "../../db/project";

const logic = ({
  uuid,
  user: { id },
  ...entity
}: {
  user: { id: string };
} & Partial<Omit<ProjectSchema, "user_id" | "uuid">> &
  Pick<ProjectSchema, "uuid">) =>
  connectTypeorm([Project])
    .then(() =>
      getRepository(Project).update(
        { uuid, user_id: id },
        entity
      )
    )
    .then((result) => ({
      success: !!result.affected,
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
