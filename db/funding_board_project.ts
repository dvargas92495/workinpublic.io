import { EntitySchema } from "typeorm";
import FundingBoard, {FundingBoardSchema} from './funding_board';
import Project from './project';

type InverseSchema<T> = T extends EntitySchema<infer R> ? R : never; 

type FundingBoardProject = {
  uuid: string;
  funding_board: string | FundingBoardSchema;
  project: string | InverseSchema<typeof Project>;
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
      nullable: false
    },
    project: {
      target: Project.options.name,
      type: "many-to-one",
      nullable: false,
    },
  },
});
