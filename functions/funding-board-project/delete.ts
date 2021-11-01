import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { ForbiddenError, NotFoundError } from "aws-sdk-plus/dist/errors";
import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { getRepository } from "typeorm";
import FundingBoard, { FundingBoardSchema } from "../../db/funding_board";
import Project, { ProjectSchema } from "../../db/project";
import FundingBoardProject from "../../db/funding_board_project";
import { invokeBuildBoardPage } from "../_common";

const logic = ({
  uuid,
  user: { id },
}: {
  uuid: string;
  user: { id: string };
}) =>
  connectTypeorm([FundingBoard, Project, FundingBoardProject])
    .then(() => {
      const fbrRepo = getRepository(FundingBoardProject);
      return fbrRepo
        .findOne({
          relations: ["funding_board", "project"],
          where: { uuid },
        })
        .then((r) => {
          if (!r)
            throw new NotFoundError(
              `Could not find Funding Board Project Link ${uuid}`
            );
          const board = r.funding_board as FundingBoardSchema;
          if (id !== board.user_id)
            throw new ForbiddenError(
              `User is not authorized to remove project from Funding Board ${board.uuid}`
            );

          return fbrRepo
            .delete(uuid)
            .then(() => invokeBuildBoardPage(board.uuid))
            .then(() => (r.project as ProjectSchema).uuid);
        })
        .then((projectUuid) =>
          fbrRepo.find({ project: projectUuid }).then((otherLinks) =>
            otherLinks.length
              ? Promise.resolve(true)
              : getRepository(Project)
                  .delete(projectUuid)
                  .then((r) => !!r.affected)
          )
        );
    })
    .then((success) => ({
      success,
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
