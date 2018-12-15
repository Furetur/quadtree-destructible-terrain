import Point from "./Point";
import { curry } from "rambda";

type Rect = [number, number, number, number];

export const x0 = (rect: Rect) => rect[0];
export const y0 = (rect: Rect) => rect[1];
export const x1 = (rect: Rect) => rect[2];
export const y1 = (rect: Rect) => rect[3];

export const width = ([x0, y0, x1, y1]: Rect) => x1 - x0 + 1;
export const height = ([x0, y0, x1, y1]: Rect) => y1 - y0 + 1;

export const minimalSize = (rect: Rect) => Math.min(width(rect), height(rect));

export const equals = (rect1: Rect, rect2: Rect) =>
  rect1.every((coordinate, index) => coordinate === rect2[index]);

export const contains = ([x, y]: Point, [x0, y0, x1, y1]: Rect) =>
  x0 <= x && x <= x1 && y0 <= y && y <= y1;

export const corners = ([x0, y0, x1, y1]: Rect): [
  Point,
  Point,
  Point,
  Point
] => [[x0, y0], [x1, y0], [x0, y1], [x1, y1]];

export const containsRect = curry((rectParent: Rect, rectChild: Rect) =>
  corners(rectChild).every(point => contains(point, rectParent))
);

export const intersectsRect = curry((rect1: Rect, rect2: Rect) => {
  const corners1 = corners(rect1);
  const corners2 = corners(rect2);
  return (
    corners1.some(point => contains(point, rect2)) ||
    corners2.some(point => contains(point, rect1))
  );
});

export default Rect;
