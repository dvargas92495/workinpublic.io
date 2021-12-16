import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import project_backer from "../../db/project_backer";
import project, { ProjectSchema } from "../../db/project";
import { stripe } from "../_common";

const logic = ({ id }: { id: string }) =>
  connectTypeorm([project_backer, project])
    .then((con) =>
      con
        .getRepository(project_backer)
        .findOne(id, {
          select: ["payment_intent", "project"],
          relations: ["project"],
        })
        .then((link) => {
          if (!link)
            throw new NotFoundError(`Could not find backing with id ${id}`);
          return stripe.paymentIntents
            .retrieve(link.payment_intent)
            .then((pi) => ({
              uuid: id,
              amount: pi.amount / 100,
              projectName: (link.project as ProjectSchema).name,
            }));
        })
    )

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
