import React, { useCallback, useState } from "react";
import FormDialog from "@dvargas92495/ui/dist/components/FormDialog";
import Queue from "@dvargas92495/ui/dist/components/Queue";
import StringField from "@dvargas92495/ui/dist/components/StringField";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Layout, { LayoutHead } from "../_common/Layout";
import type { Props } from "./[id].data";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import NumberField from "@dvargas92495/ui/dist/components/NumberField";
import { loadStripe } from "@stripe/stripe-js";
import type { Handler as FundHandler } from "../../functions/project-fund/post";
import Box from "@mui/material/Box";

type ProjectFundButtonProps = {
  uuid: string;
  name: string;
  isOpen?: boolean;
};

const stripe = loadStripe(process.env.STRIPE_PUBLIC_KEY || "");

const ProjectFundButtonDialog: React.FunctionComponent<
  ProjectFundButtonProps & {
    handler: FundHandler;
  }
> = ({ name, uuid, handler, isOpen = false }) => {
  return (
    <FormDialog<{ funding: number }>
      defaultIsOpen={isOpen}
      title={name}
      contentText={`Funding will be held in escrow until completion of the project.`}
      buttonText={"FUND"}
      onSave={({ funding }) =>
        handler({
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

const SignedInFundButton: React.FunctionComponent<ProjectFundButtonProps> = (
  props
) => {
  const postHandler = useAuthenticatedHandler<FundHandler>({
    method: "POST",
    path: "project-fund",
  });
  return <ProjectFundButtonDialog {...props} handler={postHandler} />;
};

const SignedOutFundButton: React.FunctionComponent<ProjectFundButtonProps> = (
  props
) => {
  const postHandler = useHandler<FundHandler>({
    method: "POST",
    path: "project-fund",
  });
  return <ProjectFundButtonDialog {...props} handler={postHandler} />;
};

const ProjectFundButton: React.FunctionComponent<ProjectFundButtonProps> = (
  props
) => {
  return (
    <>
      <SignedIn>
        <SignedInFundButton {...props} />
      </SignedIn>
      <SignedOut>
        <SignedOutFundButton {...props} />
      </SignedOut>
    </>
  );
};

const BoardPage = ({ name, projects }: Props): React.ReactElement => {
  const [search, setSearch] = useState("");
  const mapper = useCallback(
    (item: Props["projects"][number]) => ({
      avatar: (
        <Box sx={{ minWidth: "100px", fontSize: 8 }}>
          {Math.floor((item.progress / item.target) * 100)}% of ${item.target}{" "}
          Funded
        </Box>
      ),
      primary: item.name,
      secondary: (
        <span>
          <a href={`/projects/${item.uuid}`}>Details</a>
        </span>
      ),
      action: <ProjectFundButton uuid={item.uuid} name={item.name} />,
      key: item.uuid,
    }),
    []
  );
  const filter = useCallback(
    (item) =>
      !search || item.primary.toLowerCase().indexOf(search.toLowerCase()) > -1,
    [search]
  );
  return (
    <Layout>
      <Box
        sx={{
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <Box sx={{ marginBottom: "16px", padding: "0 16px" }}>
          <StringField
            value={search}
            setValue={setSearch}
            label={"Search"}
            fullWidth
          />
        </Box>
        <Box
          sx={{
            padding: 8,
            width: "100%",
            height: "512px",
          }}
        >
          <Queue
            title={name}
            loadItems={() => Promise.resolve(projects)}
            mapper={mapper}
            filter={filter}
            subheader={"Fund a project to move it up in priority!"}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export const Head = ({ name }: { name: string }) => <LayoutHead title={name} />;

export default BoardPage;
