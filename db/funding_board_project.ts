import { EntitySchema } from "typeorm";
import FundingBoard from './funding_board';
import Project from './project';

type InverseSchema<T> = T extends EntitySchema<infer R> ? R : never; 

type FundingBoardProject = {
  uuid: string;
  funding_board: InverseSchema<typeof FundingBoard>;
  project: InverseSchema<typeof Project>;
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
