import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import project_idea from "../../db/project_idea";
import funding_board from "../../db/funding_board";
import sendEmail from "aws-sdk-plus/dist/sendEmail";
import { users } from "@clerk/clerk-sdk-node";
import React from "react";
import NewProjectIdeaEmail from "../_common/NewProjectIdeaEmail";
import EmailLayout from "../_common/EmailLayout";

const logic = async ({
  uuid,
  name,
  description,
  email,
}: {
  uuid: string;
  name: string;
  description: string;
  email: string;
}) =>
  connectTypeorm([project_idea, funding_board])
    .then((con) =>
      con
        .getRepository(funding_board)
        .findOne(uuid)
        .then(async (b) => {
          if (!b)
            throw new NotFoundError(`Couldn't find funding board ${uuid}`);
          return con
            .getRepository(project_idea)
            .insert({
              funding_board: uuid,
              name,
              email,
              description,
              reviewed: false,
            })
            .then(() => b);
        })
    )
    .then(({ user_id, name: boardName }) =>
      users
        .getUser(user_id)
        .then((u) => ({
          fullName: `${u.firstName} ${u.lastName}`,
          email:
            u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
              ?.emailAddress || "",
        }))
        .then(({ fullName, email: ownerEmail }) =>
          Promise.all([
            sendEmail({
              to: ownerEmail,
              subject: `New Project Idea Submitted for Funding Board ${boardName}`,
              body: React.createElement(NewProjectIdeaEmail, {
                fullName,
                email,
                name,
                boardName,
                description,
              }),
              replyTo: email,
            }),
            sendEmail({
              to: email,
              subject: `Thanks For Submitting Your Project Idea!`,
              body: React.createElement(
                EmailLayout,
                {},
                React.createElement(
                  "p",
                  {},
                  `${fullName} will now review your project idea`
                )
              ),
            }),
          ])
        )
    )
    .then(() => ({ success: true }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
