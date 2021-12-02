import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import FundingBoardProject from "../../db/funding_board_project";
import FundingBoard from "../../db/funding_board";
import Project, { ProjectSchema } from "../../db/project";
import { NotFoundError } from "aws-sdk-plus/dist/errors";

const UUID_REGEX =
  /^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/;

const logic = ({
  id,
  limit = 10,
  offset = 0,
}: {
  id: string;
  limit: number;
  offset: number;
}) =>
  connectTypeorm([FundingBoardProject, Project, FundingBoard]).then((con) =>
    (UUID_REGEX.test(id)
      ? con.getRepository(FundingBoard).findOne(id)
      : con.getRepository(FundingBoard).findOne({ share: id })
    ).then((board) => {
      if (!board)
        throw new NotFoundError(`Could not find funding board with id: ${id}`);
      return con
        .getRepository(FundingBoardProject)
        .find({
          where: { funding_board: board.uuid },
          relations: ["project"],
          take: limit,
          skip: offset,
        })
        .then((fundingBoardProjects = []) => ({
          uuid: board.uuid,
          name: board.name,
          projects: fundingBoardProjects.map(({ project }) => {
            const { user_id, ...rest } = project as ProjectSchema;
            return rest;
          }),
        }));
    })
  );

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
