import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { createAPIGatewayProxyHandler } from "aws-sdk-plus";
import type { Stripe } from "stripe";
import { stripe } from "../_common";
import Project from "../../db/project";
import ProjectBacker from "../../db/project_backer";
import { getRepository } from "typeorm";
import type { APIGatewayProxyHandler } from "aws-lambda/trigger/api-gateway-proxy";

const verifyStripeWebhook =
  (fcn: APIGatewayProxyHandler): APIGatewayProxyHandler =>
  (event, context, callback) => {
    const { ["stripe-signature"]: sig, ...headers } = event.headers;
    console.log(event.headers);
    try {
      const stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      const response = fcn(
        {
          ...event,
          body: JSON.stringify({ stripeResource: stripeEvent.data.object }),
          headers,
        },
        context,
        callback
      );
      return (
        response ||
        Promise.resolve({
          statusCode: 204,
          body: "",
        })
      );
    } catch (err) {
      return Promise.resolve({
        statusCode: 400,
        body: `Webhook Error: ${err.message}`,
      });
    }
  };

const logic = ({
  stripeResource,
}: {
  stripeResource: Stripe.Checkout.Session;
}) =>
  stripe.paymentIntents
    .retrieve(stripeResource.payment_intent as string)
    .then((r) => ({
      project: r.metadata?.project,
      amount: r.amount,
      payment_intent: r.id,
    }))
    .then(({ amount, ...p }) =>
      connectTypeorm([Project, ProjectBacker])
        .then(() => getRepository(ProjectBacker).insert(p))
        .then(() => {
          const projectRepo = getRepository(Project);
          return projectRepo
            .findOne(p.project, { select: ["progress"] })
            .then((pi) =>
              projectRepo.update(p.project, {
                progress: pi.progress + amount / 100,
              })
            );
        })
    )
    .then(() => ({ success: true }));

export const handler = verifyStripeWebhook(createAPIGatewayProxyHandler(logic));
