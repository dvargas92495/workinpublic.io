import React, { useCallback, useMemo, useState } from "react";
import FormDialog from "@dvargas92495/ui/dist/components/FormDialog";
import Queue from "@dvargas92495/ui/dist/components/Queue";
import StringField from "@dvargas92495/ui/dist/components/StringField";
import Layout, { LayoutHead } from "../_common/Layout";
import type { Props } from "./[id].data";
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

const ProjectFundButton: React.FunctionComponent<ProjectFundButtonProps> = (
  props
) => {
  const postHandler = useHandler<FundHandler>({
    method: "POST",
    path: "project-fund",
  });
  return <ProjectFundButtonDialog {...props} handler={postHandler} />;
};

type Project = Props["projects"][number] & { percentProgress: number };

export const BoardComponent = ({
  name,
  projects = [],
  root = ''
}: Props & {root?: string}): React.ReactElement => {
  const [search, setSearch] = useState("");
  const mapper = useCallback(
    (item: Project) => ({
      avatar: (
        <Box sx={{ minWidth: "100px", fontSize: 8 }}>
          {Math.floor((item.progress / item.target) * 100)}% of ${item.target}{" "}
          Funded
        </Box>
      ),
      primary: item.name,
      secondary: (
        <span>
          <a href={`${root}/projects/${item.uuid}`}>Details</a>
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
  const initialItems = useMemo(
    () =>
      projects
        .map((p) => ({
          ...p,
          percentProgress: p.progress / p.target,
        }))
        .sort(
          (
            { percentProgress: a, name: aname },
            { percentProgress: b, name: bname }
          ) => (b === a ? aname.localeCompare(bname) : b - a)
        ),
    [projects]
  );
  return (
    <Box
      sx={{
        maxWidth: "800px",
        width: "100%",
      }}
    >
      <Box sx={{ marginBottom: "16px", padding: "0 16px", width: "100%" }}>
        <StringField
          value={search}
          setValue={setSearch}
          label={"Search"}
          fullWidth
        />
      </Box>
      <Box
        sx={{
          p: 2,
          width: "100%",
          height: "512px",
        }}
      >
        <Queue<Project>
          title={name}
          initialItems={initialItems}
          mapper={mapper}
          filter={filter}
          subheader={"Fund a project to move it up in priority!"}
        />
      </Box>
    </Box>
  );
};

const BoardPage = (props: Props): React.ReactElement => (
  <Layout>
    <BoardComponent {...props} />
  </Layout>
);

export const Head = ({ name }: { name: string }) => <LayoutHead title={name} />;

export default BoardPage;
