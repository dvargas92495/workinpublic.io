import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import connectTypeorm from "@dvargas92495/api/connectTypeorm";
import FundingBoardProject from "../../db/funding_board_project";
import FundingBoard, { FundingBoardSchema } from "../../db/funding_board";
import Project from "../../db/project";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import axios from "axios";

const LINK_ADAPTERS: {
  regex: RegExp;
  mapper: (...s: string[]) => Promise<string | undefined>;
}[] = [
  {
    regex: /^https:\/\/github.com\/([^/]+)\/([^/]+)\/projects\/(\d+)$/,
    mapper: (_, user, repo, number) =>
      axios
        .get<{ body: string; number: number }[]>(
          `https://api.github.com/repos/${user}/${repo}/projects`,
          {
            headers: {
              Accept: 'application/vnd.github.inertia-preview+json"',
            },
          }
        )
        .then((r) => r.data.find((p) => p.number === Number(number))?.body),
  },
  {
    regex: /^https:\/\/github.com\/([^/]+)\/([^/]+)\/issues\/(\d+)$/,
    mapper: (_, user, repo, number) =>
      axios
        .get<{ body: string }>(
          `https://api.github.com/repos/${user}/${repo}/issues/${number}`
        )
        .then((r) => r.data.body),
  },
];

const DEFAULT_MAPPER = (s: string) =>
  Promise.resolve(`No content found for link ${s}`);

const getContent = (link: string): Promise<string> => {
  const { regex, mapper } = LINK_ADAPTERS.find(({ regex }) =>
    regex.test(link)
  ) || {
    regex: /^.*$/,
    mapper: DEFAULT_MAPPER,
  };
  return mapper(...(regex.exec(link) || []))
    .then((s) => s || DEFAULT_MAPPER(link))
    .catch((e) => {
      console.log(e.response?.data);
      return DEFAULT_MAPPER(link);
    });
};

const logic = ({ uuid }: { uuid: string }) =>
  connectTypeorm([FundingBoardProject, Project, FundingBoard])
    .then((con) =>
      Promise.all([
        con.getRepository(Project).findOne(uuid),
        con.getRepository(FundingBoardProject).find({
          where: { project: uuid },
          relations: ["funding_board"],
        }),
      ])
    )
    .then(([project, fundingBoardProjects]) => {
      if (!project) {
        throw new NotFoundError(`Could not find project with uuid ${uuid}`);
      }
      return getContent(project.link).then((content) => ({
        name: project.name || "",
        target: project.target || 0,
        progress: project.progress || 0,
        boards: fundingBoardProjects.map(({ funding_board }) => {
          const { user_id, ...rest } = funding_board as FundingBoardSchema;
          return rest;
        }),
        content,
      }));
    });

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
