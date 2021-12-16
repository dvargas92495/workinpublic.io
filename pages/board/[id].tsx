import React, { useCallback, useMemo, useState } from "react";
import FormDialog from "@dvargas92495/ui/dist/components/FormDialog";
import Queue from "@dvargas92495/ui/dist/components/Queue";
import StringField from "@dvargas92495/ui/dist/components/StringField";
import Layout, { LayoutHead } from "../_common/Layout";
import type { Props } from "./[id].data";
import useHandler from "@dvargas92495/ui/dist/useHandler";
import type { Handler as IdeaHandler } from "../../functions/project-idea/post";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ProjectFundButton from "../_common/ProjectFundButton";

type Project = Props["projects"][number] & { percentProgress: number };

export const BoardComponent = ({
  uuid,
  name,
  projects = [],
  root = "",
}: Props & { root?: string }): React.ReactElement => {
  const [search, setSearch] = useState("");
  const postHandler = useHandler<IdeaHandler>({
    method: "POST",
    path: "project-idea",
  });
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
      <Box
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Have a project idea for the {name} Funding Board?</span>
        <FormDialog<{ name: string; description: string; email: string }>
          title={name}
          contentText={`Your idea will be submitted for review`}
          buttonText={"Submit An Idea"}
          onSave={(body) =>
            postHandler({
              uuid,
              ...body,
            })
          }
          formElements={{
            name: {
              order: 0,
              defaultValue: "",
              component: StringField,
              validate: (v) => (v ? "" : "Name is required"),
            },
            description: {
              order: 1,
              defaultValue: "",
              component: ({ value, setValue, ...rest }) => (
                <TextField
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  multiline
                  {...rest}
                />
              ),
              validate: (v) => (v ? "" : "Description is required"),
            },
            email: {
              order: 2,
              defaultValue: "",
              component: StringField,
              validate: (v) =>
                v.includes("@") ? "" : "Please enter a valid email address",
            },
          }}
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
