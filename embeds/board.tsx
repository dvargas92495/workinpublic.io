import React from "react";
import ReactDOM from "react-dom";
import { BoardComponent } from "../pages/board/[id]";

const boardId = process.env.FUNDING_BOARD_UUID || "";
const propString = JSON.stringify(
  process.env.FUNDING_BOARD_PROPS || { name: "", projects: [] }
);
const props = JSON.parse(propString);

const render = () =>
  ReactDOM.render(
    <BoardComponent {...props} root={process.env.ORIGIN} />,
    document.getElementById(boardId)
  );

if (document.readyState === "complete") {
  render();
} else {
  window.addEventListener("load", render);
}
