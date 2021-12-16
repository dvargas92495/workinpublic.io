import React from "react";
import NumberField from "@dvargas92495/ui/dist/components/NumberField";
import { loadStripe } from "@stripe/stripe-js";
import type { Handler as FundHandler } from "../../functions/project-fund/post";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import FormDialog from "@dvargas92495/ui/dist/components/FormDialog";

type ProjectFundButtonProps = {
  uuid: string;
  name: string;
  isOpen?: boolean;
};

const stripe = loadStripe(process.env.STRIPE_PUBLIC_KEY || "");

const ProjectFundButton: React.FunctionComponent<ProjectFundButtonProps> = ({
  name,
  uuid,
  isOpen = false,
}) => {
  const postHandler = useHandler<FundHandler>({
    method: "POST",
    path: "project-fund",
  });
  return (
    <FormDialog<{ funding: number }>
      defaultIsOpen={isOpen}
      title={name}
      contentText={`Funding will be refundable until completion of the project.`}
      buttonText={"FUND"}
      onSave={({ funding }) =>
        postHandler({
          uuid,
          funding,
        }).then((r) =>
          !r.active
            ? stripe.then(
                (s) =>
                  s &&
                  s
                    .redirectToCheckout({
                      sessionId: r.id,
                    })
                    .then(() => Promise.resolve())
              )
            : Promise.resolve()
        )
      }
      formElements={{
        funding: {
          order: 0,
          defaultValue: 100,
          component: NumberField,
          validate: (v) =>
            v > 0 ? "" : "Funding amount must be greater than 0",
        },
      }}
    />
  );
};

export default ProjectFundButton;
