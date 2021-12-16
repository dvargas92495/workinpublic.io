import { EntitySchema } from "typeorm";

export type ProjectSchema = {
  uuid: string;
  name: string;
  link: string;
  user_id: string;
  target: number;
};

export default new EntitySchema<ProjectSchema>({
  name: "projects",
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
    link: {
      type: "varchar",
      nullable: false,
    },
    user_id: {
      type: "varchar",
      nullable: false,
    },
    target: {
      type: "int",
      nullable: false,
      unsigned: true,
    },
  },
});
