import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import sendEmail from "aws-sdk-plus/dist/sendEmail";
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
import { users } from "@clerk/clerk-sdk-node";
import React from "react";
import NewProjectBackerEmail from "../_common/NewProjectBackerEmail";
import ThankProjectBackerEmail from "../_common/ThankProjectBackerEmail";

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
    .retrieve(stripeResource.payment_intent as string, { expand: ["customer"] })
    .then((r) => ({
      project: r.metadata?.project,
      amount: r.amount,
      payment_intent: r.id,
      email: (r.customer as Stripe.Customer).email || "",
    }))
    .then(({ amount, email, ...p }) =>
      connectTypeorm([
        Project,
        ProjectBacker,
        FundingBoard,
        FundingBoardProject,
      ])
        .then((con) =>
          con
            .getRepository(ProjectBacker)
            .insert(p)
            .then((result) => {
              const projectRepo = con.getRepository(Project);
              return projectRepo
                .findOne(p.project, { select: ["progress"] })
                .then((pi) => {
                  return projectRepo
                    .update(p.project, {
                      progress: (pi?.progress || 0) + amount / 100,
                    })
                    .then(() => buildPagesByProjectId(con, p.project))
                    .then(() => ({
                      project: pi,
                      uuid: result.identifiers[0].uuid,
                    }));
                });
            })
        )
        .then(({ project, uuid }) =>
          users
            .getUser(project?.user_id || "")
            .then((u) => ({
              fullName: `${u.firstName} ${u.lastName}`,
              ownerEmail:
                u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
                  ?.emailAddress || "",
            }))
            .then(({ fullName, ownerEmail }) =>
              Promise.all([
                sendEmail({
                  to: ownerEmail,
                  subject: "Congratulations! Your project just got funded!",
                  body: React.createElement(NewProjectBackerEmail, {
                    fullName,
                    projectName: project?.name || "",
                    amount,
                    email,
                  }),
                  replyTo: email,
                }).catch(() => console.error("Failed to send owner email")),
                sendEmail({
                  to: email,
                  subject: "Thank you for funding my project!",
                  body: React.createElement(ThankProjectBackerEmail, {
                    fullName,
                    projectName: project?.name || "",
                    uuid,
                  }),
                  replyTo: ownerEmail,
                }),
              ])
            )
        )
        .then(() => ({ success: true }))
    );

export const handler = verifyStripeWebhook(createAPIGatewayProxyHandler(logic));
