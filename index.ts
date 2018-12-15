import QuadTree, { QuadTreeNode } from "./QuadTree/";
import Rect, { x0, y0, width, height } from "./basic-geometry/Rect";
import Circle from "./basic-geometry/Circle";

const canvas = document.querySelector("canvas");
const debugCheckbox = document.querySelector("#debug-lines");
const comicSans = document.querySelector("#comic-sans");
const sideLengthInput: HTMLInputElement = document.querySelector(
  "#side-length"
);

const WIDTH = 512;
const HEIGHT = 512;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "#64b5f6";
ctx.strokeStyle = "#616161";
ctx.lineWidth = 1;

let quadTree = new QuadTree(WIDTH, HEIGHT, true);
let debugLines = false;

// just for easy debugging
// @ts-ignore
window.quadTree = quadTree;

const reloadTree = size => {
  quadTree = new QuadTree(WIDTH, HEIGHT, true, size);
};

const drawRect = (rect: Rect, value) => {
  if (value === true) {
    ctx.fillRect(x0(rect), y0(rect), width(rect), height(rect));
  }
  if (debugLines) {
    ctx.strokeRect(x0(rect), y0(rect), width(rect), height(rect));
  }
};

const drawNode = (node: QuadTreeNode) => {
  if (node.divided) {
    node.getChildren().forEach(drawNode);
    return;
  }
  drawRect(node.rect, node.value);
};

const update = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNode(quadTree.root);
};

const onCanvasClick = (event: Event) => {
  const { x, y } = getMousePos(canvas, event);
  const circle = [x, y, 20] as Circle;
  quadTree.drawCircle(circle, false);
  update();
};

const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(evt.clientX - rect.left),
    y: Math.floor(evt.clientY - rect.top)
  };
};

const onCheckboxUpdate = event => {
  debugLines = event.target.checked;
  update();
};

canvas.addEventListener("click", onCanvasClick);
debugCheckbox.addEventListener("click", onCheckboxUpdate);
comicSans.addEventListener("click", () => {
  const sansify = (node: Element) => node.classList.add("sans");

  document.querySelectorAll("*").forEach(sansify);
});

sideLengthInput.addEventListener("input", (event: Event) => {
  const size = parseInt(sideLengthInput.value);
  reloadTree(size);
  update();
});

update();
