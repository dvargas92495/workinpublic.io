import connectTypeorm from "@dvargas92495/api/dist/connectTypeorm";
import { createAPIGatewayProxyHandler } from "aws-sdk-plus";
import { Stripe } from "stripe";
import { stripe } from "../_common";
import Project from "../../db/project";
import ProjectBacker from "../../db/project_backer";
import { getRepository } from "typeorm";

const logic = ({ session }: { session: Stripe.Checkout.Session }) =>
  stripe.paymentIntents
    .retrieve(session.payment_intent as string)
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

export const handler = createAPIGatewayProxyHandler(logic);
