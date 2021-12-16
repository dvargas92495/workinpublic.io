import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import FundingBoardProject from "../../db/funding_board_project";
import FundingBoard from "../../db/funding_board";
import Project from "../../db/project";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import project_backer from "../../db/project_backer";

const UUID_REGEX =
  /^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/;

export const logic = ({ id }: { id: string }) =>
  connectTypeorm([
    FundingBoardProject,
    Project,
    FundingBoard,
    project_backer,
  ]).then((con) =>
    (UUID_REGEX.test(id)
      ? con.getRepository(FundingBoard).findOne(id)
      : con.getRepository(FundingBoard).findOne({ share: id })
    ).then((board) => {
      if (!board)
        throw new NotFoundError(`Could not find funding board with id: ${id}`);
      return con
        .createQueryBuilder()
        .select([
          "p.uuid as uuid",
          "p.target as target",
          "p.link as link",
          "p.name as name",
          "SUM(pb.amount) as progress",
        ])
        .from(FundingBoardProject, "fbp")
        .innerJoin(Project.options.name, "p", "fbp.projectUuid = p.uuid")
        .innerJoin(project_backer.options.name, "pb", "pb.projectUuid = p.uuid")
        .where("fbp.fundingBoardUuid = :id AND pb.refunded = 0", {
          id: board.uuid,
        })
        .groupBy("p.uuid")
        .execute()
        .then(
          (
            projects: {
              uuid: string;
              target: number;
              link: string;
              name: string;
              progress: number;
            }[]
          ) => ({
            uuid: board.uuid,
            name: board.name,
            projects: projects.map((p) => ({
              ...p,
              progress: p.progress / 100,
            })),
          })
        );
    })
  );

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
