import Rect, {
  corners,
  contains as rectContains,
  x0,
  x1,
  y0,
  y1
} from "./Rect";
import Point, { distance, x, y, equals, squaredDistance } from "./Point";
import { clamp } from "./../utils";
import { curry } from "rambda";

type Circle = [number, number, number];

export const toRect = ([x, y, radius]: Circle) => [
  x - radius,
  y - radius,
  x + radius,
  y + radius
];

export const center = ([x, y]: Circle): Point => [x, y];

export const radius = ([x, y, radius]: Circle) => radius;

export const contains = (point: Point, circle: Circle) =>
  squaredDistance(center(circle), point) <= radius(circle) ** 2;

export const containsRect = curry((circle: Circle, rect: Rect) =>
  corners(rect).every(point => contains(point, circle))
);

export const verticalLineIntersectsCircle = (
  lineX: number,
  [x, y, radius]: Circle
) => Math.abs(x - lineX) <= radius;

export const horizontalLineIntersectsCircle = (
  lineY: number,
  [x, y, radius]: Circle
) => Math.abs(y - lineY) <= radius;

export const intersectsRect = curry((circle: Circle, rect: Rect) => {
  const cent = center(circle);
  const nearestX = clamp(x0(rect), x1(rect), x(cent));
  const nearestY = clamp(y0(rect), y1(rect), y(cent));
  const nearestPoint: Point = [nearestX, nearestY];
  if (equals(cent, nearestPoint)) {
    // if center is inside the rectangle
    return true;
  }
  if (squaredDistance(cent, nearestPoint) <= radius(circle) ** 2) {
    // if center is outside, but still intersects
    return true;
  }
  return false;
});

export default Circle;
