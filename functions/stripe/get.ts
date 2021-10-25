import clerkAuthenticateLambda from "@dvargas92495/api/dist/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { User } from "@clerk/clerk-sdk-node";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2020-08-27",
  maxNetworkRetries: 3,
});

const logic = async ({
  "stripe-refresh": stripeRefresh,
  "stripe-return": stripeReturn,
  user: { privateMetadata },
}: {
  "stripe-refresh": string;
  "stripe-return": string;
  user: User;
}): Promise<{ url?: string; connected: boolean | 'redirecting' }> => {
  const account = privateMetadata["stripe"] as string;
  if (!account) {
    return { connected: false };
  }
  if (stripeRefresh) {
    return stripe.accountLinks
      .create({
        account,
        refresh_url: `${process.env.HOST}/dashboard?stripe-refresh=true`,
        return_url: `${process.env.HOST}/dashboard?stripe-return=true`,
        type: "account_onboarding",
      })
      .then((l) => ({
        connected: 'redirecting',
        url: l.url,
      }));
  }
  if (stripeReturn) {
    return stripe.accounts
      .retrieve(account)
      .then((r) => ({ connected: r.details_submitted }));
  }
  return {
    connected: true,
  };
};

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
