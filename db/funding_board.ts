import { EntitySchema } from "typeorm";

export type FundingBoardSchema = {
  uuid: string;
  name: string;
  user_id: string;
  share: string;
};

export default new EntitySchema<FundingBoardSchema>({
  name: "funding_boards",
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
    user_id: {
      type: "varchar",
      nullable: false,
    },
    share: {
      type: "varchar",
      nullable: true,
      unique: true,
    },
  },
});
