import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { users, User } from "@clerk/clerk-sdk-node";
import { ConflictError, InternalServorError } from "aws-sdk-plus/dist/errors";
import { stripe } from "../_common";

const logic = ({
  user: { id, privateMetadata, emailAddresses, primaryEmailAddressId },
}: {
  user: User & { id: string };
}) => {
  if (privateMetadata["stripe"])
    throw new ConflictError("User is already connected to Stripe");
  const email = emailAddresses.find(
    (e) => e.id === primaryEmailAddressId
  )?.emailAddress;
  if (!email) throw new InternalServorError("Couldn't find email for user");
  return stripe.accounts
    .create({
      type: "express",
      email,
      metadata: {
        application: "workinpublic.io",
      },
    })
    .then((a) =>
      stripe.accountLinks
        .create({
          account: a.id,
          refresh_url: `${process.env.ORIGIN}/dashboard?stripe-refresh=true`,
          return_url: `${process.env.ORIGIN}/dashboard?stripe-return=true`,
          type: "account_onboarding",
        })
        .then((l) =>
          users
            .updateUser(id, {
              privateMetadata: { ...privateMetadata, stripe: a.id },
            })
            .then(() => l)
        )
    )
    .then((l) => ({
      url: l.url,
    }));
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
