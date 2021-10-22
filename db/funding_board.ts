import { EntitySchema } from "typeorm";

type FundingBoard = {
  uuid: string;
  name: string;
  user_id: string;
};

export default new EntitySchema<FundingBoard>({
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
  },
});
