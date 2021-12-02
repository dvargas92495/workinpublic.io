import { EntitySchema } from "typeorm";
import FundingBoard from "./funding_board";

type InverseSchema<T> = T extends EntitySchema<infer R> ? R : never;

type ProjectIdea = {
  uuid: string;
  funding_board: string | InverseSchema<typeof FundingBoard>;
  name: string;
  email: string;
  description: string;
  reviewed: boolean;
};

export default new EntitySchema<ProjectIdea>({
  name: "project_ideas",
  columns: {
    uuid: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    description: {
      type: "varchar",
      nullable: false,
    },
    email: {
      type: "varchar",
      nullable: false,
    },
    reviewed: {
      type: "boolean",
      nullable: false,
    },
  },
  relations: {
    funding_board: {
      target: FundingBoard.options.name,
      type: "many-to-one",
    },
  },
});
