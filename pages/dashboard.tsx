import React, { useEffect, useMemo, useState, useCallback } from "react";
import { LayoutHead } from "./_common/Layout";
import Document from "@dvargas92495/ui/dist/components/Document";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import type { Handler as GetHandler } from "../functions/funding-boards/get";
import type { Handler as GetLinkHandler } from "../functions/funding-board-projects/get";
import type { Handler as PostHandler } from "../functions/funding-board/post";
import type { Handler as PostLinkHandler } from "../functions/funding-board-project/post";
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
import AddIcon from "@mui/icons-material/Add";
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
import NumberField from "@dvargas92495/ui/dist/components/NumberField";

type FundingBoardProject = {
  uuid: string;
  name: string;
  link: string;
  target: number;
};

type Column = {
  id: keyof FundingBoardProject;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
};

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "link", label: "Description Link", minWidth: 240 },
  {
    id: "target",
    label: "Funding Target",
    minWidth: 120,
    align: "right",
    format: (value: number) => `$${value}`,
  },
];

type TabItem = { text: string; id: string };
const FundingBoardTabContent = ({ id, text }: TabItem) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<FundingBoardProject[]>([]);
  const getFundingBoardProjects = useAuthenticatedHandler<GetLinkHandler>({
    method: "GET",
    path: "funding-board-projects",
  });
  const postFundingBoardProject = useAuthenticatedHandler<PostLinkHandler>({
    method: "POST",
    path: "funding-board-project",
  });

  const handleChangePage = useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    },
    [setPage, setRowsPerPage]
  );
  const refresh = useCallback(
    () =>
      getFundingBoardProjects({
        board: id,
        offset: page * rowsPerPage,
        limit: rowsPerPage,
      }).then((r) => {
        setRows([]);
      }),
    [id, page, rowsPerPage, setRows]
  );
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h1>{text}</h1>
        <FormDialog<Omit<Parameters<PostLinkHandler>[0], "user" | "board">>
          title={"New Funding Board Project"}
          buttonText={
            <>
              <AddIcon /> New
            </>
          }
          formElements={{
            name: {
              defaultValue: '',
              order: 0,
              component: StringField,
              validate: (s) => !!s ? '' : "`name` is required"
            },
            link: {
              defaultValue: '',
              order: 1,
              component: StringField,
              validate: () => ''
            },
            target: {
              defaultValue: 100,
              order: 2,
              component: NumberField,
              validate: (n) => n > 0 ? '' : "`target` must be greater than 0"
            },
          }}
          onSave={(body) =>
            postFundingBoardProject({ ...body, board: id }).then(refresh)
          }
        />
      </Box>
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
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.uuid}
                    >
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
    </>
  );
};

const DRAWER_WIDTH = 240;
const TABS = [
  { text: "Home", Icon: HomeIcon, content: () => <h1>Home</h1>, nested: false },
  {
    text: "Funding Board",
    Icon: FundingBoardIcon,
    content: FundingBoardTabContent,
    nested: true,
  },
] as const;

const NestedTab = ({
  getItems,
  text,
  Icon,
  setTab,
  newItem,
}: {
  getItems: () => Promise<TabItem[]>;
  newItem: (p: { name: string }) => Promise<TabItem>;
  text: string;
  Icon: typeof StarBorderIcon;
  setTab: (i: TabItem) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<TabItem[]>([]);
  useEffect(() => {
    getItems().then(setItems);
  }, [getItems, setItems]);
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
              onClick={() => setTab(item)}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
          <FormDialog<{ name: string }>
            title={`Create ${text}`}
            onSave={(body) =>
              newItem(body).then((item) => {
                setItems([...items, item]);
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

type NestedTabRecord<T> = {
  [k in typeof TABS[number] as k["nested"] extends true ? k["text"] : never]: T;
};
const Dashboard = () => {
  const user = useUser();
  const [tab, setTab] = useState(0);
  const [nestedTab, setNestedTab] = useState<TabItem>();
  const TabContent = TABS[tab].content;
  const getFundingBoards = useAuthenticatedHandler<GetHandler>({
    method: "GET",
    path: "funding-boards",
  });
  const postFundingBoard = useAuthenticatedHandler<PostHandler>({
    method: "POST",
    path: "funding-board",
  });
  type NestedTabProps = Parameters<typeof NestedTab>[0];
  const getItemsByTab: NestedTabRecord<NestedTabProps["getItems"]> = useMemo(
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
  const newItemByTab: NestedTabRecord<NestedTabProps["newItem"]> = useMemo(
    () => ({
      "Funding Board": ((body) =>
        postFundingBoard(body).then((r) => ({
          id: r.uuid,
          text: body.name,
        }))) as NestedTabProps["newItem"],
    }),
    [postFundingBoard]
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
                setTab={(tab) => {
                  setTab(index);
                  setNestedTab(tab);
                }}
                getItems={getItemsByTab[text as keyof typeof getItemsByTab]}
                newItem={newItemByTab[text as keyof typeof newItemByTab]}
              />
            ) : (
              <ListItem
                button
                key={index}
                onClick={() => {
                  setTab(index);
                  setNestedTab(undefined);
                }}
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
        <TabContent {...(nestedTab || { id: "Home", text: "Home" })} />
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
