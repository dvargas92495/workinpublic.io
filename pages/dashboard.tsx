import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  MutableRefObject,
  useRef,
} from "react";
import { LayoutHead } from "./_common/Layout";
import Document from "@dvargas92495/ui/dist/components/Document";
import RedirectToLogin from "@dvargas92495/ui/dist/components/RedirectToLogin";
import useAuthenticatedHandler from "@dvargas92495/ui/dist/useAuthenticatedHandler";
import type { Handler as GetHandler } from "../functions/funding-boards/get";
import type { Handler as GetLinkHandler } from "../functions/funding-board-projects/get";
import type { Handler as PostHandler } from "../functions/funding-board/post";
import type { Handler as PostLinkHandler } from "../functions/funding-board-project/post";
import type { Handler as PutHandler } from "../functions/funding-board/put";
import type { Handler as DeleteHandler } from "../functions/funding-board/delete";
import type { Handler as PutProjectHandler } from "../functions/project/put";
import type { Handler as DeleteLinkHandler } from "../functions/funding-board-project/delete";
import type { Handler as GetStripeHandler } from "../functions/stripe/get";
import type { Handler as StripeHandler } from "../functions/stripe/post";
import { SignedIn, useUser, UserButton } from "@clerk/clerk-react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import FundingBoardIcon from "@mui/icons-material/DeveloperBoard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Card from "@dvargas92495/ui/dist/components/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import FormDialog from "@dvargas92495/ui/dist/components/FormDialog";
import StringField from "@dvargas92495/ui/dist/components/StringField";
import NumberField from "@dvargas92495/ui/dist/components/NumberField";
import ConfirmationDialog from "@dvargas92495/ui/dist/components/ConfirmationDialog";
import H1 from "@dvargas92495/ui/dist/components/H1";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import GlobalStyles from "@mui/material/GlobalStyles";

const HomeContent = () => {
  const [mounted, setMounted] = useState(false);
  const [connected, setConnected] = useState<boolean | "redirecting">(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState("");
  const getStripe = useAuthenticatedHandler<GetStripeHandler>({
    method: "GET",
    path: "stripe",
  });
  const postStripe = useAuthenticatedHandler<StripeHandler>({
    method: "POST",
    path: "stripe",
  });
  const stripeConnectOnClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (stripeLoading) {
        return;
      }
      setError("");
      setStripeLoading(true);
      postStripe()
        .then((r) => {
          window.location.assign(r.url);
        })
        .catch((e) => {
          setError(e.response?.data || e.message);
          setStripeLoading(false);
        });
    },
    [setStripeLoading, setError, stripeLoading, postStripe]
  );
  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search).entries()
    ) as Omit<Parameters<GetStripeHandler>[0], "user">;
    getStripe(params).then((r) => {
      setMounted(true);
      setConnected(r.connected);
      if (r.url) {
        window.location.assign(r.url);
      }
    });
  }, [setMounted, getStripe]);
  return (
    <>
      <H1>Home</H1>
      <Card title={"Connected Bank"}>
        {mounted ? (
          <Box display={"flex"} alignItems={"center"}>
            {connected === 'redirecting' ? <span>Redirecting...</span> : connected ? (
              <span>Connected!</span>
            ) : (
              <Link
                href="#"
                sx={{
                  ...(stripeLoading
                    ? {
                        background: "#7a73ff",
                        cursor: "not-allowed",
                      }
                    : { background: "#635bff" }),
                  display: "inline-block",
                  height: "38px",
                  textDecoration: "none",
                  width: "180px",
                  borderRadius: "4px",
                  userSelect: "none",
                  marginRight: "16px",
                  ":hover": {
                    background: "#7a73ff",
                  },
                }}
                onClick={stripeConnectOnClick}
              >
                <Box
                  component="span"
                  sx={{
                    color: "#ffffff",
                    display: "block",
                    fontFamily:
                      'sohne-var, "Helvetica Neue", Arial, sans-serif',
                    fontSize: "15px",
                    fontWeight: "400",
                    lineHeight: "14px",
                    padding: "11px 0px 0px 24px",
                    position: "relative",
                    textAlign: "left",
                    "::after": {
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "49.58px",
                      content: '""',
                      height: "20px",
                      left: "62%",
                      position: "absolute",
                      top: "28.95%",
                      width: "49.58px",
                      backgroundImage: `url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 23.0.4, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 468 222.5' style='enable-background:new 0 0 468 222.5;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%23FFFFFF;%7D%0A%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3 c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z'/%3E%3Cpath class='st0' d='M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3 c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1 c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z'/%3E%3Cpolygon class='st0' points='223.8,61.7 248.9,56.3 248.9,36 223.8,41.3 '/%3E%3Crect x='223.8' y='69.3' class='st0' width='25.1' height='87.5'/%3E%3Cpath class='st0' d='M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z'/%3E%3Cpath class='st0' d='M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135 c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z'/%3E%3Cpath class='st0' d='M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6 C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7 c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z'/%3E%3C/g%3E%3C/svg%3E")`,
                    },
                  }}
                >
                  Connect with
                </Box>
              </Link>
            )}
            {stripeLoading && <CircularProgress size={24} />}
          </Box>
        ) : (
          <Skeleton variant={"rectangular"} />
        )}
        <Typography variant={"body2"} color={"error"}>
          {error}
        </Typography>
      </Card>
    </>
  );
};

type FundingBoardProject = {
  uuid: string;
  linkUuid: string;
  name: string;
  link: string;
  target: number;
};

type Column = {
  id: keyof FundingBoardProject;
  label: string;
  minWidth?: number;
  align?: "right";
};

const columns: readonly Column[] = [
  {
    id: "name",
    label: "Name",
    minWidth: 170,
  },
  { id: "link", label: "Description Link", minWidth: 240 },
  {
    id: "target",
    label: "Funding Target",
    minWidth: 120,
    align: "right",
  },
];

const EditableHeader = ({
  text,
  onSave,
}: {
  text: string;
  onSave: (s: string) => Promise<unknown>;
}) => {
  const [shown, setShown] = useState(false);
  const show = useCallback(() => setShown(true), [setShown]);
  const hide = useCallback(() => setShown(false), [setShown]);
  const [editing, setEditing] = useState(false);
  const edit = useCallback(() => setEditing(true), [setShown]);
  const view = useCallback(() => setEditing(false), [setShown]);
  const [value, setValue] = useState(text);
  return editing ? (
    <FilledInput
      value={value}
      onChange={(e) => setValue(e.target.value)}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={() => onSave(value).then(view)}>
            <CheckIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setValue(text);
              view();
            }}
          >
            <CancelIcon />
          </IconButton>
        </InputAdornment>
      }
    />
  ) : (
    <H1
      onMouseEnter={show}
      onMouseMove={shown ? undefined : show}
      onMouseLeave={hide}
      sx={{
        pr: 8,
        display: "flex",
        alignItems: "center",
      }}
    >
      {text}
      {shown && (
        <IconButton onClick={edit} sx={{ ml: 2 }}>
          <EditIcon />
        </IconButton>
      )}
    </H1>
  );
};

type TabItem = { text: string; id: string };
const FundingBoardTabContent = ({
  id,
  text,
  onTextChange,
  onTabDelete,
}: TabItem & {
  onTextChange: (s: string) => void;
  onTabDelete: () => void;
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<FundingBoardProject[]>([]);
  const [loading, setLoading] = useState(false);
  const getFundingBoardProjects = useAuthenticatedHandler<GetLinkHandler>({
    method: "GET",
    path: "funding-board-projects",
  });
  const postFundingBoardProject = useAuthenticatedHandler<PostLinkHandler>({
    method: "POST",
    path: "funding-board-project",
  });
  const putFundingBoard = useAuthenticatedHandler<PutHandler>({
    method: "PUT",
    path: "funding-board",
  });
  const deleteFundingBoard = useAuthenticatedHandler<DeleteHandler>({
    method: "DELETE",
    path: "funding-board",
  });
  const putProject = useAuthenticatedHandler<PutProjectHandler>({
    method: "PUT",
    path: "project",
  });
  const deleteFundingBoardProject = useAuthenticatedHandler<DeleteLinkHandler>({
    method: "DELETE",
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
  const refresh = useCallback(() => {
    setLoading(true);
    return getFundingBoardProjects({
      board: id,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    })
      .then((r) => {
        setRows(r.fundingBoardProjects);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [id, page, rowsPerPage, setRows, setLoading]);
  type ProjectBody = Omit<Parameters<PutProjectHandler>[0], "user" | "uuid">;
  const formatByColumnId: Record<
    Exclude<keyof FundingBoardProject, "uuid" | "linkUuid">,
    (
      value: string | number,
      p: FundingBoardProject,
      rows: FundingBoardProject[]
    ) => React.ReactNode
  > = useMemo(
    () =>
      ({
        name: (value, p, rows) => (
          <FormDialog<Required<ProjectBody>>
            title={`Edit Project: ${value}`}
            formElements={{
              name: {
                defaultValue: value as string,
                order: 0,
                component: StringField,
                validate: (s) => (!!s ? "" : "`name` is required"),
              },
              link: {
                defaultValue: p.link,
                order: 1,
                component: StringField,
                validate: () => "",
              },
              target: {
                defaultValue: p.target,
                order: 2,
                component: NumberField,
                validate: (n) =>
                  n > 0 ? "" : "`target` must be greater than 0",
              },
            }}
            buttonText={value}
            Button={({ onClick, children }) => (
              <Box
                component={"span"}
                sx={{ cursor: "pointer" }}
                onClick={onClick}
              >
                {children}
              </Box>
            )}
            onSave={(body) => {
              const diffBody = Object.fromEntries(
                Object.entries(body).filter(
                  ([k, v]) => p[k as keyof typeof body] !== v
                )
              ) as Partial<ProjectBody>;
              return putProject({ ...diffBody, uuid: p.uuid }).then(
                (r) =>
                  r.success &&
                  setRows(
                    rows.map((row) =>
                      row.uuid === p.uuid ? { ...row, ...diffBody } : row
                    )
                  )
              );
            }}
          />
        ),
        link: (value) => value,
        target: (value) => `$${value}`,
      } as const),
    [putProject]
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
        sx={{ height: "152px" }}
      >
        <EditableHeader
          text={text}
          onSave={(name) =>
            putFundingBoard({ name, uuid: id }).then((r) => {
              if (r.success) {
                onTextChange(name);
              }
            })
          }
        />
        <FormDialog<Omit<Parameters<PostLinkHandler>[0], "user" | "board">>
          title={"New Funding Board Project"}
          buttonText={"New"}
          Button={(props) => <Button {...props} startIcon={<AddIcon />} />}
          formElements={{
            name: {
              defaultValue: "",
              order: 0,
              component: StringField,
              validate: (s) => (!!s ? "" : "`name` is required"),
            },
            link: {
              defaultValue: "",
              order: 1,
              component: StringField,
              validate: () => "",
            },
            target: {
              defaultValue: 100,
              order: 2,
              component: NumberField,
              validate: (n) => (n > 0 ? "" : "`target` must be greater than 0"),
            },
          }}
          onSave={(body) =>
            postFundingBoardProject({ ...body, board: id }).then(refresh)
          }
        />
      </Box>
      <Box flexGrow={1}>
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
                  <TableCell />
                </TableRow>
              </TableHead>
              {loading ? (
                <Skeleton variant="rectangular" />
              ) : (
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
                                {formatByColumnId[
                                  column.id as keyof typeof formatByColumnId
                                ](value, row, rows)}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <ConfirmationDialog
                              content={
                                "Are you sure you want to remove this project from this funding board?"
                              }
                              color={"error"}
                              title={`Remove ${row.name} Project`}
                              action={() =>
                                deleteFundingBoardProject({
                                  uuid: row.linkUuid,
                                }).then(
                                  (r) =>
                                    r.success &&
                                    setRows(
                                      rows.filter((rw) => rw.uuid !== row.uuid)
                                    )
                                )
                              }
                              buttonText={<DeleteIcon />}
                              Button={IconButton}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              )}
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
      </Box>
      <Box sx={{ minHeight: "64px" }}>
        <ConfirmationDialog
          content={"Are you sure you want to delete this funding board?"}
          buttonText={"Delete"}
          color={"error"}
          title={`Delete ${text} Funding Board`}
          action={() => deleteFundingBoard({ uuid: id }).then(onTabDelete)}
        />
      </Box>
    </>
  );
};

const DRAWER_WIDTH = 240;
const TABS = [
  { text: "Home", Icon: HomeIcon, content: HomeContent, nested: false },
  {
    text: "Funding Board",
    Icon: FundingBoardIcon,
    content: FundingBoardTabContent,
    nested: true,
  },
] as const;
type TabText = typeof TABS[number]["text"];
type RefreshRef = Record<TabText, () => Promise<unknown>>;

const NestedTab = ({
  getItems,
  text,
  Icon,
  setTab,
  newItem,
  refreshRef,
}: {
  getItems: () => Promise<TabItem[]>;
  newItem: (p: { name: string }) => Promise<TabItem>;
  text: TabText;
  Icon: typeof StarBorderIcon;
  setTab: (i: TabItem) => void;
  refreshRef: MutableRefObject<RefreshRef>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<TabItem[]>([]);
  refreshRef.current[text] = useCallback(
    () => getItems().then(setItems),
    [getItems, setItems]
  );
  useEffect(() => {
    refreshRef.current[text]();
  }, [refreshRef, text]);
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
            Button={({ onClick, children }) => (
              <ListItemButton sx={{ pl: 4 }} onClick={onClick}>
                <ListItemIcon sx={{ color: "inherit" }}>
                  <AddCircleOutlineSharpIcon />
                </ListItemIcon>
                <ListItemText primary={children} />
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
  const [nestedTab, setNestedTab] = useState<TabItem>({
    id: "Home",
    text: "Home",
  });
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
  const refreshRef = useRef<RefreshRef>(
    Object.fromEntries(
      TABS.map((t) => [t.text, () => Promise.resolve()])
    ) as RefreshRef
  );
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
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
                refreshRef={refreshRef}
              />
            ) : (
              <ListItem
                button
                key={index}
                onClick={() => {
                  setTab(index);
                  setNestedTab({
                    id: TABS[index].text,
                    text: TABS[index].text,
                  });
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
        flexDirection={"column"}
        display={"flex"}
      >
        <Toolbar />
        <Box flexGrow={1} display={"flex"} flexDirection={"column"}>
          <TabContent
            {...nestedTab}
            onTextChange={(text) => {
              setNestedTab({ ...nestedTab, text });
              refreshRef.current[TABS[tab].text]();
            }}
            onTabDelete={refreshRef.current[TABS[tab].text]}
          />
        </Box>
      </Box>
    </Box>
  );
};

const globalStyles = (
  <GlobalStyles
    styles={{
      html: { height: "100%" },
      body: { height: "100%" },
      "body > div[data-reactroot]": { height: "100%" },
    }}
  />
);

const DashboardPage: React.FunctionComponent = () => (
  <Document>
    {globalStyles}
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
