import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import project_backer from "../../db/project_backer";
import { stripe } from "../_common";

const logic = ({ id }: { id: string }) =>
  connectTypeorm([project_backer])
    .then((con) =>
      con
        .getRepository(project_backer)
        .findOne(id, {
          select: ["payment_intent"],
        })
        .then((backer) => {
          if (!backer)
            throw new NotFoundError(`Could not find backing with id ${id}`);
          return stripe.refunds
            .create({
              payment_intent: backer.payment_intent,
              reason: "requested_by_customer",
            })
            .then(() =>
              con.getRepository(project_backer).update(id, {
                refunded: true,
              })
            );
        })
    )
    .then(() => ({ success: true }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
