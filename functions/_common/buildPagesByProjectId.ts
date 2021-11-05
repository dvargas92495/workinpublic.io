import { getManager } from "typeorm";
import FundingBoardProject from "../../db/funding_board_project";
import { invokeBuildBoardPage, invokeBuildProjectPage } from ".";

const buildPagesByProjectId = (project: string) =>
  getManager()
    .createQueryBuilder(FundingBoardProject, "l")
    .select("l.funding_board", "funding_board")
    .where({ project })
    .getRawMany()
    .then((links) => {
      return Promise.all([
        invokeBuildProjectPage(project),
        ...links.map((link) =>
          invokeBuildBoardPage(link.funding_board as string)
        ),
      ]);
    });

export default buildPagesByProjectId;
