import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import About from "@dvargas92495/ui/dist/components/About";
import Box from "@mui/material/Box";
import Body from "@dvargas92495/ui/dist/components/Body";
import ExternalLink from "@dvargas92495/ui/dist/components/ExternalLink";

const AboutPage: React.FunctionComponent = () => (
  <Layout>
    <About
      title={"WorkInPublic"}
      subtitle={
        "A suite of tools that help you sustainably run publicly funded and publicly beneficial projects."
      }
      paragraphs={[
        "It is traditionally very difficult to work on public goods sustainably because the output is:",
        <ul>
          <li>
            <Body>
              <b>Non-excludable</b> - It's impossible to provide the good and
              exclude it from others.
            </Body>
          </li>
          <li>
            <Body>
              <b>Non-rivalrous</b> - Consuming the good does not reduce the
              amount from others.
            </Body>
          </li>
        </ul>,
        "Most private goods either exclude or limit supply and therefore could charge based on those properties for access to the good. Without these funding mechanisms, how could we incentivize creators and organizations to sustainably work on funding goods?",
        "WorkInPublic aims to tackle this problem. It is a library of products that will help enable creators to work in the public domain sustainably. With any given public good, there are several people willing to put in the time to make the idea come to life, and several people willing to put up the funding to make the idea come to life. The key will be connecting these two parties through various protocols and tools.",
        "One way to think of public goods funding is with the following 2x2 matrix:",
        <Box
          component={"table"}
          sx={{
            td: {
              border: "1px solid #333333",
              padding: "16px",
            },
            borderSpacing: 0,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <Box component={"tr"} sx={{ background: "#33333333" }}>
              <Box component={"td"} sx={{ background: "white" }}>
                WorkInPublic
              </Box>
              <td>Funder Known</td>
              <td>Funder Unknown</td>
            </Box>
          </thead>
          <tbody>
            <tr>
              <Box component={"td"} sx={{ background: "#33333333" }}>
                Creator Known
              </Box>
              <td>Government</td>
              <td>Funding Board</td>
            </tr>
            <tr>
              <Box component={"td"} sx={{ background: "#33333333" }}>
                Creator Unknown
              </Box>
              <td>Bounty Board</td>
              <td>Open Market</td>
            </tr>
          </tbody>
        </Box>,
        "The top left quadrant is solved in the sense that there is already a place where one could go to solve known public problems with secured public funding. However, the other three quadrants represent the other common situations where for a given public problem, either the people to work on it or the people to fund it are unknown. Each of these quadrants represents a product that is either live or still to come in WorkInPublic.",
        "The following is a list of resources that inspire the motivating ideas for this library:",
        <ul>
          <li>
            <Body>
              <ExternalLink href={"https://fundingthecommons.io/"}>
                Funding the Commons
              </ExternalLink>{" "}
              - a virtual summit for individuals and organizations building new
              models of sustainable public goods funding.
            </Body>
          </li>
        </ul>,
      ]}
    />
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"About"} />;
export default AboutPage;
