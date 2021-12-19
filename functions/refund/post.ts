import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import { ProjectSchema } from "../../db/project";
import project_backer from "../../db/project_backer";
import { stripe } from "../_common";
import { users } from "@clerk/clerk-sdk-node";
import sendEmail from "aws-sdk-plus/dist/sendEmail";
import React from "react";
import ProjectRefundedEmail from "../_common/ProjectRefundedEmail";
import RefundSuccessfulEmail from "../_common/RefundSuccessfulEmail";
import Stripe from "stripe";

const logic = ({ id }: { id: string }) =>
  connectTypeorm([project_backer])
    .then((con) =>
      con
        .getRepository(project_backer)
        .findOne(id, {
          select: ["payment_intent", "project"],
          relations: ["project"],
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
            )
            .then(() => {
              const project = backer.project as ProjectSchema;
              if (!project.user_id) {
                return Promise.resolve().then(() => {
                  console.warn("Couldn't find a user id for project");
                });
              }
              return Promise.all([
                users.getUser(project.user_id),
                stripe.paymentIntents
                  .retrieve(backer.payment_intent, { expand: ["customer"] })
                  .then((pi) => (pi.customer as Stripe.Customer).email || ""),
              ])
                .then(([u, email]) => ({
                  fullName: `${u.firstName} ${u.lastName}`,
                  ownerEmail:
                    u.emailAddresses.find(
                      (e) => e.id === u.primaryEmailAddressId
                    )?.emailAddress || "",
                  email,
                }))
                .then(({ fullName, ownerEmail, email }) =>
                  Promise.all([
                    sendEmail({
                      to: ownerEmail,
                      subject: "Congratulations! Your project just got funded!",
                      body: React.createElement(ProjectRefundedEmail, {
                        fullName,
                        projectName: project?.name || "",
                        amount: backer.amount / 100,
                        email,
                      }),
                      replyTo: email,
                    }).catch(() => console.error("Failed to send owner email")),
                    sendEmail({
                      to: email,
                      subject: "Thank you for funding my project!",
                      body: React.createElement(RefundSuccessfulEmail, {
                        fullName,
                        projectName: project?.name || "",
                      }),
                      replyTo: ownerEmail,
                    }),
                  ])
                )
                .catch((e) => {
                  console.error("Failed to send funding email");
                  console.error(e);
                });
            });
        })
    )
    .then(() => ({ success: true }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
