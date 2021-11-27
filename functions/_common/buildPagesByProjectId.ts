import FundingBoardProject from "../../db/funding_board_project";
import { invokeBuildBoardPage, invokeBuildProjectPage } from ".";
import type {Connection} from 'typeorm';

const buildPagesByProjectId = (con: Connection, project: string) =>
  con
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
