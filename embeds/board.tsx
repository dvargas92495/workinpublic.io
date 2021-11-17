import React from "react";
import ReactDOM from "react-dom";
import { BoardComponent } from "../pages/board/[id]";

const boardId = process.env.FUNDING_BOARD_UUID || "";
const propString = JSON.stringify(
  process.env.FUNDING_BOARD_PROPS || { name: "", projects: [] }
);
const props = JSON.parse(propString);

const currentScript = document.currentScript;
window.addEventListener("load", () => {
  if (document.head.contains(currentScript)) {
    ReactDOM.render(
      <BoardComponent {...props} />,
      document.getElementById(boardId)
    );
  } else if (document.body.contains(currentScript)) {
    const parent = currentScript.parentElement;
    const container = document.createElement("div");
    parent.insertBefore(container, currentScript);
    currentScript.remove();

    ReactDOM.render(<BoardComponent {...props} />, container);
  } else {
    throw new Error(`Failed to run WorkInPublic embed: Where is it?`);
  }
});
