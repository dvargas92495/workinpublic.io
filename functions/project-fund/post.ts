import { stripe } from "../_common";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import Project, { ProjectSchema } from "../../db/project";
import { users } from "@clerk/clerk-sdk-node";
import { ConflictError, NotFoundError } from "aws-sdk-plus/dist/errors";

const logic = async ({ uuid, funding }: { uuid: string; funding: number }) =>
  connectTypeorm([Project])
    .then((con) => con.getRepository(Project).findOne(uuid))
    .then(async (p) => {
      if (!p) throw new NotFoundError(`Couldn't find froject ${uuid}`);
      const project = p as ProjectSchema;
      const amount = funding * 100;
      const destination = await users
        .getUser(project.user_id)
        .then((r) => r.privateMetadata["stripe"] as string);
      if (!destination)
        throw new ConflictError(
          `User associated with project ${uuid} hasn't connected with Stripe.`
        );
      const payment_intent_data = {
        metadata: { project: uuid },
        application_fee_amount: 30 + Math.ceil(amount * 0.08),
        transfer_data: {
          destination,
        },
      };

      return stripe.checkout.sessions
        .create({
          payment_method_types: ["card"],
          payment_intent_data: {
            setup_future_usage: "off_session",
            ...payment_intent_data,
          },
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: amount,
                product_data: {
                  name: project.name,
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            callback: `${process.env.API_URL}/project-fund-finish`,
          },
          success_url: `${process.env.HOST}/projects/${uuid}?checkout=true`,
          cancel_url: `${process.env.HOST}/projects/${uuid}`,
        })
        .then((session) => ({ id: session.id, active: false }));
    });

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
