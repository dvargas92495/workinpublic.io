import { EntitySchema } from "typeorm";
import Project from "./project";

type InverseSchema<T> = T extends EntitySchema<infer R> ? R : never;

type ProjectBacker = {
  uuid: string;
  payment_intent: string;
  project: string | InverseSchema<typeof Project>;
  amount: number;
  refunded: boolean;
};

export default new EntitySchema<ProjectBacker>({
  name: "project_backers",
  columns: {
    uuid: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    payment_intent: {
      type: "varchar",
      length: 63,
      nullable: false,
    },
    amount: {
      type: "int",
      nullable: false,
      default: 0,
    },
    refunded: {
      type: "boolean",
      nullable: false,
      default: false,
    }
  },
  relations: {
    project: {
      target: Project.options.name,
      type: "many-to-one",
    },
  },
});
