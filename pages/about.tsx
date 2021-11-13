import React from "react";
import Layout, { LayoutHead } from "./_common/Layout";
import About from "@dvargas92495/ui/dist/components/About";
import Box from "@mui/material/Box";

const AboutPage: React.FunctionComponent = () => (
  <Layout>
    <About
      title={"WorkInPublic"}
      subtitle={
        "A suite of tools that help you sustainably run publicly funded and publicly beneficial projects."
      }
      paragraphs={[
        "Working in the public domain (e.g. open-source software), is traditionally very difficult to do sustainably because the output is publicly accessible. However, this output is still incredibly valuable. Creators and organizations should be properly incentivized to work in this domain.",
        "WorkInPublic is a library of products that will help enable creators to work in the public domain sustainably. You can think of the public work space as a two by two matrix:",
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
        "Each of these quadrants represents a product that is either live or still to come.",
      ]}
    />
  </Layout>
);

export const Head = (): React.ReactElement => <LayoutHead title={"About"} />;
export default AboutPage;
