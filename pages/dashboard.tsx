import React, { useEffect, useMemo, useState } from "react";
import { LayoutHead } from "./_common/Layout";
import Document from "@dvargas92495/ui/dist/components/Document";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import type { Handler as GetHandler } from "../functions/funding-boards/get";
import type { Handler as PostHandler } from "../functions/funding-board/post";
import { SignedIn, useUser, UserButton } from "@clerk/clerk-react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import FundingBoardIcon from "@mui/icons-material/DeveloperBoard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import FormDialog from "@dvargas92495/ui/dist/components/FormDialog";
import StringField from "@dvargas92495/ui/dist/components/StringField";

interface Column {
  id: "name" | "code" | "population" | "size" | "density";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
  {
    id: "population",
    label: "Population",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Size\u00a0(km\u00b2)",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "Density",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number
): Data {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126317000, 377973),
  createData("France", "FR", 67022000, 640679),
  createData("United Kingdom", "GB", 67545757, 242495),
  createData("Russia", "RU", 146793744, 17098246),
  createData("Nigeria", "NG", 200962417, 923768),
  createData("Brazil", "BR", 210147125, 8515767),
];

const StickyHeadTable = ({ id }: { id: string }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    console.log("fetch by id", id);
  }, [id]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const DRAWER_WIDTH = 240;
const TABS = [
  { text: "Home", Icon: HomeIcon, content: () => <div />, nested: false },
  {
    text: "Funding Board",
    Icon: FundingBoardIcon,
    content: StickyHeadTable,
    nested: true,
  },
] as const;

type PostHandlerBody = Omit<Parameters<PostHandler>[0], "user">;
type TabItem = { text: string; id: string };
const NestedTab = ({
  getItems,
  text,
  Icon,
  setTab,
}: {
  getItems: () => Promise<TabItem[]>;
  text: string;
  Icon: typeof StarBorderIcon;
  setTab: (is: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<TabItem[]>([]);
  const postFundingBoard = useAuthenticatedHandler<PostHandler>({
    method: "POST",
    path: "funding-board",
  });
  useEffect(() => {
    getItems().then(setItems);
  }, [getItems, setItems, postFundingBoard]);
  return (
    <>
      <ListItemButton onClick={() => setIsOpen(!isOpen)}>
        <ListItemIcon sx={{ color: "inherit" }}>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={text} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item) => (
            <ListItemButton
              sx={{ pl: 4 }}
              key={item.id}
              onClick={() => setTab(item.id)}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
          <FormDialog<PostHandlerBody>
            title={"Create Funding Board"}
            onSave={(body) =>
              postFundingBoard(body).then((r) => {
                setItems([...items, { id: r.uuid, text: body.name }]);
              })
            }
            formElements={{
              name: {
                defaultValue: "",
                validate: (n: string) => (!!n ? "" : "Name is required"),
                component: StringField,
                order: 0,
              },
            }}
            buttonText={"Create"}
            Button={({ onClick, buttonText }) => (
              <ListItemButton sx={{ pl: 4 }} onClick={onClick}>
                <ListItemIcon sx={{ color: "inherit" }}>
                  <AddCircleOutlineSharpIcon />
                </ListItemIcon>
                <ListItemText primary={buttonText} />
              </ListItemButton>
            )}
          />
        </List>
      </Collapse>
    </>
  );
};

const Dashboard = () => {
  const user = useUser();
  const [tab, setTab] = useState({ index: 0, id: "" });
  const TabContent = TABS[tab.index].content;
  const getFundingBoards = useAuthenticatedHandler<GetHandler>({
    method: "GET",
    path: "funding-boards",
  });
  const getItemsByTab: {
    [k in typeof TABS[number] as k["nested"] extends true
      ? k["text"]
      : never]: Parameters<typeof NestedTab>[0]["getItems"];
  } = useMemo(
    () =>
      ({
        "Funding Board": () =>
          getFundingBoards()
            .then(({ fundingBoards }) =>
              fundingBoards.map(({ uuid, name }) => ({
                id: uuid,
                text: name,
              }))
            )
            .catch(() => []),
      } as const),
    [getFundingBoards]
  );
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
        }}
        color={"transparent"}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            color={(theme) => theme.palette.text.primary}
          >
            {user.firstName}'s Dashboard
          </Typography>
          <UserButton />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "#333333",
            color: "white",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {TABS.map(({ text, Icon, nested }, index) =>
            nested ? (
              <NestedTab
                key={index}
                Icon={Icon}
                text={text}
                setTab={(id) => setTab({ index, id })}
                getItems={getItemsByTab[text as keyof typeof getItemsByTab]}
              />
            ) : (
              <ListItem
                button
                key={index}
                onClick={() => setTab({ index, id: "" })}
                sx={{ display: "flex" }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          color: "text.primary",
        }}
      >
        <Toolbar />
        <h1>{TABS[tab.index].text}</h1>
        {<TabContent id={tab.id} />}
      </Box>
    </Box>
  );
};

const DashboardPage: React.FunctionComponent = () => (
  <Document>
    <SignedIn>
      <Dashboard />
    </SignedIn>
    <RedirectToLogin />
  </Document>
);

export const Head = (): React.ReactElement => (
  <LayoutHead title={"Dashboard"} />
);
export default DashboardPage;
