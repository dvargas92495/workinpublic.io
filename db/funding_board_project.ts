import { EntitySchema } from "typeorm";
import FundingBoard from './funding_board';
import Project from './project';

type FundingBoardProject = {
  uuid: string;
  funding_board: string;
  project: string;
};

export default new EntitySchema<FundingBoardProject>({
  name: "funding_board_projects",
  columns: {
    uuid: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
  },
  relations: {
    funding_board: {
      target: FundingBoard.options.name,
      type: "many-to-one",
    },
    project: {
      target: Project.options.name,
      type: "many-to-one",
    },
  },
});
