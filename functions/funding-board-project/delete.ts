import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import {
  ForbiddenError,
  MethodNotAllowedError,
  NotFoundError,
} from "aws-sdk-plus/dist/errors";
import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import FundingBoard, { FundingBoardSchema } from "../../db/funding_board";
import Project, { ProjectSchema } from "../../db/project";
import FundingBoardProject from "../../db/funding_board_project";
import ProjectBacker from "../../db/project_backer";
import { invokeBuildBoardPage, invokeDeleteProjectPage } from "../_common";

const logic = ({
  uuid,
  user: { id },
}: {
  uuid: string;
  user: { id: string };
}) =>
  connectTypeorm([FundingBoard, Project, FundingBoardProject, ProjectBacker])
    .then((con) => {
      const fbrRepo = con.getRepository(FundingBoardProject);
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
          return Promise.all([
            fbrRepo.count({ project: r.project }),
            con.getRepository(ProjectBacker).count({ project: r.project }),
          ]).then(([boards, backers]) => {
            if (boards === 1 && backers > 0) {
              throw new MethodNotAllowedError(
                `Cannot delete project while there are still backers.`
              );
            }
            return Promise.all([
              fbrRepo
                .delete(uuid)
                .then((d) =>
                  invokeBuildBoardPage(board.uuid).then(() => !!d.affected)
                ),
              ...(boards === 1
                ? [
                    con
                      .getRepository(Project)
                      .delete(r.project)
                      .then((d) =>
                        invokeDeleteProjectPage(
                          (r.project as ProjectSchema).uuid
                        ).then(() => !!d.affected)
                      ),
                  ]
                : []),
            ]).then((r) => r.every((b) => b));
          });
        });
    })
    .then((success) => ({
      success,
    }));

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
