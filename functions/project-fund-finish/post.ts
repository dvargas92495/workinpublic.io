import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { createAPIGatewayProxyHandler } from "aws-sdk-plus";
import type { Stripe } from "stripe";
import { stripe } from "../_common";
import buildPagesByProjectId from "../_common/buildPagesByProjectId";
import Project from "../../db/project";
import ProjectBacker from "../../db/project_backer";
import FundingBoard from "../../db/funding_board";
import FundingBoardProject from "../../db/funding_board_project";
import type {
  APIGatewayProxyEventHeaders,
  APIGatewayProxyHandler,
} from "aws-lambda/trigger/api-gateway-proxy";

const normalizeHeaders = (hdrs: APIGatewayProxyEventHeaders) =>
  Object.fromEntries(
    Object.entries(hdrs).map(([h, v]) => [h.toLowerCase(), v])
  );

const verifyStripeWebhook =
  (fcn: APIGatewayProxyHandler): APIGatewayProxyHandler =>
  (event, context, callback) => {
    const { ["stripe-signature"]: sig, ...headers } = normalizeHeaders(
      event.headers
    );
    const { body, ...rest } = JSON.parse(event.body || "{}");
    try {
      const stripeEvent = stripe.webhooks.constructEvent(
        body,
        sig || "",
        process.env.STRIPE_CHECKOUT_SECRET || ""
      );
      const response = fcn(
        {
          ...event,
          body: JSON.stringify({
            stripeResource: stripeEvent.data.object,
            ...rest,
          }),
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
      console.error(err);
      return Promise.resolve({
        statusCode: 400,
        body: `Webhook Error: ${err}`,
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
      connectTypeorm([
        Project,
        ProjectBacker,
        FundingBoard,
        FundingBoardProject,
      ]).then((con) =>
        con
          .getRepository(ProjectBacker)
          .insert(p)
          .then(() => {
            const projectRepo = con.getRepository(Project);
            return projectRepo
              .findOne(p.project, { select: ["progress"] })
              .then((pi) => {
                return projectRepo.update(p.project, {
                  progress: (pi?.progress || 0) + amount / 100,
                });
              })
              .then(() => p.project);
          })
          .then((project) => buildPagesByProjectId(con, project))
      )
    )
    .then(() => ({ success: true }));

export const handler = verifyStripeWebhook(createAPIGatewayProxyHandler(logic));
