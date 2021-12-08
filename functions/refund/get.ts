import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import project_backer from "../../db/project_backer";
import project from "../../db/project";
import { stripe } from "../_common";

const logic = ({ id }: { id: string }) =>
  connectTypeorm([project_backer, project])
    .then((con) =>
      con
        .getRepository(project_backer)
        .findOne(id)
        .then((link) => {
          if (!link)
            throw new NotFoundError(`Could not find backing with id ${id}`);
          return Promise.all([
            stripe.paymentIntents
              .retrieve(link.payment_intent)
              .then((pi) => pi.amount / 100),
            con
              .getRepository(project)
              .findOne((link.project as string) || "")
              .then((p) => p?.name || "Failed to find project name"),
          ]);
        })
    )
    .then(([amount, projectName]) => ({
      projectName,
      amount,
      uuid: id,
    }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
